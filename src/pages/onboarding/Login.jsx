// src/pages/Onboarding/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";

const Login = () => {
  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const isHexSha256 = (s) => /^[0-9a-f]{64}$/i.test(s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLower = (form.email || "").trim().toLowerCase();
    const password = form.password || "";

    if (!emailLower || !password) {
      toast.error("Please enter email and password");
      return;
    }

    // safe parse
    let users = [];
    try {
      const raw = localStorage.getItem("users");
      users = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(users)) users = [];
    } catch {
      users = [];
    }

    const idx = users.findIndex(
      (u) => (u.email || "").toLowerCase() === emailLower
    );
    if (idx === -1) {
      toast.error("No account found with this email");
      return;
    }

    const user = users[idx];
    const hashedInput = await hashPassword(password);

    // if stored password looks hashed, compare hashes
    if (isHexSha256(user.password)) {
      if (user.password !== hashedInput) {
        toast.error("Incorrect password");
        return;
      }
    } else {
      // stored password is plain text - allow login and migrate to hashed
      if (user.password !== password) {
        toast.error("Incorrect password");
        return;
      }
      // migrate: replace stored plain password with hashed version
      users[idx] = { ...user, password: hashedInput };
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Login success
    const safeUser = { ...users[idx] };
    // optionally remove password before sending to store
    delete safeUser.password;

    if (typeof loginAction === "function") {
      try {
        loginAction(safeUser);
      } catch {
        // ignore store errors
      }
    }

    toast.success(`Welcome back, ${user.name || "User"}!`);
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream px-4">
      <div className="bg-white p-6 rounded-2xl shadow-soft w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-9 p-1 text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-lg">
            Login
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-primary font-semibold hover:underline block mb-2">
            Forgot Password?
          </Link>
          <p>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
