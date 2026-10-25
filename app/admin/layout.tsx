import type { Metadata } from "next";
import "./admin.css";
import { Toaster } from "@/components/admin/Toaster";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ad-root">
      {children}
      <Toaster />
    </div>
  );
}
