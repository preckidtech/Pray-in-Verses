// src/pages/auth/ForgotPassword.jsx
import { useEffect, useMemo, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/prayinverse2.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Small request helper (cookie auth)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
async function request(path, { method = "POST", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text().catch(() => "");
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) {
    const err = new Error(payload?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => new URLSearchParams(location.search).get("token") || "", [location.search]);

  // step: 1=request link, 2=reset form
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock scroll + set --vh
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // If a token is present in URL, show reset form directly
  useEffect(() => {
    if (token) setStep(2);
    else setStep(1);
  }, [token]);

  // --- Handlers ---
  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await request("/auth/forgot-password", { body: { email: email.trim() } });
      toast.success("If that email exists, we’ve sent a reset link.");
      // keep user on step 1; they will open the link from their email
    } catch (err) {
      // we still show a generic success-style message to avoid enumeration
      toast.success("If that email exists, we’ve sent a reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithToken = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Please enter a new password.");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters.");
    if (newPassword !== confirm) return toast.error("Passwords do not match.");

    if (!token) {
      toast.error("Missing or invalid reset token.");
      return;
    }

    setLoading(true);
    try {
      await request("/auth/reset-password", { body: { token, newPassword } });
      toast.success("Password reset successfully. Please log in.");
      // Clean the tokenized URL then go to login
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Reset failed. The link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="h-32 w-32 object-contain" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendLink}>
            <Input
              label="Enter your registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              You’ll receive an email with a secure link to reset your password.
            </p>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetWithToken}>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </Button>
            {!token && (
              <p className="text-xs text-amber-600">
                No reset token detected. Open the link from your email to continue.
              </p>
            )}
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-primary font-semibold hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
