import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Privacy Policy</h1>
          <p className="mb-8 text-gray-500">Last Updated: December 10, 2025</p>

          <p className="mb-8 text-gray-700">
            Welcome to our Privacy Policy. Your privacy is critically important to us. This policy outlines how we collect, use, protect, and handle your personal information as you use our website and services to resolve technical issues with your laptops, TVs, mobiles, and other devices.
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">1. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information you provide directly to us when you fill out a service query form. This is essential for us to understand the problem and provide effective support. The information includes:
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
                <li><strong>Personal Identification Information:</strong> Your name, email address, and phone number.</li>
                <li><strong>Device Information:</strong> Details about your device such as the make, model, serial number, and operating system.</li>
                <li><strong>Query Details:</strong> A description of the technical issue you are facing and any other information you voluntarily provide.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">2. How We Use Your Information</h2>
              <p className="text-gray-700">
                The information we collect is used solely for the following purposes:
              </p>
              <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
                <li>To respond to your service requests and provide you with technical support.</li>
                <li>To communicate with you about your query, including sending you updates and service information.</li>
                <li>To improve our services, website, and customer support.</li>
                <li>For internal record-keeping and administrative purposes.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal identification information to others. We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law or protect ours or others' rights, property, or safety.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">4. Data Security</h2>
              <p className="text-gray-700">
                We are committed to ensuring that your information is secure. We implement a variety of security measures, including encryption and secure servers, to maintain the safety of your personal information when you submit a query. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">5. Data Retention</h2>
              <p className="text-gray-700">
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">6. Your Data Protection Rights</h2>
              <p className="text-gray-700">
                You have the right to access, update, or delete the information we have on you. You can do this by contacting us directly. We will make reasonable efforts to accommodate your request, subject to any legal or contractual restrictions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">7. Use of Cookies</h2>
              <p className="text-gray-700">
                Our website may use "cookies" to enhance user experience. Cookies are small files placed on your device's hard drive. You may choose to set your web browser to refuse cookies or to alert you when cookies are being sent. If you do so, note that some parts of the site may not function properly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">8. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not directed to individuals under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none mt-3 text-gray-700 space-y-1">
                <li>By email: privacy@yourcompany.com</li>
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

export default PrivacyPolicyPage;