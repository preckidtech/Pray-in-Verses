import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
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

  const handleResetPassword = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Password reset successfully. You can now log in.");
    setStep(1);
    setEmail("");
    setNewPassword("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-6 rounded-2xl shadow-soft w-full max-w-md">
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
