"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct for App Router

export default function isAdmin(Component) {
  return function IsAuth(props) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token =
        localStorage.getItem("token") &&
        localStorage.getItem("role") === "SUPERUSER";
      if (!token) {
        return router.push("/");
      } else if (
        localStorage.getItem("token") &&
        localStorage.getItem("role") !== "SUPERUSER"
      ) {
        return router.push("/dashboard");
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    if (!isAuthenticated) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}
