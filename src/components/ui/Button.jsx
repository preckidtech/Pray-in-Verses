  const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const base = "px-4 py-2 rounded-xl font-medium transition-all";
    const styles = {
      primary: "bg-primary text-white",
      secondary: "border border-primary text-primary hover:bg-primary hover:text-white",
      tertiary: "bg-white text-yellow-500  ",
      ghost: "text-primary ",
      water: "text-white"
    };
    return (
      <button className={`${base} ${styles[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  export default Button;
