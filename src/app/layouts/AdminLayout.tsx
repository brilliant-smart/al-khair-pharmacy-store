import AdminSidebar from "./AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
