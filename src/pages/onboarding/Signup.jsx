import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";
import logo from "../../assets/images/prayinverse.png";

const Signup = () => {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lock scroll & true viewport
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const { name, email, password, confirmPassword } = form;
    if (!name.trim()) return toast.error("Name is required"), false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Enter a valid email address"), false;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password))
      return toast.error(
        "Password must be 8+ characters with uppercase, lowercase, number, and special character"
      ), false;

    if (password !== confirmPassword) return toast.error("Passwords do not match"), false;

    return true;
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
    if (exists) return toast.error("User already exists with this email");

    const hashedPassword = await hashPassword(form.password);
    const newUser = { name: form.name, email: form.email, password: hashedPassword };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    signup(newUser);
    toast.success("Account created successfully!");
    navigate("/login");
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo on top */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          />
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary outline-none"
            />
            <span
              className="absolute right-3 top-2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-lg">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
