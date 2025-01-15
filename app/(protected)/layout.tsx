import Sidebar from "@/components/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Orama Board ",
    default: "Orama Board ",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme)",
        url: "/images/favicon.ico",
        href: "/images/favicon.ico",
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="max-h-screen sticky top-0 left-0">
        <Sidebar />
      </div>
      
      <div className="flex-1">{children}</div>
    </div>
  );
}
