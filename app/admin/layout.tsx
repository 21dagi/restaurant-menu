import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Wow Burger",
  description: "Wow Burger Restaurant & Drinks Management Portal",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {children}
    </div>
  );
}
