import React from 'react';
import Link from 'next/link';

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Terms and Conditions</h1>
          <p className="mb-8 text-gray-500">Last Updated: December 10, 2025</p>

          <p className="mb-8 text-gray-700">
            Please read these Terms and Conditions ("Terms") carefully before using our website and services. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By submitting a service query form or otherwise using our services, you agree to be bound by these Terms and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">2. Description of Services</h2>
              <p className="text-gray-700">
                Our company provides technical support and resolution services for a variety of electronic devices, including but not limited to laptops, TVs, and mobile phones ("Service"). The Service is initiated when you, the customer, fill out a query form on our website detailing the technical issue you are experiencing.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">3. User Responsibilities</h2>
              <p className="text-gray-700">
                As a user of our Service, you agree to the following:
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
                <li>You will provide accurate, complete, and current information in the service query form.</li>
                <li><strong>You are solely responsible for backing up all data, software, and information on your device before we perform any services. You acknowledge that data loss may occur during service, and we are not liable for any loss or corruption of data.</strong></li>
                <li>You will cooperate with our technicians and provide any necessary information or access required to perform the Service.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">4. Service Process and Payments</h2>
              <p className="text-gray-700">
                Upon submission of your query, we may provide a diagnosis and a quote for the required service. All fees and charges will be communicated to you before any work is performed. Payment is due upon completion of the service unless otherwise agreed in writing. We reserve the right to refuse or cancel any service request at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">5. Disclaimer of Warranties</h2>
              <p className="text-gray-700">
                Our Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the Service, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. While we strive to provide the best service possible, we do not warrant that the Service will be error-free or that all issues can be resolved.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by applicable law, in no event shall our company, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any pre-existing conditions of your device; or (iii) any unauthorized access, use or alteration of your transmissions or content. Our total liability to you for any and all claims arising out of or relating to the Service shall not exceed the amount you paid to us for the Service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">7. Intellectual Property</h2>
              <p className="text-gray-700">
                The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of our company and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">8. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">9. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved in the courts of [Your City, State/Country].
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">10. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page and updating the "Last Updated" date. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">11. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none mt-3 text-gray-700 space-y-1">
                <li>By email: support@yourcompany.com</li>
                <li>By visiting this page on our website: yourcompany.com/contact</li>
                <li>By phone number: (123) 456-7890</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

