import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
