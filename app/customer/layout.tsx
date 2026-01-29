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
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerHeader />

        <main className="p-3 sm:p-4 lg:p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
