import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoMdRocket } from "react-icons/io";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "About Us", href: "/user/about-us" },
    { name: "Our Team", href: "/user/team-member" },
    { name: "Careers", href: "/user/careers" },
    { name: "Pricing", href: "/home/pricing" },
    { name: "Blog", href: "/user/blog" },
  ];

  const servicesLinks = [
    { name: "Technician support", href: "#" },
    { name: "Online Supprt", href: "#" },
    { name: "Job Form", href: "#" },
    { name: "Dashboard Panels", href: "#" },
    { name: "Store Manager", href: "#" },
  ];

  const supportLinks = [
    // { name: "Help Center", href: "/support" },
    // { name: "Documentation", href: "/docs" }, 
    { name: "Contact Us", href: "/home/contact  " },
    { name: "Our Gallery", href: "/user/gallery" },
    { name: "FAQs", href: "/home/FAQ" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/extra/privacy" },
    { name: "Terms of Service", href: "/extra/terms" },
    // { name: "Cookie Policy", href: "/user/colie" },
    // { name: "Refund Policy", href: "/refund" },
  ];

  const socialLinks = [
   
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-50 text-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Company Info - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@jashviro.com" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors group">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <MdEmail className="text-gray-600" />
                </div>
                <span>info@storemanager.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors group">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <MdPhone className="text-gray-600" />
                </div>
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MdLocationOn className="text-gray-600" />
                </div>
                <span>123 Innovation Street,<br />Tech City, TC 12345</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-black">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-black transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-black">Services</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-black transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-black">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-black transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-black">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-black transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-600 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-blue-500">Subscribe to Our Platform</h3>
              <p className="text-gray-700">Get the latest updates, news, and exclusive offers directly to your inbox.</p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black placeholder-gray-500 transition-colors"
              />
              <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-gray-400/30 transition-all duration-300 hover:scale-105 whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Follow Us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 rounded-lg flex items-center justify-center text-gray-700 hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-400/20"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-600 text-sm text-center md:text-right">
              <p>&copy; {currentYear} <span className="text-black font-semibold">Jashviro</span>. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for a better tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400" />
    </footer>
  );
};

export default Footer;