"use client";

import api from "@/service/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SubmitButton from "@/components/login/submit-button";
import InputPassword from "@/components/login/input-password";
import HeaderLogin from "@/components/login/header-login";
import InputPageStatus from "@/components/login/input-page-status";
import InputOTP from "@/components/login/input-otp";
import InputEmail from "@/components/login/input-email";

export default function Home() {
  const router = useRouter();
  const [accountStatus, setAccountStatus] = useState("Yes");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (accountStatus === "Yes") {
      login();
    } else if (accountStatus === "Forgot") {
      requestOTP();
    } else if (accountStatus === "OTP") {
      changePassword();
    }
  };

  const login = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/login", {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("role", response.data.user.role);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      let errorMessage = "Failed to login. Please try again.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case 404:
            errorMessage = "Login service not found. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/forgot-password/request", {
        email,
      });
      if (response.data) {
        setToast({
          show: true,
          message: "Password reset link sent to your email.",
          type: "success",
        });
        setAccountStatus("OTP");
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      let errorMessage =
        "Failed to send password reset link. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Email not found. Please try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/forgot-password/verify", {
        email,
        otp,
        new_password: password,
      });
      if (response.data) {
        setToast({
          show: true,
          message: "Password changed successfully. Please login.",
          type: "success",
        });
        setAccountStatus("Yes");
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      let errorMessage = "Failed to change password. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Invalid OTP. Please try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
    try {
      let { data } = await api.get("/api/users/myself", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      let { name, email, role } = data.user;
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      router.push("/dashboard");
    } catch (error) {
      localStorage.clear();
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      let errorMessage = "Failed to verify token. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid token. Please login again.";
            break;
          case 404:
            errorMessage = "User not found. Please try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      verifyToken();
    }
  }, []);
  useEffect(() => {
    if (accountStatus !== "OTP") {
      setEmail("");
    }
    setPassword("");
    setOTP("");
  }, [accountStatus]);
  // Add useEffect to handle toast auto-dismiss
  useEffect(() => {
    let timer;
    if (toast.show) {
      timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 5000); // 5 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [toast.show, toast.message]); // Re-run when toast changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-sans bg-gray-50">
      <div className="flex flex-col items-center justify-start h-[600px]">
        <HeaderLogin />
        <form
          className="w-full p-2 max-w-sm flex flex-col gap-5"
          onSubmit={handleSubmit} // Prevent default form submission
        >
          <InputPageStatus
            accountStatus={accountStatus}
            setAccountStatus={setAccountStatus}
          />
          <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col gap-4">
            {accountStatus !== "No" ? (
              <InputEmail
                email={email}
                setEmail={setEmail}
                accountStatus={accountStatus}
              />
            ) : (
              <div>
                <p className="text-center">
                  You don't have access rights.
                  <br />
                  Please contact your supervisor for access.
                </p>
              </div>
            )}

            {accountStatus === "OTP" && <InputOTP otp={otp} setOTP={setOTP} />}
            {(accountStatus === "OTP" || accountStatus === "Yes") && (
              <InputPassword
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                accountStatus={accountStatus}
              />
            )}
            {accountStatus !== "No" && (
              <SubmitButton
                isLoading={isLoading}
                accountStatus={accountStatus}
              />
            )}
          </div>
        </form>
      </div>
      {toast.show && <setToast toast={toast} setToast={setToast} />}
    </div>
  );
}
