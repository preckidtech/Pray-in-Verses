const Input = ({ label, type = "text", ...props }) => (
  <div className="w-full mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  </div>
);

export default Input;
