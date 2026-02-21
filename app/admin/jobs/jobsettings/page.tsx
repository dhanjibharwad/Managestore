"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, Settings2, Box, Wrench, Smartphone, Layers, CheckSquare, Package, MessageSquare, Palette, FileText, Grid } from 'lucide-react';
import DeviceTypesPage from './devicetypes/page';
import BrandsPage from './brands/page';
import ModelsPage from './models/page';
import StorageLocationsPage from './storagelocations/page';
import ColorsPage from './colors/page';
import JobTypesPage from './jobtypes/page';
import ServicesPage from './services/page';

interface Brand {
  id: number;
  name: string;
  type: string;
  jobs: number;
  updated_on: string;
  created_on: string;
}

const JobSettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePanel, setActivePanel] = useState(searchParams.get('tab') || 'Brands');
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const sidebarItems = [
    // { label: 'Default Job Creation Settings', icon: Settings2 },
    { label: 'Device Types', icon: Smartphone },
    { label: 'Brands', icon: Box },
    { label: 'Models', icon: Layers },
    // { label: 'Pre Post Conditions', icon: CheckSquare },
    // { label: 'Accessories', icon: Package },
    { label: 'Services', icon: Wrench },
    // { label: 'Statuses', icon: Grid },
    // { label: 'Quick Reply', icon: MessageSquare },
    { label: 'Storage Locations', icon: Box },
    { label: 'Device Colors', icon: Palette },
    // { label: 'Sources', icon: FileText },
    { label: 'Job Types', icon: FileText }
  ];

  useEffect(() => {
    if (activePanel === 'Brands') {
      fetchBrands();
    }
  }, [activePanel]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/devices/brands');
      const data = await response.json();
      if (response.ok) {
        setBrands(data.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-180px)]">
      {/* Sub-Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Job Settings</h2>
        </div>
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActivePanel(item.label);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  isActive
                    ? 'bg-[#4A70A9] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{activePanel}</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Name, mobile, email, etc"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] w-80"
                />
              </div>
              {/* <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A70A9] text-gray-700">
                <option>Trash Action</option>
              </select>
              <button className="px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-[#4A70A9] hover:text-white transition-colors flex items-center gap-2">
                All Filters
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Settings2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Grid className="w-5 h-5 text-gray-600" />
              </button> */}
              <button 
                onClick={() => setAddModal(true)}
                className="px-4 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5d8f] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activePanel === 'Brands' && (
            <BrandsPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Device Types' && (
            <DeviceTypesPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Models' && (
            <ModelsPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Services' && (
            <ServicesPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Storage Locations' && (
            <StorageLocationsPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Device Colors' && (
            <ColorsPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel === 'Job Types' && (
            <JobTypesPage addModal={addModal} setAddModal={setAddModal} />
          )}

          {activePanel !== 'Brands' && activePanel !== 'Device Types' && activePanel !== 'Models' && activePanel !== 'Storage Locations' && activePanel !== 'Device Colors' && activePanel !== 'Job Types' && activePanel !== 'Services' && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Settings2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activePanel}</h3>
              <p className="text-gray-500">Content for {activePanel} will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSettingsPage;
