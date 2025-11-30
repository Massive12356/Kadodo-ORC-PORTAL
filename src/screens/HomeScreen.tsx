import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, Menu, X } from 'lucide-react';

export default function HomeScreen() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-[0.8rem] md:text-xl font-bold text-gray-900">
                  Kadodo Auditors Verification Portal
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/verification-login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Verification Login
              </Link>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            <div className="relative bg-white h-full w-64 ml-auto overflow-y-auto">
              <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <span className="ml-2 text-[0.9rem] md:text-xl font-bold text-gray-900">
                        Kadodo Auditors
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <X className="block h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/verification-login"
                    className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Verification Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl lg:leading-relaxed">
              Office of the Registrar of Companies Ghana
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-2xl text-gray-500">
              Smart verification for a compliant business environment.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/verification-login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Layers className="mr-2 h-5 w-5" />
                Auditor Verification Portal
              </Link>
            </div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Layers className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Auditor Verification
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Verify the credentials of auditors for your business
                        needs
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/verification-login"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Access Verification Portal →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Company Compliance
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Ensure your company meets all regulatory requirements
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <Layers className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Verification Process
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Understand the step-by-step verification process for auditors
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      View Process →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2023 Institute of Chartered Accountants Ghana. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}