// app/(technician)/layout.tsx
import TechnicianSidebar from "@/components/technician/TechnicianSidebar";
import TechnicianHeader from "@/components/technician/TechnicianHeader";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <TechnicianSidebar />

      <div className="flex-1 flex flex-col">
        <TechnicianHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
