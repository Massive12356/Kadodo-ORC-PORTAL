import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

export default function ConsentFormScreen() {
  const [companyName, setCompanyName] = useState('');
  const [auditorName, setAuditorName] = useState('');
  // Changed from registrationNumber to companyEmail
  const [companyEmail, setCompanyEmail] = useState('');
  const submitConsent = useStore((state) => state.submitConsent);
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Updated validation to check companyEmail instead of registrationNumber
    if ( auditorName.trim() && companyName.trim() && companyEmail.trim()) {
      toast.loading('Submitting consent...', { id: 'consent' });
      // Simulate API call delay
      setTimeout(() => {
        // Updated function call to use companyEmail instead of registrationNumber and pass auditorName
        submitConsent(companyName, companyEmail, auditorName);
        toast.dismiss('consent');
        toast.success('Consent submitted successfully!');
        navigate('/consent-letter');
      }, 1000);
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Add Company for Digital Consent
          </h2>
          <p className="text-lg text-gray-600">
            Enter the details of the company you are providing digital consent
            for.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="auditorFullName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Auditor's Name
              </label>
              <input
                id="auditorFullName"
                type="text"
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                placeholder="Enter company name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="companyEmail"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Company Email Address
              </label>
              <input
                id="companyEmail"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Enter company email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Confirm Consent
              </button>
              <Link
                to="/verification-login"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-200 text-center">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Need help? Visit our FAQ
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}