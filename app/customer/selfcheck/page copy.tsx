// "use client"

// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, Upload, Eye, EyeOff, Copy, Check } from 'lucide-react';

// const deviceTypes = [
//   'All In One', 'Camera', 'CD/DVD', 'CF Card', 'Desktop', 
//   'HDD (2.5 Inch)', 'HDD (3.5 Inch)', 'Laptop', 'Micro SD Card',
//   'Mobile', 'Monitor', 'Motherboard', 'NAS Box', 'Pen Drive',
//   'SD Card', 'Server Hard Drives', 'SSD', 'Tablet', 'Television'
// ];

// const SelfCheckInPage = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showPassword, setShowPassword] = useState(false);
//   const [copied, setCopied] = useState(false);
  
//   const [deviceType, setDeviceType] = useState('');
//   const [brand, setBrand] = useState('');
//   const [model, setModel] = useState('');
//   const [serialNumber, setSerialNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [accessories, setAccessories] = useState('');
//   const [deviceImage, setDeviceImage] = useState(null);
//   const [detailedIssue, setDetailedIssue] = useState('');
//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [email, setEmail] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const [searchDevice, setSearchDevice] = useState('');
//   const [searchBrand, setSearchBrand] = useState('');
//   const [searchModel, setSearchModel] = useState('');

//   const brands = deviceType === 'Camera' ? ['Sony'] : [];
//   const models = brand === 'Sony' ? ['DCR-SR65E', 'DCR-SR68', 'DCRA-C162'] : [];

//   const filteredDevices = deviceTypes.filter(device => 
//     device.toLowerCase().includes(searchDevice.toLowerCase())
//   );

//   const handleCopySerial = () => {
//     navigator.clipboard.writeText(serialNumber);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setDeviceImage(file);
//     }
//   };

//   const renderStep1 = () => (
//     <div>
//       <div className="mb-4">
//         <h3 className="text-lg font-medium mb-2">Device Information</h3>
//         <p className="text-[#4A90E2] text-sm">Device Information</p>
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-3">Select device type</label>
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Type or search for device type"
//             value={searchDevice}
//             onChange={(e) => setSearchDevice(e.target.value)}
//             className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//           />
//           <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <div className="grid grid-cols-4 gap-3">
//           {filteredDevices.map((device) => (
//             <button
//               key={device}
//               onClick={() => setDeviceType(device)}
//               className={`px-4 py-8 border rounded-lg text-center hover:border-[#4A70A9] transition-colors ${
//                 deviceType === device ? 'border-[#4A70A9] bg-blue-50' : 'border-gray-300'
//               }`}
//             >
//               {device}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm mb-4">
//           <button onClick={() => setCurrentStep(1)} className="text-[#4A90E2] hover:underline">Device Information</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <span className="text-[#4A90E2]">{deviceType}</span>
//         </div>

//         <label className="block text-sm font-medium mb-3">Select device brand</label>
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Type or search for device brand"
//             value={searchBrand}
//             onChange={(e) => setSearchBrand(e.target.value)}
//             className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//           />
//           <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <div className="grid grid-cols-4 gap-3">
//           {brands.map((brandItem) => (
//             <button
//               key={brandItem}
//               onClick={() => setBrand(brandItem)}
//               className={`px-4 py-8 border rounded-lg text-center hover:border-[#4A70A9] transition-colors ${
//                 brand === brandItem ? 'border-[#4A70A9] bg-blue-50' : 'border-gray-300'
//               }`}
//             >
//               {brandItem}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm mb-4">
//           <button onClick={() => setCurrentStep(1)} className="text-[#4A90E2] hover:underline">Device Information</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(2)} className="text-[#4A90E2] hover:underline">{deviceType}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <span className="text-[#4A90E2]">{brand}</span>
//         </div>

//         <label className="block text-sm font-medium mb-3">Select model</label>
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Type or search for device model"
//             value={searchModel}
//             onChange={(e) => setSearchModel(e.target.value)}
//             className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//           />
//           <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         <div className="grid grid-cols-4 gap-3">
//           {models.map((modelItem) => (
//             <button
//               key={modelItem}
//               onClick={() => {
//                 setModel(modelItem);
//                 setCurrentStep(4);
//               }}
//               className={`px-4 py-8 border rounded-lg text-center hover:border-[#4A70A9] transition-colors ${
//                 model === modelItem ? 'border-[#4A70A9] bg-blue-50' : 'border-gray-300'
//               }`}
//             >
//               {modelItem}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm mb-6">
//           <button onClick={() => setCurrentStep(1)} className="text-[#4A90E2] hover:underline">Device Information</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(2)} className="text-[#4A90E2] hover:underline">{deviceType}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(3)} className="text-[#4A90E2] hover:underline">{brand}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <span className="text-[#4A90E2]">{model}</span>
//         </div>

