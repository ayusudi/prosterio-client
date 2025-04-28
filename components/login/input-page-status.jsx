export default function InputPageStatus({ accountStatus, setAccountStatus }) {
  return (
    <div>
      <label
        htmlFor="accountStatus"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Do you have Prosperio Account?
      </label>
      <select
        id="accountStatus"
        value={accountStatus}
        onChange={(e) => setAccountStatus(e.target.value)}
        className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="Yes">Yes</option>
        <option value={accountStatus === "OTP" ? "OTP" : "Forgot"}>
          Yes, but forgot password
        </option>
        <option value="No">No</option>
      </select>
    </div>
  );
}
