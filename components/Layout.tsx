import React from "react";
import { User } from "@prisma/client";
import Header from "./header";

export const ChildrenLayout = ({
  title,
  children,
  user,
}: {
  title: string;
  children: React.ReactNode;
  user: User;
}) => {
  return (
    <main className="flex-1 bg-white">
      {/* Header */}
      <Header title={title} user={user} />

      {/* Content */}
      <section className="mt-8 p-6">{children}</section>
    </main>
  );
};
