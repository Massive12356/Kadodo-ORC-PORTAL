import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Printer, Download } from 'lucide-react';

export default function ConsentLetterScreen() {
  const consentData = useStore((state) => state.consentData);
  const auditorSignature = useStore((state) => state.auditorSignature);

  // Show a message if no consent data is available
  if (!consentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Consent Data Available</h2>
          <p className="text-gray-600 mb-6">Please complete the consent form to generate a letter.</p>
          <Link 
            to="/verification-login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Verification Portal
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = document.getElementById('consent-letter-content');
    if (!printContent) {
      toast.error('Could not find letter content to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Auditor's Consent Letter</title>
            <style>
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
              }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .text-gray-900 { color: #111827; }
              .text-gray-600 { color: #4b5563; }
              .text-gray-700 { color: #374151; }
              .text-black { color: #000; }
              .mb-8 { margin-bottom: 2rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .mb-1 { margin-bottom: 0.25rem; }
              .my-8 { margin-top: 2rem; margin-bottom: 2rem; }
              .mt-16 { margin-top: 4rem; }
              .mt-8 { margin-top: 2rem; }
              .space-y-6 > * + * { margin-top: 1.5rem; }
              .space-y-2 > * + * { margin-top: 0.5rem; }
              .leading-relaxed { line-height: 1.625; }
              .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
              .text-2xl { font-size: 1.5rem; line-height: 2rem; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .uppercase { text-transform: uppercase; }
              .tracking-wider { letter-spacing: 0.05em; }
              .border-t-2 { border-top-width: 2px; }
              .border-gray-900 { border-color: #111827; }
              .pt-4 { padding-top: 1rem; }
              .p-6 { padding: 1.5rem; }
              .rounded-lg { border-radius: 0.5rem; }
              .bg-blue-50 { background-color: #eff6ff; }
              .border-2 { border-width: 2px; }
              .border-dashed { border-style: dashed; }
              .border-blue-200 { border-color: #bfdbfe; }
              .text-blue-600 { color: #2563eb; }
              .signature-container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-top: 1rem;
              }
              .signature-image {
                max-height: 80px;
                max-width: 320px;
                width: auto;
                height: auto;
                object-fit: contain;
                margin-bottom: 1rem;
                border: none;
                border-radius: 0;
                padding: 0;
                background: transparent;
              }
              .max-w-xs {
                max-width: 320px;
              }
              .max-h-20 {
                max-height: 80px;
              }
              .w-auto {
                width: auto;
              }
              .h-auto {
                height: auto;
              }
              .object-contain {
                object-fit: contain;
              }
              .mb-2 {
                margin-bottom: 0.5rem;
              }
              /* Added text justification for mobile */
              @media (max-width: 768px) {
                .justify-on-mobile {
                  text-align: justify;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      toast.success('Letter printed successfully!');
    } else {
      toast.error('Unable to open print window. Please check your popup blocker.');
    }
  };

  const handleDownload = async () => {
    const letterElement = document.getElementById('consent-letter-content');
    
    if (!letterElement) {
      toast.error('Could not find letter content to download');
      return;
    }

    try {
      // Temporarily modify styles for PDF generation
      const originalStyle = {
        width: letterElement.style.width,
        maxWidth: letterElement.style.maxWidth,
        padding: letterElement.style.padding,
        margin: letterElement.style.margin
      };

      // Set styles for better PDF rendering
      letterElement.style.width = '800px';
      letterElement.style.maxWidth = '800px';
      letterElement.style.padding = '40px';
      letterElement.style.margin = '0 auto';

      // Use html2canvas to capture the letter content
      const canvas = await html2canvas(letterElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Restore original styles
      letterElement.style.width = originalStyle.width;
      letterElement.style.maxWidth = originalStyle.maxWidth;
      letterElement.style.padding = originalStyle.padding;
      letterElement.style.margin = originalStyle.margin;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Auditor_Consent_Letter_${consentData.companyName}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Auditor's Consent Letter
          </h2>
          <p className="text-gray-600">
            Please review the letter before printing or downloading.
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Letter
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300"
          >
            <Download className="w-5 h-5" />
            Download as PDF
          </button>
        </div>

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
                This letter serves as formal confirmation that I,{" "}
                <span className="font-bold text-gray-900">
                  {consentData?.auditorFullName ?? "N/A"}
                </span>{" "}
                (ICAG Registration Number:{" "}
                <span className="font-bold text-gray-900">
                  {consentData.licenseNumber}
                </span>
                ), being a qualified auditor in accordance with the regulations
                of the Institute of Chartered Accountants, Ghana (ICAG), hereby
                give my consent to act as the auditor for:
              </p>

              <div className="text-center my-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {consentData.companyName}
                </h2>
                <p className="text-gray-600">
                  (Company Email Number:{" "}
                  <span className="text-black font-medium">
                    {consentData.companyEmail}
                  </span>
                  )
                </p>
              </div>

              <p>
                This consent is granted for the financial year ending December
                31, 2024, and for every subsequent financial year until this
                consent is formally withdrawn.
              </p>

              <p>
                For verification and record-keeping purposes with the Office of
                the Registrar of Companies (ORC) and the Institute of Chartered
                Accountants, Ghana (ICAG), the unique digital consent code
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
              <p className="text-gray-600">Chartered Accountant (ICAG)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}