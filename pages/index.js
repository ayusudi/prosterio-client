import { Button } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [accountStatus, setAccountStatus] = useState("Yes");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-sans bg-gray-50">
      <div className="w-full p-2 max-w-sm flex items-center gap-4 text-center">
        <img
          src="https://raw.githubusercontent.com/ayusudi/prosterio/refs/heads/main/logo.webp"
          alt="Logo"
          className="w-36 h-36 rounded-full " // Adjusted width and height
        />
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-3xl font-bold text-gray-800">Prosterio</h1>
          <p className="text-lg text-gray-500 text-left">
            Streamline Tech Talent for Project Managers
          </p>
        </div>
      </div>
      <form
        className="w-full p-2 max-w-sm flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/dashboard");
        }} // Prevent default form submission
      >
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
            // Apply Tailwind classes for input styling
            className="w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="forgot">Yes but forgot password</option>
          </select>
        </div>
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col gap-4">
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
            />
          </div>

          <div className="relative">
            {" "}
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 top-6" // Adjusted top positioning
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {showPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
          <Button
            type="submit"
            className="cursor-pointer w-full px-4 py-2 mt-4 font-semibold text-white bg-[#3C5EAA] rounded-md hover:bg-[#224389] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
}
