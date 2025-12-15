"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Info } from "lucide-react"
import { FaFacebookF, FaInstagram } from 'react-icons/fa'

const socialMedia = {
  facebook: {
    icon: <FaFacebookF className="w-5 h-5" />,
    url: "https://www.facebook.com/share/1FaKNtTjJH/",
  },
  instagram: {
    icon: <FaInstagram className="w-5 h-5" />,
    url: "https://www.instagram.com/iqlevall?igsh=MXV0c2dtdXRkZGNwcQ%3D%3D",
  },
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDevelopmentNotice, setShowDevelopmentNotice] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Something went wrong')

      if (data.message?.includes('email not sent')) {
        setShowDevelopmentNotice(true)
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

      setTimeout(() => {
        setIsSubmitted(false)
        setShowDevelopmentNotice(false)
      }, 5000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError((err as Error).message || 'Failed to send message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 -z-0" />
      <svg className="absolute top-0 left-0 w-full h-full -z-10" xmlns="http://www.w3.org/2000/svg"
        style={{
          opacity: 0.05,
          backgroundSize: '30px 30px',
          backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />

      {/* Main */}
      <main className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-900 inline-block text-transparent bg-clip-text mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or suggestions? We'd love to hear from you. Our team is always ready to assist you with any inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 lg:col-span-1">
              <div className="flex flex-col h-full">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <p className="text-gray-600 mb-8">
                    Reach out to us through any of these channels and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-8 flex-grow">
                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <a href="mailto:service@unionenterprize.com" className="text-gray-600 hover:text-gray-900 transition-colors">service@unionenterprize.com</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                      <a href="tel:+912345678900" className="text-gray-600 hover:text-gray-900 transition-colors">+91 234 567 8900</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-5">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">123 Innovation Drive, Tech City</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {Object.entries(socialMedia).map(([name, { icon, url }]) => (
                      <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300">
                        <span className="sr-only">{name}</span>
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {isSubmitted ? (
                <div className={`${showDevelopmentNotice ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-green-50 border-green-200 text-green-800'} border rounded-2xl p-6 flex items-start`}>
                  {showDevelopmentNotice ? (
                    <>
                      <Info className="w-12 h-12 text-blue-500 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-blue-800 mb-1">Message Received (Development Mode)</h3>
                        <p className="text-blue-700 mb-2">Your message has been stored locally but email sending is not configured.</p>
                        <p className="text-blue-600 text-sm">In a production environment, this would send an email to our team.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-12 h-12 text-green-500 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-green-800 mb-1">Message Sent Successfully!</h3>
                        <p className="text-green-700">Thank you for reaching out. We'll get back to you shortly.</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-gray-700">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your Name" required />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter your Email" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                      onInvalid={(e) => e.currentTarget.setCustomValidity("Please enter a valid phone number")}
                      onInput={(e) => e.currentTarget.setCustomValidity("")}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="+91 234 567 8900" pattern="[+]?[0-9\s\-\(\)]{1,15}" maxLength={15} required />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="How can we help you?" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Write your message here..." required />
                  </div>

                  <button type="submit" disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-900 text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 relative overflow-hidden group">
                    <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
