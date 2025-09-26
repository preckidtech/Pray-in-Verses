import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import { useAuthStore } from "../../store";
import logo from "../../assets/images/prayinverse2.png";

const Signup = () => {
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  // Form state management
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation states
  const [validation, setValidation] = useState({
    name: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
    passwordsMatch: false,
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

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  /**
   * Real-time validation effect
   * Validates form fields as user types for better UX
   */
  useEffect(() => {
    validateFormFields();
  }, [form]);

  /**
   * Handle input changes and update form state
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Get the first missing password requirement
   * @param {string} password - The password to validate
   * @returns {string} - Error message for the first missing requirement
   */
  const getPasswordError = (password) => {
    if (!password) return "";
    
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain a lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain an uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain a number";
    }
    if (!/[@$!%*?&#]/.test(password)) {
      return "Password must contain a special character (@$!%*?&#)";
    }
    return "";
  };

  /**
   * Real-time form validation
   * This function will be easy to modify when integrating with backend validation
   */
  const validateFormFields = () => {
    const newValidation = { ...validation };

    // Name validation
    newValidation.name = {
      isValid: form.name.trim().length >= 2,
      message: form.name.trim().length >= 2 ? "" : "Name must be at least 2 characters"
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    newValidation.email = {
      isValid: emailRegex.test(form.email),
      message: emailRegex.test(form.email) ? "" : "Please enter a valid email address"
    };

    // Password validation - using the new single error approach
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const passwordError = getPasswordError(form.password);
    newValidation.password = {
      isValid: passwordRegex.test(form.password),
      message: passwordError
    };

    // Password confirmation validation
    const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";
    newValidation.confirmPassword = {
      isValid: passwordsMatch,
      message: !form.confirmPassword ? "" : passwordsMatch ? "" : "Passwords do not match"
    };
    newValidation.passwordsMatch = passwordsMatch;

    setValidation(newValidation);
  };

  /**
   * Check if form is valid for submission
   * @returns {boolean} - True if all fields are valid
   */
  const isFormValid = () => {
    return (
      validation.name.isValid &&
      validation.email.isValid &&
      validation.password.isValid &&
      validation.confirmPassword.isValid
    );
  };

  /**
   * Hash password for secure storage
   * TODO: Replace with backend hashing when API is ready
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
   * Handle form submission
   * TODO: Replace localStorage logic with API calls when backend is ready
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with API call - POST /api/auth/signup
      // Check if user already exists (will be handled by backend)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === form.email.toLowerCase()
      );

      if (existingUser) {
        toast.error("User already exists with this email");
        setIsSubmitting(false);
        return;
      }

      // Hash password (backend will handle this)
      const hashedPassword = await hashPassword(form.password);
      
      // Create user object (structure should match backend user model)
      const newUser = {
        id: Date.now(), // TODO: Remove when backend generates IDs
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: hashedPassword, // TODO: Remove when backend handles hashing
        joinDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        createdAt: new Date().toISOString(),
        // Profile data that will be used across the app
        profileData: {
          totalPrayers: 0,
          answeredPrayers: 0,
          savedPrayers: 0,
          notifications: true,
          privateProfile: false,
        }
      };

      // TODO: Replace with API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: newUser.name, email: newUser.email, password: form.password })
      // });
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Update auth store (will receive user data from backend)
      signup(newUser);
      
      toast.success("Account created successfully!");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Get input field styling based on validation state
   * @param {string} fieldName - Name of the field to style
   * @returns {string} - CSS classes for the input
   */
  const getInputStyling = (fieldName) => {
    const base = "w-full border rounded-lg px-3 py-2 focus:ring-2 outline-none transition-colors";
    
    if (!form[fieldName]) return `${base} border-gray-300 focus:ring-primary`;
    
    if (validation[fieldName]?.isValid) {
      return `${base} border-green-300 focus:ring-green-500 bg-green-50`;
    } else {
      return `${base} border-red-300 focus:ring-red-500 bg-red-50`;
    }
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="PrayInverse Logo" 
            className="h-42 w-32 sm:h-28 sm:w-28 m-0 p-0 object-contain" 
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Form */}
        <form className="w-full space-y-4 " onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={getInputStyling('name')}
              disabled={isSubmitting}
            />
            {form.name && !validation.name.isValid && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {validation.name.message}
              </p>
            )}
            {form.name && validation.name.isValid && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Valid name
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className={getInputStyling('email')}
              disabled={isSubmitting}
            />
            {form.email && !validation.email.isValid && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {validation.email.message}
              </p>
            )}
            {form.email && validation.email.isValid && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Valid email
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className={`${getInputStyling('password')} pr-10`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Single password error message */}
            {form.password && !validation.password.isValid && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                {validation.password.message}
              </p>
            )}
            {form.password && validation.password.isValid && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Strong password
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`${getInputStyling('confirmPassword')} pr-10`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Real-time password match feedback */}
            {form.confirmPassword && (
              <div className="mt-1">
                {validation.passwordsMatch ? (
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                ) : (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Passwords do not match
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 text-lg" 
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;