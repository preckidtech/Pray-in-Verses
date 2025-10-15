import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/images/prayinverse2.png";

const Signup = () => {
  const doSignup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validation, setValidation] = useState({
    name: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" },
    passwordsMatch: false,
  });

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

  useEffect(() => {
    validateFormFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getPasswordError = (password) => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/\d/.test(password)) return "Password must contain a number";
    if (!/[@$!%*?&#]/.test(password)) return "Password must contain a special character (@$!%*?&#)";
    return "";
  };

  const validateFormFields = () => {
    const next = { ...validation };
    next.name = {
      isValid: form.name.trim().length >= 2,
      message: form.name.trim().length >= 2 ? "" : "Name must be at least 2 characters",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    next.email = {
      isValid: emailRegex.test(form.email),
      message: emailRegex.test(form.email) ? "" : "Please enter a valid email address",
    };
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    const passwordError = getPasswordError(form.password);
    next.password = { isValid: passwordRegex.test(form.password), message: passwordError };
    const passwordsMatch =
      form.password === form.confirmPassword && form.confirmPassword !== "";
    next.confirmPassword = {
      isValid: passwordsMatch,
      message: !form.confirmPassword ? "" : passwordsMatch ? "" : "Passwords do not match",
    };
    next.passwordsMatch = passwordsMatch;
    setValidation(next);
  };

  const isFormValid = () =>
    validation.name.isValid &&
    validation.email.isValid &&
    validation.password.isValid &&
    validation.confirmPassword.isValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fix all errors before submitting");
      return;
    }
    setIsSubmitting(true);
    try {
      // Calls API: POST /auth/signup → { id,email,displayName,role,createdAt }
      await doSignup({
        displayName: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      // useAuthStore sets error; also show toast
      toast.error(err?.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyling = (fieldName) => {
    const base = "w-full border rounded-lg px-3 py-2 focus:ring-2 outline-none transition-colors";
    if (!form[fieldName]) return `${base} border-gray-300 focus:ring-primary`;
    return validation[fieldName]?.isValid
      ? `${base} border-green-300 focus:ring-green-500 bg-green-50`
      : `${base} border-red-300 focus:ring-red-500 bg-red-50`;
  };

  return (
    <div
      className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary overflow-hidden px-4 sm:px-6"
      style={{ height: "calc(var(--vh,1vh)*100)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center p-6">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="PrayInverse Logo"
            className="h-42 w-32 sm:h-28 sm:w-28 m-0 p-0 object-contain"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Sign Up</h2>

        <form className="w-full space-y-4 " onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={getInputStyling("name")}
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

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className={getInputStyling("email")}
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

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className={`${getInputStyling("password")} pr-10`}
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

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`${getInputStyling("confirmPassword")} pr-10"`
                }
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

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
