// src/components/Footer.tsx

import React from 'react';
import { Phone, MessageCircle, Mail } from "lucide-react";

const linkClasses = 'text-black hover:text-amber-800 transition-colors duration-200';
const titleClasses = 'text-base font-semibold text-black mb-4 uppercase tracking-wider';
const contactLinkClasses = 'text-amber-800 hover:text-black transition-colors duration-200';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black p-8 md:p-12 lg:p-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Our Services */}
          <div className="col-span-1 md:col-span-1">
            <h3 className={titleClasses}>Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClasses}>Device Repair</a></li>
              <li><a href="#" className={linkClasses}>Data Recovery</a></li>
              <li><a href="#" className={linkClasses}>Sales & Support</a></li>
              <li><a href="#" className={linkClasses}>Warranty Services</a></li>
              <li><a href="#" className={linkClasses}>Bulk Orders</a></li>
              <li><a href="#" className={linkClasses}>AMC Plans</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="col-span-1 md:col-span-1">
            <h3 className={titleClasses}>Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClasses}>Enterprise Solutions</a></li>
              <li><a href="#" className={linkClasses}>Retail Solutions</a></li>
              <li><a href="#" className={linkClasses}>Cloud Services</a></li>
              <li><a href="#" className={linkClasses}>IT Consulting</a></li>
              <li><a href="#" className={linkClasses}>Network Setup</a></li>
              <li><a href="#" className={linkClasses}>Security Solutions</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-span-1 md:col-span-1">
            <h3 className={titleClasses}>Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClasses}>Online Support</a></li>
              <li><a href="#" className={linkClasses}>Track Order</a></li>
              <li><a href="/extra/privacy/" className={linkClasses}>Privacy Policy</a></li>
              <li><a href="/home/FAQ" className={linkClasses}>FAQs</a></li>
              <li><a href="/extra/terms/" className={linkClasses}>Terms</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-1">
            <h3 className={titleClasses}>Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className={linkClasses}>About Us</a></li>
              {/* <li><a href="#" className={linkClasses}>Careers</a></li> */}
              <li><a href="#" className={linkClasses}>Blog</a></li>
              {/* <li><a href="#" className={linkClasses}>Partners</a></li> */}
            </ul>
          </div>

          {/* Contact Us & Address (Spans 2 columns on medium screens) */}
          <div className="col-span-2 md:col-span-2">
            <h3 className={titleClasses}>Contact Us</h3>
            <address className="not-italic text-sm mb-6">
              **Store Manager Solutions Pvt Ltd**<br />
              Business District, Tech Park, 560001
            </address>

            <h4 className="text-sm font-semibold mb-2">24X7 SUPPORT ( ALL DAYS )</h4>
            <div className="text-sm space-y-1 mb-6">
              <p>Sales : <a href="mailto:sales@storemanager.com" className={contactLinkClasses}>sales@storemanager.com</a></p>
              {/* <p>Support : <a href="mailto:support@storemanager.com" className={contactLinkClasses}>support@storemanager.com</a></p> */}
              {/* <p>Corporate : <a href="mailto:corporate@storemanager.com" className={contactLinkClasses}>corporate@storemanager.com</a></p> */}
              {/* <p>Careers : <a href="mailto:careers@storemanager.com" className={contactLinkClasses}>careers@storemanager.com</a></p> */}
            </div>
            
            {/* Contact Icons */}
            <div className="flex space-x-6 mb-8">
      <div className="flex flex-col items-center text-xs text-amber-800">
        <Phone className="w-6 h-6 mb-1" />
        Call Us
      </div>
      <div className="flex flex-col items-center text-xs text-amber-800">
        <MessageCircle className="w-6 h-6 mb-1" />
        Chat
      </div>
      <div className="flex flex-col items-center text-xs text-amber-800">
        <Mail className="w-6 h-6 mb-1" />
        Email
      </div>
    </div>

            {/* Find a Store Button */}
            {/* <button className="w-full md:w-auto px-6 py-2 border-2 border-amber-800 text-amber-800 font-medium text-sm hover:bg-amber-800 hover:text-white transition-colors duration-200">
                Find Service Center
            </button> */}
          </div>
        </div>

        {/* --- Separator --- */}
        <hr className="my-8 border-gray-200" />
        
        {/* Download App & Social Media / Payment */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            
            {/* Download App Section */}
            <div className="p-6 mb-8 lg:mb-0 max-w-sm w-full" style={{ background: `linear-gradient(to right, #ffffff, rgba(251, 191, 36, 0.1))`, border: '1px solid #FCD34D' }}>
                <p className="text-base font-semibold mb-3">Download Store Manager App</p>
                <p className="text-sm mb-4">Manage orders, track repairs & get instant support on the go</p>
                {/* <div className="flex space-x-3">
                    <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10" /></a>
                    <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" /></a>
                </div> */}
            </div>
            
            {/* Find Us On & Payment Methods */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-12 w-full lg:w-auto justify-between">
                
                {/* Social Media Icons */}
                {/* <div className="flex items-center space-x-4">
                    <p className="text-sm font-semibold">Find Us On</p>
                    <div className="flex space-x-2">
                       
                        {['Insta', 'FB', 'LinkedIn', 'Pinterest', 'X'].map((platform) => (
                            <a key={platform} href="#" className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-white hover:bg-black transition-colors duration-200 text-xs font-bold">
                                {platform[0]}
                            </a>
                        ))}
                    </div>
                </div> */}
                
                {/* Payment Icons (Text placeholder) */}
                {/* <div className="text-xs text-gray-500 flex space-x-4">
                    <span>VISA</span>
                    <span>PayPal</span>
                    <span>AMEX</span>
                    <span>Amazon</span>
                    <span>Rupay</span>
                </div> */}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;