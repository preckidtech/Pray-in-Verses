import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import useAuthStore  from "../../store/useAuthStore";
import logo from "../../assets/images/prayinverse2.png";

const Login = () => {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const errMsg = useAuthStore((s) => s.error);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // lock scroll + mobile vh; also prefill remembered email
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

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }

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
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email address";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRememberMe = (email) => {
    if (rememberMe) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    handleRememberMe(email);

    try {
      const user = await login({ email, password }); // sets httpOnly cookie; returns {id,email,role,...}
      toast.success(`Welcome back${user?.displayName ? `, ${user.displayName}` : ""}!`, { duration: 2000 });
      navigate("/home"); // or "/" based on your routes
    } catch (e2) {
      // store already set error; show a toast too
      toast.error(e2?.message || errMsg || "Login failed", { duration: 2000 });
    }
  };

  const getInputStyling = (field) => {
    const base =
      "w-full border rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary outline-none transition-colors";
    return errors[field]
      ? `${base} border-red-300 bg-red-50`
      : `${base} border-gray-300 hover:border-gray-400`;
    };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="PrayInVerses Logo" className="h-32 w-32 object-contain" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Welcome Back</h2>

        <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className={getInputStyling("email")}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className={`${getInputStyling("password")} pr-10`}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <Button type="submit" variant="primary" className="w-full py-3 text-lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* API/store error (optional inline) */}
          {errMsg && !loading && (
            <p className="text-red-600 text-sm mt-2 text-center">{String(errMsg)}</p>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <Link to="/forgot-password" className="text-primary font-semibold hover:underline transition-colors block">
            Forgot your password?
          </Link>
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline transition-colors">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
