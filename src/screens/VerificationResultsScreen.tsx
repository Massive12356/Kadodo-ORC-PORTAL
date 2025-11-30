import { CheckCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';

interface VerificationResultsScreenProps {
  onClose?: () => void;
}

export default function VerificationResultsScreen({ onClose }: VerificationResultsScreenProps) {
  const auditor = useStore((state) => state.auditor);
  const consentData = useStore((state) => state.consentData); // Added to access consent data
  const setShowVerificationModal = useStore((state) => state.setShowVerificationModal);

  if (!auditor) return null;

  const handleClose = () => {
    setShowVerificationModal(false);
    if (onClose) onClose();
  };

  const handlePrint = () => {
    toast.success('Certificate printed successfully!');
  };

  const handleContactSupport = () => {
    toast.success('Support ticket created!');
  };

  const getStatusConfig = () => {
    switch (auditor.status) {
      case 'verified':
        return {
          icon: CheckCircle,
          title: 'Verified & In Good Standing',
          description: 'The auditor has been successfully verified and is in good standing.',
          bgColor: 'bg-green-50',
          iconColor: 'bg-green-500',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'expired':
        return {
          icon: Clock,
          title: 'License Expired / Not Renewed',
          description: "The auditor's license has expired and needs to be renewed to continue practice.",
          bgColor: 'bg-amber-50',
          iconColor: 'bg-amber-500',
          textColor: 'text-amber-800',
          borderColor: 'border-amber-200'
        };
      case 'suspended':
        return {
          icon: AlertTriangle,
          title: 'Suspended',
          description: "This auditor's license is currently suspended. They are not permitted to practice.",
          bgColor: 'bg-red-50',
          iconColor: 'bg-red-500',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      case 'not_found':
        return {
          icon: HelpCircle,
          title: 'Auditor Not Found',
          description: 'The auditor could not be found. Please check the information you entered and try again.',
          bgColor: 'bg-cyan-50',
          iconColor: 'bg-cyan-500',
          textColor: 'text-cyan-800',
          borderColor: 'border-cyan-200'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    // Removed fixed positioning and adjusted for modal container
    < div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
        <div className="grid place-items-center">
          {auditor.status === "verified" && (
            <div
              className={`${config.bgColor} border ${config.borderColor} rounded-xl p-8`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`${config.iconColor} w-16 h-16 rounded-full flex items-center justify-center`}
                >
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2
                className={`text-2xl font-bold ${config.textColor} text-center mb-4`}
              >
                {config.title}
              </h2>

              <p className="text-gray-700 text-center mb-8">
                {config.description}
              </p>

              <div className="bg-white rounded-lg p-6 space-y-4 mb-6">
                {consentData && (
                  <>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Company Name</span>
                      <span className="font-semibold text-gray-900">
                        {consentData.companyName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Consent Code</span>
                      <span className="font-semibold text-gray-900">
                        {consentData.consentCode}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-semibold text-gray-900">
                    {auditor.fullName}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">License Number</span>
                  <span className="font-semibold text-gray-900">
                    {auditor.licenseNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registered Firm Name</span>
                  <span className="font-semibold text-gray-900">
                    {auditor.firmName}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Print Certificate
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {auditor.status === "expired" && (
            <div
              className={`${config.bgColor} border ${config.borderColor} rounded-xl p-8`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`${config.iconColor} w-16 h-16 rounded-full flex items-center justify-center`}
                >
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2
                className={`text-2xl font-bold ${config.textColor} text-center mb-4`}
              >
                {config.title}
              </h2>

              <p className="text-gray-700 text-center mb-8">
                {config.description}
              </p>

              <button
                onClick={handleClose}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Close
              </button>
            </div>
          )}

          {auditor.status === "suspended" && (
            <div
              className={`${config.bgColor} border ${config.borderColor} rounded-xl p-8`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`${config.iconColor} w-16 h-16 rounded-full flex items-center justify-center`}
                >
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2
                className={`text-2xl font-bold ${config.textColor} text-center mb-4`}
              >
                {config.title}
              </h2>

              <p className="text-gray-700 text-center mb-8">
                {config.description}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleContactSupport}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact Support
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {auditor.status === "not_found" && (
            <div
              className={`${config.bgColor} border ${config.borderColor} rounded-xl p-8`}
            >
              <div className="flex justify-center mb-6">
                <div
                  className={`${config.iconColor} w-16 h-16 rounded-full flex items-center justify-center`}
                >
                  <StatusIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2
                className={`text-2xl font-bold ${config.textColor} text-center mb-4`}
              >
                {config.title}
              </h2>

              <p className="text-gray-700 text-center mb-8">
                {config.description}
              </p>

              <button
                onClick={handleClose}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
  
    </div>
  );
}