export default function InputEmail({ email, setEmail, accountStatus }) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder=""
        readOnly={accountStatus === "OTP"}
      />
    </div>
  );
}
