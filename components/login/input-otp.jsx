export default function InputOTP({ otp, setOTP }) {
  return (
    <div>
      <label
        htmlFor="otp"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        OTP
      </label>
      <input
        type="text"
        id="otp"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder=""
      />
    </div>
  );
}
