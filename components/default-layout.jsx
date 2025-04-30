"use client";
import { Source_Sans_3 } from "next/font/google";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const DefaultLayout = ({ children }) => {
  const router = useRouter();
  const list = {
    "/dashboard": {
      title: "Dashboard",
      icon: "📊",
    },
    "/chats": {
      title: "Chat History",
      icon: "📬",
    },
    "/add-it-talent": {
      title: "Add IT Talent",
      icon: "🧑🏻‍💻",
    },
    "/admin": {
      title: "Admin",
      icon: "🔑",
    },
    "/add-admin": {
      title: "Add Admin",
      icon: "🔑",
    },
    "/pm-assistant": {
      title: "PM Assistant",
      icon: "💬",
    },
  };
  const [current, setCurrent] = useState(list["/dashboard"]);
  useEffect(() => {
    for (const key in list) {
      if (router.pathname.startsWith(key)) {
        setCurrent(list[key]);
        break;
      }
    }
  }, [router]);
  return (
    <div className={`${sourceSans.className} flex`}>
      <Sidebar />
      <div
        className={`flex-1 md:max-w-[860px] py-10 md:py-12 ${
          router.pathname === "/pm-assistant" ? "pb-0 md:pb-0" : ""
        } px-4 mx-auto `}
      >
        <div>
          <h1 className="text-3xl font-bold pb-2 md:pb-4 border-b-2 border-[#6495ed]">
            {current.icon} {current.title}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
