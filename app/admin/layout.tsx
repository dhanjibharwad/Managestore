// app/(admin)/layout.tsx
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
