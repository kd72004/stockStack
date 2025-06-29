export default function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-100 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
