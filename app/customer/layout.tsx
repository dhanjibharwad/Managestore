// app/(customer)/layout.tsx
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerHeader from "@/components/customer/CustomerHeader";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <CustomerSidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <CustomerHeader />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
