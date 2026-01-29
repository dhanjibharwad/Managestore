// app/(technician)/layout.tsx
import TechnicianSidebar from "@/components/technician/TechnicianSidebar";
import TechnicianHeader from "@/components/technician/TechnicianHeader";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <TechnicianSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TechnicianHeader />
        <main className="p-3 sm:p-4 lg:p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
