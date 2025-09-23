import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Same viewport fix as Welcome
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.removeProperty("--vh");
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      toast.error("No account found with this email");
      return;
    }

    toast.success("Email verified. You can reset your password now.");
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const encoder = new TextEncoder();
    const data = encoder.encode(newPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === email ? { ...u, password: hashedPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Password reset successfully. You can now log in.");
    setStep(1);
    setEmail("");
    setNewPassword("");
  };

  return (
    <div className="min-h-[calc(var(--vh,1vh)*100)] flex items-center justify-center bg-white px-3 sm:px-4">
      <div className="bg-white p-6 rounded-2xl shadow-soft w-full max-w-md flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleVerifyEmail}>
            <Input
              label="Enter your registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Verify Email
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-primary hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
