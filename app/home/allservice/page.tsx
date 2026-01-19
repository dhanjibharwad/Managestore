import React from 'react';
import { ClipboardList, Wrench, Users, Wallet, ShieldCheck, ArrowRight, LucideIcon } from 'lucide-react';

// Define the shape of the service item
interface Service {
  name: string;
  href: string;
}

// Define the shape of a service category
interface ServiceCategory {
  title: string;
  icon: LucideIcon; // Icon component from lucide-react
  description: string;
  color: string; // Tailwind color class for visual branding
  services: Service[];
}

// 1. Service Data Grouped by Category
const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: "Ticket & Service",
    icon: ClipboardList,
    description: "Manage customer repair requests, contracts, check-ins, and track activity logs.",
    color: "text-blue-600 bg-blue-50/70",
    services: [
      { name: "Repair Tickets Management", href: "/home/allservice/repair-ticket" },
      { name: "Annual Maintenance Contract", href: "#" },
      { name: "Self Check-In", href: "#" },
      { name: "Activity Logs", href: "#" },
    ],
  },
  {
    title: "Operations & Tasks",
    icon: Wrench,
    description: "Tools for scheduling, task assignment, employee access control, and module visibility.",
    color: "text-amber-600 bg-amber-50/70",
    services: [
      { name: "Task Management", href: "#" },
      { name: "Work Scheduler", href: "#" },
      { name: "Employee Permissions", href: "#" },
      { name: "Show / Hide Modules", href: "#" },
    ],
  },
  {
    title: "CRM & Leads",
    icon: Users,
    description: "Handle customer relationships, lead generation, pickup/drop logistics, and outsource workflows.",
    color: "text-green-600 bg-green-50/70",
    services: [
      { name: "Lead Management", href: "#" },
      { name: "Pickup Drop Management", href: "#" },
      { name: "Outsource Management", href: "#" },
    ],
  },
  {
    title: "Inventory & Finance",
    icon: Wallet,
    description: "Manage stock, purchases, expenses, and point-of-sale transactions efficiently.",
    color: "text-purple-600 bg-purple-50/70",
    services: [
      { name: "Inventory Management", href: "#" },
      { name: "Purchase Management", href: "#" },
      { name: "Expense Management", href: "#" },
      { name: "Point of Sale (POS)", href: "#" },
    ],
  },
  {
    title: "Security & Verification",
    icon: ShieldCheck,
    description: "Features dedicated to ensuring security, verification protocols, and data protection.",
    color: "text-red-600 bg-red-50/70",
    services: [
      { name: "OTP for Delivery", href: "#" },
      { name: "Device Image Gallery", href: "#" },
      { name: "Data Recovery Management", href: "#" },
    ],
  },
];


// 2. Service Card Component
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  // Using an anchor tag for Next.js-style navigation links
  <a
    href={service.href}
    className="flex items-center justify-between p-4 transition-all duration-200 bg-white rounded-xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-blue-200 group"
  >
    <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
      {service.name}
    </span>
    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
  </a>
);

// 3. Category Section Component
const ServiceCategorySection: React.FC<ServiceCategory> = ({ title, icon: Icon, description, color, services }) => (
  <div className="flex flex-col p-6 border border-gray-100 rounded-2xl shadow-lg bg-white/70 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl">
    {/* Header */}
    <div className={`p-3 w-fit rounded-full mb-4 ${color}`}>
      <Icon className="w-7 h-7" />
    </div>

    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-500 mb-6 text-base">{description}</p>

    {/* Service List Grid */}
    <div className="flex flex-col space-y-3">
      {services.map((service) => (
        <ServiceCard key={service.name} service={service} />
      ))}
    </div>
  </div>
);


// 4. Main Page Component
const ServiceDiscoveryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-6">
            Explore All Services
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            A comprehensive list of all the features and modules available in your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              {SERVICE_CATEGORIES.length} Categories
            </span>
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              {SERVICE_CATEGORIES.reduce((acc, cat) => acc + cat.services.length, 0)} Total Services
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_CATEGORIES.map((category) => (
            <ServiceCategorySection
              key={category.title}
              title={category.title}
              icon={category.icon}
              description={category.description}
              color={category.color}
              services={category.services}
            />
          ))}
        </div>
      </main>
{/* 
      <footer className="py-8 text-center text-gray-500 border-t mt-12">
        &copy; {new Date().getFullYear()} Service Portal. All rights reserved.
      </footer> */}
    </div>
  );
};

export default ServiceDiscoveryPage;