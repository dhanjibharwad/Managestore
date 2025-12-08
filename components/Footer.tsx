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
    { name: "Pricing", href: "/user/pricing" },
    { name: "Blog", href: "/user/blog" },
  ];

  const servicesLinks = [
    { name: "HRMS", href: "/user/services/emsservice" },
    { name: "Finance and Accounting", href: "/user/services/accounting" },
    { name: "Ecommerce", href: "/user/services/ecom-market" },
    { name: "CRM", href: "/user/services/crm" },
    { name: "Store Manager", href: "/user/services/unionservice" },
  ];

  const supportLinks = [
    // { name: "Help Center", href: "/support" },
    // { name: "Documentation", href: "/docs" }, 
    { name: "Contact Us", href: "/user/contact-us" },
    { name: "Our Gallery", href: "/user/gallery" },
    { name: "FAQs", href: "/user/faqs" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/user/privacy" },
    { name: "Terms of Service", href: "/user/tandc" },
    // { name: "Cookie Policy", href: "/user/colie" },
    // { name: "Refund Policy", href: "/refund" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Company Info - Takes 2 columns */}
          <div className="lg:col-span-2">
            {/* <div className="flex items-center gap-2 mb-4"> */}
              {/* <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                <IoMdRocket className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                Jashviro
              </h2> */}

              {/* <Image
                src="/images/logo-2.png"
                alt="Jashviro Logo"
                width={90}
                height={90}
                className="rounded-xl"
              />
            </div> */}
            {/* <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Empowering businesses with our solutions.
            </p> */}

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@jashviro.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-gray-400/10 rounded-lg flex items-center justify-center group-hover:bg-gray-400/20 transition-colors">
                  <MdEmail className="text-indigo-500" />
                </div>
                <span>info@jashviro.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-gray-400/10 rounded-lg flex items-center justify-center group-hover:bg-gray-400/20 transition-colors">
                  <MdPhone className="text-indigo-500" />
                </div>
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-400/10 rounded-lg flex items-center justify-center mt-0.5">
                  <MdLocationOn className="text-indigo-500" />
                </div>
                <span>123 Innovation Street,<br />Tech City, TC 12345</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-gray-400/10 to-gray-600/10 rounded-2xl p-8 mb-12 border border-gray-400/20">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Subscribe to Our Platform</h3>
              <p className="text-gray-400">Get the latest updates, news, and exclusive offers directly to your inbox.</p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 text-white placeholder-gray-500 transition-colors"
              />
              <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 font-medium">Follow Us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/5 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-400 border border-gray-700 hover:border-gray-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-gray-500 text-sm text-center md:text-right">
              <p>&copy; {currentYear} <span className="text-white  font-semibold">Jashviro</span>. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ for a better tomorrow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600" />
    </footer>
  );
};

export default Footer;