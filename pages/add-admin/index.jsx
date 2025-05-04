"use client";
import DefaultLayout from "@/components/default-layout";
import { Button, Label, TextInput, Select, Alert } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";
import isAdmin from "@/components/is-admin";
import api from "@/service/api";
import Toast from "@/components/toast";

function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (name === "password" || name === "confirmPassword") {
      setError("");
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirmation password do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return "";
    }

    setIsLoading(true);
    try {
      let res = await api.post(
        "/api/users",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setToast({
        show: true,
        message: "Admin created successfully",
        type: "success",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create admin";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const backToAdmin = () => {
    router.push("/admin");
  };

  return (
    <DefaultLayout>
      {toast.show && <Toast toast={toast} setToast={setToast} />}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-5">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 ">
            Isi data admin di bawah ini.
            <br />
            Admin yang dapat dibuat merupakan role HR.
          </p>
          <button
            onClick={backToAdmin}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <TextInput
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama admin"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email admin"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password admin"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Password Confirmation</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-type password"
              required
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              color="gray"
              onClick={backToAdmin}
              type="button"
              disabled={isLoading}
              className=" cursor-pointer focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cancel
            </Button>
            <Button
              color="blue"
              type="submit"
              disabled={isLoading}
              className="cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating..
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}

export default isAdmin(Page);
