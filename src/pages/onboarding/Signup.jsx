import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/images/praythebible.png"

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = form;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    // Password must contain 8+ chars, uppercase, lowercase, number, special char
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // 🔐 Hash password using SHA-256
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === form.email);

    if (exists) {
      toast.error("User already exists with this email");
      return;
    }

    const hashedPassword = await hashPassword(form.password);

    const newUser = {
      name: form.name,
      email: form.email,
      password: hashedPassword, // 🔐 Save only hashed password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    signup(newUser);
    toast.success("Account created successfully!");
    navigate("/login");
  };

  return (
    <div className="h-full overflow-hidden flex items-center justify-center bg-white px-3 sm:px-4">
      <div className="bg-white grid align-middle rounded-lg shadow-soft w-full max-w-md max-h-[95vh] ">
        <div className="p-4 sm:p-6">
          <img src={logo} alt="pray in verse" className="m-auto h-12 w-12 sm:h-16 sm:w-16 object-cover object-center mb-3 sm:mb-4"/>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Sign Up</h2>
          
          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Password with eye toggle */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>

            {/* Confirm Password with eye toggle */}
            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>

            <Button type="submit" variant="primary" className="w-full py-2 sm:py-3">
              Sign Up
            </Button>
          </form>

          {/* Login redirect */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;