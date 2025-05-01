"use client";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Modal,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiBookMarkedLine } from "react-icons/ri";
import { MdOutlineChat, MdKey, MdOutlineLogout } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "@/service/api";
const theme = {
  root: {
    base: "min-h-[100dvh]",
    collapsed: {
      on: "w-16",
      off: "w-72",
    },
    inner:
      "h-full min-h-[100dvh] overflow-y-auto overflow-x-hidden rounded-none rounded-r-lg bg-gray-50 px-3 py-4 dark:bg-gray-800",
  },
  collapse: {
    button:
      "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    icon: {
      base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      open: {
        off: "",
        on: "text-gray-900",
      },
    },
    label: {
      base: "ml-3 flex-1 whitespace-nowrap text-left",
      title: "sr-only",
      icon: {
        base: "h-6 w-6 transition delay-0 ease-in-out",
        open: {
          on: "rotate-180",
          off: "",
        },
      },
    },
    list: "space-y-2 py-2",
  },
  cta: {
    base: "mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-700",
    color: {
      blue: "bg-cyan-50 dark:bg-cyan-900",
      dark: "bg-dark-50 dark:bg-dark-900",
      failure: "bg-red-50 dark:bg-red-900",
      gray: "bg-gray-50 dark:bg-gray-900",
      green: "bg-green-50 dark:bg-green-900",
      light: "bg-light-50 dark:bg-light-900",
      red: "bg-red-50 dark:bg-red-900",
      purple: "bg-purple-50 dark:bg-purple-900",
      success: "bg-green-50 dark:bg-green-900",
      yellow: "bg-yellow-50 dark:bg-yellow-900",
      warning: "bg-yellow-50 dark:bg-yellow-900",
    },
  },
  item: {
    base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    active: "bg-gray-100 dark:bg-gray-700",
    collapsed: {
      insideCollapse: "group w-full pl-8 transition duration-75",
      noIcon: "font-bold",
    },
    content: {
      base: "flex-1 whitespace-nowrap px-3",
    },
    icon: {
      base: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
      active: "text-gray-700 dark:text-gray-100",
    },
    label: "",
    listItem: "",
  },
  items: {
    base: "",
  },
  itemGroup: {
    base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
  },
  logo: {
    base: "mb-5 flex items-center pl-2.5",
    collapsed: {
      on: "hidden",
      off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
    },
    img: " !h-30 w-full",
  },
};

export default function Component() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
    if (localStorage?.getItem("role") === "SUPERUSER") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = async (shouldSave) => {
    if (shouldSave && localStorage.getItem("chats")) {
      setIsLoading(true);
      try {
        let chats = JSON.parse(localStorage.getItem("chats"));
        chats.push({
          role: "user",
          content:
            "create short title of this conversation and answer les than 30 character. answer only one title.",
        });
        let { data } = await api.post(
          "/api/prompt",
          { chats, max_token: 512 },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        chats.pop();
        let response = await api.post(
          "/api/chats",
          {
            title: data.response.trim(),
            chats: chats,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error saving chat history:", error);
      } finally {
        setIsLoading(false);
        setShowConfirmModal(false);
        localStorage.clear();
        router.push("/");
      }
    } else {
      setIsLoading(false);
      setShowConfirmModal(false);
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-[100dvh]">
      <Sidebar
        theme={theme}
        aria-label="Sidebar with logo branding example"
        collapsed={isCollapsed}
        className="transition-all duration-300 ease-in-out"
      >
        <div
          size="sm"
          color="transparent"
          className={
            "flex items-center pb-3 " +
            (isCollapsed ? "justify-center" : "justify-end")
          }
          onClick={() => {
            if (window.innerWidth > 768) {
              setIsCollapsed(!isCollapsed);
            }
          }}
        >
          {isCollapsed ? (
            <GiHamburgerMenu className="h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
          ) : (
            <HiX className="h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
          )}
        </div>
        {/* <SidebarLogo
          hidden={isCollapsed}
          onClick={() => console.log("logo clicked")}
          href="#"
          img="https://github.com/ayusudi/prosterio/blob/main/sidebarlogo.png?raw=true"
          imgAlt="Flowbite logo"
        /> */}
        <div
          hidden={isCollapsed}
          className="w-full p-2 max-w-sm flex items-center gap-3 mb-2 text-center"
        >
          <img
            src="https://prosterio.vercel.app/logo.png"
            alt="Logo"
            className="w-24 h-24 rounded-full " // Adjusted width and height
          />
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-md font-bold text-gray-800 dark:text-white">
              Prosterio
            </h1>
            <p className="text-sm text-gray-500 text-left dark:text-blue-200">
              Streamline Tech Talent for Project Managers
            </p>
          </div>
        </div>
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="/dashboard" icon={LuLayoutDashboard}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/pm-assistant" icon={MdOutlineChat}>
              PM Assistant
            </SidebarItem>
            <SidebarItem href="/add-it-talent" icon={IoPersonAddSharp}>
              Add IT Talent
            </SidebarItem>
            {isAdmin ? (
              <SidebarItem href="/admin" icon={MdKey}>
                Admin
              </SidebarItem>
            ) : (
              <></>
            )}
            <SidebarItem href="/chats" icon={RiBookMarkedLine}>
              Chat History
            </SidebarItem>
            <SidebarItem
              onClick={() => {
                localStorage.getItem("chats") &&
                localStorage.getItem("chats") !== "[]"
                  ? setShowConfirmModal(true)
                  : handleLogout(false);
              }}
              href="#"
              icon={MdOutlineLogout}
            >
              Log Out
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      <Modal
        show={showConfirmModal}
        onClose={() => !isLoading && setShowConfirmModal(false)}
        className="fixed bottom-0 left-0 right-0 z-50"
        position="center"
      >
        <ModalBody>
          <h1 className="text-2xl font-bold mb-5">Confirm Logout</h1>
          <div className="space-y-6">
            <p className="text-base leading-relaxed">
              Do you want to save your chat history before logging out?
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <button
            onClick={() => handleLogout(true)}
            disabled={isLoading}
            className={`bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Saving...
              </div>
            ) : (
              "Yes, Save"
            )}
          </button>
          <button
            onClick={() => handleLogout(false)}
            disabled={isLoading}
            className={`text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            No, Don't Save
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
