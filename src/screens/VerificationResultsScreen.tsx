import { CheckCircle, Clock, AlertTriangle, HelpCircle, FileText, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface VerificationResultsScreenProps {
  onClose?: () => void;
}

export default function VerificationResultsScreen({ onClose }: VerificationResultsScreenProps) {
  const auditor = useStore((state) => state.auditor);
  const consentData = useStore((state) => state.consentData); // Added to access consent data
  const setShowVerificationModal = useStore((state) => state.setShowVerificationModal);
  const auditorSignature = useStore((state) => state.auditorSignature);
  const [showLetterModal, setShowLetterModal] = useState(false);

  if (!auditor) return null;

  const handleClose = () => {
    setShowVerificationModal(false);
    if (onClose) onClose();
  };

  const handleViewLetter = () => {
    if (consentData) {
      setShowLetterModal(true);
    } else {
      toast.error('No consent letter available for this verification');
    }
  };

  const closeLetterModal = () => {
    setShowLetterModal(false);
  };

  const handlePrint = () => {
    // Create a printable version of the verification details
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Determine the title and status message based on auditor status
      let certificateTitle = 'Auditor Verification Details';
      let statusMessage = '';
      let statusColor = '#333';
      
      switch (auditor.status) {
        case 'verified':
          certificateTitle = 'Auditor Verification Certificate';
          statusMessage = 'Verified & In Good Standing';
          statusColor = '#2d6a4f';
          break;
        case 'expired':
          certificateTitle = 'Auditor License Status Report';
          statusMessage = 'License Expired / Not Renewed';
          statusColor = '#92400e';
          break;
        case 'suspended':
          certificateTitle = 'Auditor License Status Report';
          statusMessage = 'License Suspended';
          statusColor = '#b91c1c';
          break;
        default:
          certificateTitle = 'Auditor Verification Details';
          statusMessage = 'Verification Details';
          statusColor = '#333';
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${certificateTitle}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
              }
              .certificate-header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .certificate-title {
                font-size: 24px;
                font-weight: bold;
                color: ${statusColor};
                margin-bottom: 10px;
              }
              .status-message {
                font-size: 18px;
                color: ${statusColor};
                font-weight: bold;
              }
              .info-section {
                margin-bottom: 20px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
              }
              .info-label {
                font-weight: bold;
                color: #555;
              }
              .info-value {
                font-weight: normal;
              }
              .signature-section {
                margin-top: 40px;
                text-align: center;
              }
              .date {
                margin-top: 30px;
                text-align: right;
              }
              @media print {
                body {
                  padding: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="certificate-header">
              <div class="certificate-title">${certificateTitle}</div>
              <p class="status-message">${statusMessage}</p>
            </div>
            
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">Auditor Full Name:</span>
                <span class="info-value">${auditor.fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">License Number:</span>
                <span class="info-value">${auditor.licenseNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Registered Firm Name:</span>
                <span class="info-value">${auditor.firmName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Current Status:</span>
                <span class="info-value">${auditor.status.charAt(0).toUpperCase() + auditor.status.slice(1)}</span>
              </div>
              ${consentData ? `
              <div class="info-row">
                <span class="info-label">Company Name:</span>
                <span class="info-value">${consentData.companyName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Consent Code:</span>
                <span class="info-value">${consentData.consentCode}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="signature-section">
              ${auditor.status === 'verified' ? 
                '<p>This certificate verifies that the above-named auditor is currently licensed and in good standing with the Office of the Registrar of Companies.</p>' :
                '<p>This report provides the current verification status of the above-named auditor with the Office of the Registrar of Companies.</p>'}
            </div>
            
            <div class="date">
              <p>Date of Verification: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                // Close the window after printing (optional)
                // window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      toast.error('Unable to open print window. Please check your popup blocker.');
    }
  };

  const handleContactSupport = () => {
    // Create a support ticket with auditor information
    const subject = `Support Request for Auditor: ${auditor.fullName}`;
    const body = `Auditor Name: ${auditor.fullName}%0A` +
                 `License Number: ${auditor.licenseNumber}%0A` +
                 `Firm Name: ${auditor.firmName}%0A` +
                 `Status: ${auditor.status}%0A%0A` +
                 `Please provide assistance with this auditor.`;
    
    window.location.href = `mailto:support@orc.gov.gh?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50">
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
                {consentData ? (
                  <button
                    onClick={handleViewLetter}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Letter
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Print Verification Details
                  </button>
                )}
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

              <div className="bg-white rounded-lg p-6 space-y-4 mb-6">
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
                {consentData ? (
                  <button
                    onClick={handleViewLetter}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Letter
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Print Verification Details
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  Close
                </button>
              </div>
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

              <div className="bg-white rounded-lg p-6 space-y-4 mb-6">
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
                {consentData ? (
                  <button
                    onClick={handleViewLetter}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Letter
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Print Verification Details
                  </button>
                )}
                <button
                  onClick={handleContactSupport}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contact ORC Support
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

              <div className="flex gap-4">
                {consentData ? (
                  <button
                    onClick={handleViewLetter}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    View Letter
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Print Verification Details
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
  
        {/* Letter Modal */}
        {showLetterModal && consentData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
              <button
                onClick={closeLetterModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-md"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="p-8">
                {/* Wrapper div for styling */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 mb-8">
                  {/* Content div specifically for printing and PDF generation */}
                  <div id="consent-letter-content">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AUDITOR'S CONSENT TO ACT
                      </h1>
                      <p className="text-gray-600">
                        Generated on: {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    {/* Added justify-on-mobile class for text justification on mobile */}
                    <div className="space-y-6 mb-8 text-gray-700 leading-relaxed justify-on-mobile">
                      <p>
                        This letter serves as formal confirmation that I,{" "}<span className="font-bold text-gray-900">
                          {consentData.auditorFullName ?? "N/A"}
                        </span>{" "}(ORC Registration Number: <span className="font-bold text-gray-900">
                          {consentData.licenseNumber}
                        </span>), being a qualified auditor in accordance with the regulations
                        of the Office of the Registrar of Companies (ORC), hereby
                        give my consent to act as the auditor for:
                      </p>

                      <div className="text-center my-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {consentData.companyName}
                        </h2>
                        <p className="text-gray-600">
                          (Company Email Number: <span className="text-black font-medium">
                            {consentData.companyEmail}
                          </span>)
                        </p>
                      </div>

                      <p>
                        This consent is granted for the financial year ending December
                        31, 2024, and for every subsequent financial year until this
                        consent is formally withdrawn.
                      </p>

                      <p>
                        For verification and record-keeping purposes with the Office of
                        the Registrar of Companies (ORC), the unique digital consent code
                        associated with this appointment is:
                      </p>

                      <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 my-8 text-center">
                        <p className="text-sm text-blue-600 uppercase mb-2">
                          UNIQUE CONSENT CODE
                        </p>
                        <p className="text-2xl font-bold text-gray-900 tracking-wider">
                          {consentData.consentCode}
                        </p>
                      </div>

                      <p>
                        I confirm that I am independent of the company and that my
                        appointment is in compliance with all applicable legal and
                        professional standards.
                      </p>
                    </div>

                    <div className="mt-16 space-y-2">
                      <p>Sincerely,</p>
                      {/* Display signature if available */}
                      <div className="">
                        {auditorSignature ? (
                          <>
                            <img
                              src={auditorSignature}
                              alt="Auditor's Signature"
                              className="max-w-xs max-h-20 w-auto h-auto object-contain mb-2"
                            />
                            <div
                              className="border-t-2 border-gray-900 pt-4 mt-2 mb-2"
                              style={{ width: "200px" }}
                            ></div>
                          </>
                        ) : (
                          <div className="signature-placeholder">
                            <div
                              className="border-t-2 border-gray-900 pt-4 mt-2 mb-2"
                              style={{ width: "200px" }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">
                        {consentData.auditorFullName}
                      </p>
                      <p className="text-gray-600">Registered Auditor (ORC)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}