"use client";

import {
  checkAndCreateNotifications,
  getNotifications,
} from "@/actions/notifications/notification";
import { calculateTimeline } from "@/lib/helper/helper";
import { Notification, User } from "@prisma/client";
import { Bell, BellDot, CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ({ title, user }: { title: string; user: User }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      await checkAndCreateNotifications(user?.id);
      try {
        const data = await getNotifications(user?.id);
        setNotifications(data?.notifications as Notification[]);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    loadNotifications();
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-100 p-6 flex justify-between items-center mb-10">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-blue-700 capitalize">
            {title}
          </h1>

          {title === "dashboard" && (
            <p className="mt-4">
              Welcome to your dashboard {user?.first_name}!
            </p>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative cursor-pointer">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative text-blue-700"
            >
              {unreadCount > 0 ? (
                <BellDot strokeWidth={2} />
              ) : (
                <Bell strokeWidth={2} />
              )}

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`p-2 border-b ${
                          !n.isRead ? "bg-gray-100" : ""
                        }`}
                      >
                        <span>{n.message}</span>
                        <span className="block text-xs text-gray-500">
                          {/* {calculateTimeline(new Date(n.triggerDate))} */}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <CircleUserRound color="#1d4ed8" strokeWidth={2} />

            {/* <span className="text-sm font-medium text-gray-700">
              {user?.first_name}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

// import React, { useState, useEffect } from "react";
// import calculateTimeline from "@/utils/calculateTimeline"; // Import your timeline function
// import { fetchNotifications } from "@/api/notifications"; // Adjust the path based on your setup

// const ChildrenLayout = ({ title, children, user }) => {

//   return (
//     <main className="flex-1 bg-white">

//       {/* Content */}
//       <section className="mt-8 p-6">{children}</section>
//     </main>
//   );
// };

// export default ChildrenLayout;