//         <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
//           <h3 className="text-xl font-semibold mb-1">{model}</h3>
//           <p className="text-sm text-gray-600 mb-4">Brand: {brand}</p>

//           <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
//             <p className="text-sm text-blue-800">No repair services are available for this device</p>
//           </div>

//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Type or search for service type"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//             />
//           </div>

//           <p className="text-sm text-gray-500 text-center mb-6">We couldn't find any services for this model.</p>

//           <div>
//             <label className="block text-sm font-medium mb-2">Device Detailed Issue</label>
//             <div className="border border-gray-300 rounded-md">
//               <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
//                 <button className="p-1 hover:bg-gray-100 rounded">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                   </svg>
//                 </button>
//                 <button className="p-1 hover:bg-gray-100 rounded">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
//                   </svg>
//                 </button>
//                 <select className="text-sm border-none focus:outline-none">
//                   <option>Normal text</option>
//                 </select>
//                 <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
//                 <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
//                 <button className="p-1 hover:bg-gray-100 rounded line-through">S</button>
//                 <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
//                 <button className="p-1 hover:bg-gray-100 rounded">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
//                   </svg>
//                 </button>
//               </div>
//               <textarea
//                 value={detailedIssue}
//                 onChange={(e) => setDetailedIssue(e.target.value)}
//                 className="w-full px-3 py-2 min-h-32 focus:outline-none resize-none"
//                 placeholder="Describe the issue..."
//               />
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Max Allowed Characters 50000</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep5 = () => (
//     <div>
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm mb-6">
//           <button onClick={() => setCurrentStep(1)} className="text-[#4A90E2] hover:underline">Device Information</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(2)} className="text-[#4A90E2] hover:underline">{deviceType}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(3)} className="text-[#4A90E2] hover:underline">{brand}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <button onClick={() => setCurrentStep(4)} className="text-[#4A90E2] hover:underline">{model}</button>
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//           <span className="text-[#4A90E2]">Step 4</span>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Serial / IMEI Number</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Type device serial number"
//                 value={serialNumber}
//                 onChange={(e) => setSerialNumber(e.target.value)}
//                 className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//               />
//               <button
//                 onClick={handleCopySerial}
//                 className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded"
//               >
//                 {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-[#4A70A9]" />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Device password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Device password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//               />
//               <div className="absolute right-2 top-2 flex gap-1">
//                 <button className="p-1 hover:bg-gray-100 rounded">
//                   <Copy className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="p-1 hover:bg-gray-100 rounded"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Accessories</label>
//           <select
//             value={accessories}
//             onChange={(e) => setAccessories(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//           >
//             <option value="">Select or search for accessories</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Upload Device Type Image</label>
//           <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center bg-blue-50">
//             <input
//               type="file"
//               id="device-image"
//               accept="image/*,.pdf"
//               onChange={handleImageUpload}
//               className="hidden"
//             />
//             <label htmlFor="device-image" className="cursor-pointer">
//               <div className="flex flex-col items-center">
//                 <div className="w-12 h-12 bg-[#4A70A9] rounded-full flex items-center justify-center mb-3">
//                   <Upload className="w-6 h-6 text-white" />
//                 </div>
//                 <p className="text-[#4A90E2] font-medium mb-1">
//                   Take A Photo With Your Camera Or Choose A File From Your Device
//                 </p>
//                 <p className="text-xs text-gray-500">JPEG, PNG, BMP, WEBP, AND PDF FILES</p>
//               </div>
//             </label>
//             {deviceImage && (
//               <p className="mt-3 text-sm text-gray-700">Selected: {deviceImage.name}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep6 = () => (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Your Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Eg: John Smith"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//             />
//             {!name && <p className="text-xs text-red-500 mt-1">Name is a required field.</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Mobile Number</label>
//             <div className="flex gap-2">
//               <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]">
//                 <option>+91</option>
//               </select>
//               <input
//                 type="tel"
//                 placeholder="Eg: 99XXXXXXXX"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//               />
//             </div>
//             {!mobile && !email && (
//               <p className="text-xs text-red-500 mt-1">Either mobile number or email is required field</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Email ID</label>
//             <input
//               type="email"
//               placeholder="Eg: example@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A70A9]"
//             />
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-medium mb-3">Terms and Conditions</h3>
//           <label className="flex items-start gap-2 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={agreeTerms}
//               onChange={(e) => setAgreeTerms(e.target.checked)}
//               className="mt-1 w-4 h-4 text-[#4A70A9] border-gray-300 rounded focus:ring-[#4A70A9]"
//             />
//             <span className="text-sm">I agree to your terms and conditions mentioned above</span>
//           </label>
//         </div>
//       </div>
//     </div>
//   );

//   const getStepContent = () => {
//     switch (currentStep) {
//       case 1: return renderStep1();
//       case 2: return renderStep2();
//       case 3: return renderStep3();
//       case 4: return renderStep4();
//       case 5: return renderStep5();
//       case 6: return renderStep6();
//       default: return renderStep1();
//     }
//   };

//   const canProceed = () => {
//     switch (currentStep) {
//       case 1: return deviceType !== '';
//       case 2: return brand !== '';
//       case 3: return model !== '';
//       case 4: return true;
//       case 5: return true;
//       case 6: return name && (mobile || email) && agreeTerms;
//       default: return false;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* <header className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-[#4A70A9] rounded flex items-center justify-center">
//               <div className="text-white font-bold text-lg">B</div>
//             </div>
//             <span className="text-xl font-semibold">BytePhase</span>
//           </div>
//         </div>
//       </header> */}

//       <div className="bg-white border-b border-gray-200 px-6 py-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div className="flex flex-col items-center flex-1">
//               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                 currentStep >= 1 ? 'bg-[#4A70A9]' : 'bg-gray-300'
//               }`}>
//                 {currentStep > 5 ? (
//                   <Check className="w-6 h-6 text-white" />
//                 ) : (
//                   <Check className="w-6 h-6 text-white" />
//                 )}
//               </div>
//               <span className={`mt-2 text-sm ${currentStep >= 1 ? 'text-[#4A70A9] font-medium' : 'text-gray-500'}`}>
//                 Device Information
//               </span>
//             </div>

//             <div className={`flex-1 h-1 ${currentStep >= 6 ? 'bg-[#4A70A9]' : 'bg-gray-300'}`} />

//             <div className="flex flex-col items-center flex-1">
//               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                 currentStep >= 6 ? 'bg-[#4A70A9]' : 'bg-gray-300'
//               }`}>
//                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                 </svg>
//               </div>
//               <span className={`mt-2 text-sm ${currentStep >= 6 ? 'text-[#4A70A9] font-medium' : 'text-gray-500'}`}>
//                 Basic Information
//               </span>
//             </div>

//             <div className={`flex-1 h-1 bg-gray-300`} />

//             <div className="flex flex-col items-center flex-1">
//               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-300">
//                 <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//                 </svg>
//               </div>
//               <span className="mt-2 text-sm text-gray-500">Save Or Book Pickup</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex">
//         {currentStep >= 2 && (
//           <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
//             <div className="mb-6">
//               <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>
//               <button
//                 onClick={() => setCurrentStep(1)}
//                 className="text-sm text-gray-600 hover:text-[#4A70A9] mb-2"
//               >
//                 Device Information
//               </button>
//             </div>

//             <div className="space-y-2">
//               {deviceType && (
//                 <div className="px-3 py-2 bg-gray-100 rounded text-sm">{deviceType}</div>
//               )}
//               {brand && (
//                 <div className="px-3 py-2 bg-gray-100 rounded text-sm">{brand}</div>
//               )}
//               {model && (
//                 <div className="px-3 py-2 bg-gray-100 rounded text-sm">{model}</div>
//               )}
//             </div>
//           </aside>
//         )}

//         <main className="flex-1 p-8">
//           <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//             <h1 className="text-2xl font-semibold mb-6">Device Information</h1>
            
//             {getStepContent()}

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//                 disabled={currentStep === 1}
//                 className="flex items-center gap-2 px-6 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 Previous
//               </button>

//               <div className="flex gap-3">
//                 {currentStep === 6 && (
//                   <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
//                     Skip Pickup and Submit
//                   </button>
//                 )}
//                 <button
//                   onClick={() => {
//                     if (canProceed()) {
//                       if (currentStep === 2) {
//                         setCurrentStep(3);
//                       } else if (currentStep < 6) {
//                         setCurrentStep(currentStep + 1);
//                       }
//                     }
//                   }}
//                   disabled={!canProceed()}
//                   className="flex items-center gap-2 px-6 py-2 bg-[#4A70A9] text-white rounded-md hover:bg-[#3d5a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SelfCheckInPage;