import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";
import logo from "../../assets/images/prayinverse2.png";

const Login = () => {
  const loginAction = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  // Form state management
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });

  // UI state management
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  /**
   * Lock scroll and set viewport height for mobile optimization
   * This ensures the form is properly displayed on mobile devices
   */
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

    // Check for remembered credentials on component mount
    checkRememberedCredentials();

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  /**
   * Check for remembered user credentials
   * TODO: Implement secure credential storage when backend is ready
   */
  const checkRememberedCredentials = () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  };

  /**
   * Handle input changes and clear errors
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validate form fields
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Hash password for comparison
   * TODO: Remove this when backend handles authentication
   * @param {string} password - Plain text password
   * @returns {string} - Hashed password
   */
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  /**
   * Handle remember me functionality
   * @param {string} email - User email to remember
   */
  const handleRememberMe = (email) => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  };

  /**
   * Handle admin login
   * TODO: Replace with proper admin authentication via backend
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {boolean} - True if admin login successful
   */
  const handleAdminLogin = (email, password) => {
    // TODO: Replace with backend admin authentication
    if (email === "admin@gmail.com" && password === "Krd364ca@2004") {
      const adminUser = {
        id: "admin",
        name: "Administrator",
        email: "admin@gmail.com",
        role: "admin",
        joinDate: "System Admin",
        profileData: {
          totalPrayers: 0,
          answeredPrayers: 0,
          savedPrayers: 0,
          notifications: true,
          privateProfile: false,
        }
      };
      
      loginAction(adminUser);
      toast.success("Welcome Admin!", { duration: 2000 });
      navigate("/admin");
      return true;
    }
    return false;
  };

  /**
   * Handle regular user login
   * TODO: Replace localStorage logic with API authentication
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {boolean} - True if login successful
   */
  const handleUserLogin = async (email, password) => {
    try {
      // TODO: Replace with API call - POST /api/auth/login
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        toast.error("No account found with this email", { duration: 2000 });
        return false;
      }

      // Verify password (backend will handle this)
      const hashedInput = await hashPassword(password);
      if (user.password !== hashedInput) {
        toast.error("Incorrect password", { duration: 2000 });
        return false;
      }

      // Create safe user object (remove sensitive data)
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
        profileData: user.profileData || {
          totalPrayers: 0,
          answeredPrayers: 0,
          savedPrayers: 0,
          notifications: true,
          privateProfile: false,
        }
      };

      // Store user session data
      // TODO: Backend will handle JWT tokens and session management
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
      
      loginAction(safeUser);
      toast.success(`Welcome back, ${user.name}!`, { duration: 2000 });
      navigate("/home");
      return true;

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.", { duration: 2000 });
      return false;
    }
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      // Handle remember me
      handleRememberMe(email);

      // Try admin login first
      if (handleAdminLogin(email, password)) {
        return;
      }

      // Handle regular user login
      await handleUserLogin(email, password);

    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("An error occurred during login. Please try again.", { duration: 2000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get input field styling based on error state
   * @param {string} fieldName - Name of the field to style
   * @returns {string} - CSS classes for the input
   */
  const getInputStyling = (fieldName) => {
    const base = "w-full border rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary outline-none transition-colors";
    
    if (errors[fieldName]) {
      return `${base} border-red-300 bg-red-50`;
    }
    
    return `${base} border-gray-300 hover:border-gray-400`;
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="PrayInverse Logo"
            className="h-32 w-32 sm:h-32 sm:w-32 object-contain"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
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
                className={getInputStyling('email')}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
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
                className={`${getInputStyling('password')} pr-10`}
                disabled={isSubmitting}
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
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me Checkbox */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <Link
            to="/forgot-password"
            className="text-primary font-semibold hover:underline transition-colors block"
          >
            Forgot your password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center mb-1">Demo Admin Access:</p>
          <p className="text-xs text-gray-600 text-center">admin@gmail.com / Krd364ca@2004</p>
        </div>
      </div>
    </div>
  );
};

export default Login;