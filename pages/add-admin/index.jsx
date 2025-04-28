"use client";
import DefaultLayout from "@/components/default-layout";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Add validation and API call here
      console.log(formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/admin");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const backToAdmin = () => {
    router.push("/admin");
  };

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-5">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 ">Isi data admin di bawah ini.</p>
          <button
            onClick={backToAdmin}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nama</Label>
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
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Pilih role admin
              </option>
              <option value="HR">HR</option>
              <option value="SUPERADMIN">Superadmin</option>
            </Select>
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
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Masukkan konfirmasi password admin"
              required
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              color="gray"
              onClick={backToAdmin}
              type="button"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button color="blue" type="submit" disabled={isLoading}>
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
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
}
