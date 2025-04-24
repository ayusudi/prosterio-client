import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
} from "flowbite-react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsGearFill } from "react-icons/bs";
import { RiBookMarkedLine } from "react-icons/ri";
import { MdOutlineChat, MdKey, MdOutlineLogout } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
const theme = {
  root: {
    base: "min-h-[100vh]",
    collapsed: {
      on: "w-16",
      off: "w-72",
    },
    inner:
      "h-full min-h-[100vh] overflow-y-auto overflow-x-hidden rounded-none rounded-r-lg bg-gray-50 px-3 py-4 dark:bg-gray-800",
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    console.log("isCollapsed:", isCollapsed);
  }, [isCollapsed]);
  return (
    <div className="relative min-h-[100vh]">
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
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <GiHamburgerMenu className="h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
          ) : (
            <HiX className="h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
          )}
        </div>
        <SidebarLogo
          hidden={isCollapsed}
          onClick={() => console.log("logo clicked")}
          href="#"
          img="https://github.com/ayusudi/prosterio/blob/main/sidebarlogo.png?raw=true"
          imgAlt="Flowbite logo"
        />
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="/dashboard" icon={LuLayoutDashboard}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/chat" icon={MdOutlineChat}>
              PM Assistant
            </SidebarItem>
            <SidebarItem href="/add-it-talent" icon={IoPersonAddSharp}>
              Add IT Talent
            </SidebarItem>
            <SidebarItem href="/add-admin" icon={MdKey}>
              Add Admin
            </SidebarItem>
            <SidebarItem href="/chat-history" icon={RiBookMarkedLine}>
              Chat History
            </SidebarItem>
            <SidebarItem href="/settings" icon={BsGearFill}>
              Settings
            </SidebarItem>
            <SidebarItem href="/" icon={MdOutlineLogout}>
              Log Out
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </div>
  );
}
