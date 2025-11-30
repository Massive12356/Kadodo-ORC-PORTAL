import { useState } from "react";
import { Layers, Settings, HelpCircle, Home } from "lucide-react";
import { useStore } from "../store/useStore";
import { Link } from "react-router-dom";
import VerificationResultsScreen from "./VerificationResultsScreen";
import { toast } from "react-hot-toast";
import SimplifiedHeader from "../components/SimplifiedHeader"; // Changed to use SimplifiedHeader

export default function VerificationScreen() {
  const [licenseNumber, setLicenseNumber] = useState("");
  // Added consentCode state
  const [consentCode, setConsentCode] = useState("");
  const verifyAuditor = useStore((state) => state.verifyAuditor);
  const showVerificationModal = useStore(
    (state) => state.showVerificationModal
  );
  const setShowVerificationModal = useStore(
    (state) => state.setShowVerificationModal
  );

  const handleVerify = () => {
    // Updated validation to require consent code
    if (licenseNumber.trim() && consentCode.trim()) {
      // Show a toast notification when verification starts
      toast.loading("Verifying auditor...", { id: "verification" });
      // Simulate API call delay
      setTimeout(() => {
        // Updated function call to include consentCode
        verifyAuditor(licenseNumber, consentCode);
        toast.dismiss("verification");
      }, 1000);
    } else {
      toast.error("Please enter both license number and consent code");
    }
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setConsentCode("");
    setLicenseNumber("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimplifiedHeader />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Auditor Verification
          </h2>
          <p className="text-lg text-gray-600">
            Instantly verify an auditor's credentials for company registration
            or annual returns filing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                ICAG Registration Number or Kadodo Number
              </label>
              <input
                id="licenseNumber"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Enter number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyPress={(e) => e.key === "Enter" && handleVerify()}
              />
            </div>

            <div>
              <label
                htmlFor="consentCode"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Consent Code (Required)
              </label>
              <input
                id="consentCode"
                type="text"
                value={consentCode}
                onChange={(e) => setConsentCode(e.target.value)}
                placeholder="Enter consent code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyPress={(e) => e.key === "Enter" && handleVerify()}
              />
            </div>

            <button
              onClick={handleVerify}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Verify Auditor
            </button>
          </div>
        </div>
      </main>

      {/* Verification Results Modal - Centered in the middle of the screen */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <VerificationResultsScreen onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
