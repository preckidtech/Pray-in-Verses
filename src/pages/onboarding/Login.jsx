import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";
import logo from "../../assets/images/prayinverse2.png";

const Login = () => {
  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) return toast.error("Email & password required");

    // ✅ Admin login bypass
    if (email === "admin@gmail.com" && password === "Krd364ca@2004") {
      toast.success("Welcome Admin!");
      loginAction?.({ email: "admin@gmail.com", role: "admin" });
      return navigate("/admin"); // Redirect to Admin form page
    }

    // ✅ Normal user login
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email.toLowerCase() === email);
    if (!user) return toast.error("No account found");

    const hashedInput = await hashPassword(password);
    if (user.password !== hashedInput) return toast.error("Incorrect password");

    const safeUser = { ...user };
    delete safeUser.password;

    loginAction?.(safeUser);
    toast.success(`Welcome back, ${user.name || "User"}!`);
    navigate("/home");
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo on top */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="logo"
            className="h-32 w-32 sm:h-32 sm:w-32 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary outline-none"
            />
            <span
              className="absolute right-3 top-2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg"
          >
            Login
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link
            to="/forgot-password"
            className="text-primary font-semibold hover:underline block mb-2"
          >
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
