import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/prayinverse2.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Lock scroll & true viewport
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

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

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
    users = users.map((u) => (u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: hashedPassword } : u));
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Password reset successfully. You can now log in.");
    setStep(1);
    setEmail("");
    setNewPassword("");
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo on top */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="h-32 w-32 sm:h-32 sm:w-32 object-contain" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Forgot Password</h2>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleVerifyEmail}>
            <Input
              label="Enter your registered email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full py-3">
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
            <Button type="submit" variant="primary" className="w-full py-3">
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-primary font-semibold hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
