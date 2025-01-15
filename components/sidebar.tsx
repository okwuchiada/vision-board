"use client";

import { ReactNode, useState } from "react";
import { Cog, Home, LogOut, Menu, SquareSquare, User } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth/login";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Boards", icon: <SquareSquare />, path: "/boards" },
    { name: "Profile", icon: <User />, path: "/profile", isDiabled: true },
    { name: "Settings", icon: <Cog />, path: "/settings", isDisabled: true },
  ];
  return (
    <div
    // className="flex flex-col bg-blue-500 text-white h-screen "
    >
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-blue-500 text-white py-6  h-screen transition-width duration-300 flex flex-col`}
      >
        <div className="flex items-center mb-6 justify-between p-4">
          {/* Logo or App Name */}{" "}
          <h1
            className={`text-2xl font-bold ${
              isOpen ? "block" : "hidden"
            } transition-opacity duration-300`}
          >
            Orama Board
          </h1>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <Menu />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          {menuItems.map((item, index) => (
            <Link
              href={item?.isDisabled ? "/dashboard" : item.path}
              key={index}
            >
              <div className="p-4 hover:bg-blue-600 cursor-pointer rounded transition duration-300">
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span
                    className={`${
                      isOpen ? "block" : "hidden"
                    } transition-opacity duration-300`}
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer or Additional Links */}
        <div className="mt-auto">
          <div>
            <div className="p-4 hover:bg-blue-600 px-4 cursor-pointer rounded transition duration-300" onClick={() => {
            logout()
          }}>
              <div className="flex items-center gap-4">
                <LogOut />
                <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
