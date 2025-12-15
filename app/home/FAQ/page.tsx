/* eslint-disable */

'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I raise a service request?",
    answer: "You can raise a service request by logging into your account and clicking on the 'New Service Request' button. Fill out the required details including the type of service needed, priority level, and detailed description of your issue. Our system will automatically assign a ticket number for tracking."
  },
  {
    id: 2,
    question: "How long does it take for a technician to arrive?",
    answer: "Response times vary based on the priority level of your request. Critical issues are addressed within 2-4 hours, high priority within 24 hours, and standard requests within 2-3 business days. You'll receive real-time updates via email and SMS about the technician's estimated arrival time."
  },
  {
    id: 3,
    question: "How can I track the status of my service?",
    answer: "You can track your service request status through multiple channels: log into your customer portal, use our mobile app, or call our support hotline. Each request has a unique tracking ID that provides real-time updates on progress, technician assignment, and completion status."
  },
  {
    id: 4,
    question: "What are your service hours?",
    answer: "Our standard service hours are Monday to Friday, 9 AM to 6 PM. However, we offer 24/7 emergency support for critical issues. Weekend and after-hours services are available for premium customers with priority support packages."
  },
  {
    id: 5,
    question: "How much do your services cost?",
    answer: "Service costs depend on the type of request, complexity, and service level agreement. We offer transparent pricing with no hidden fees. You'll receive a detailed quote before any work begins. Check our pricing page or contact support for specific service estimates."
  }
]

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle
}) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-gray-200 mb-4">
      <button
        onClick={onToggle}
        className="w-full py-6 px-8 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-300 rounded-xl"
        aria-expanded={isOpen}
        aria-controls={`faq-${item.id}`}
      >
        <span className="text-xl font-semibold text-gray-800 pr-6 leading-relaxed">
          {item.question}
        </span>
        <div className="flex-shrink-0 ml-6 p-2 rounded-full bg-gray-100 group-hover:bg-gray-800 transition-all duration-300">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-600 group-hover:text-white transition-all duration-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600 group-hover:text-white transition-all duration-300" />
          )}
        </div>
      </button>
      
      <div
        id={`faq-${item.id}`}
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-6 px-8 text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
          {item.answer}
        </div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white text-black">

         <div className="relative mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in text-gray-700">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in delay-200">
            Find answers to common questions about our services, support, and technical solutions.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex justify-center gap-4 mt-4 animate-fade-in delay-200">
            <a
              href="/home/contact"
              className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow-lg hover:bg-gray-100 transition"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Common Questions</h2>
            <p className="text-gray-600 text-lg">
              Can't find what you're looking for? Contact our support team for personalized assistance.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item) => (
              <FAQAccordion
                key={item.id}
                item={item}
                isOpen={openItems.includes(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </div>
      </section>
    

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-600 to-gray-600 text-white overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Technical Support?
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Union Enterprise 
            for their technical support needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/home/contact">
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:text-gray-800 transition cursor-pointer">
              Contact Us
            </button>
            </Link> 
          </div>
        </div>
      </section>
    </div>
  )
}