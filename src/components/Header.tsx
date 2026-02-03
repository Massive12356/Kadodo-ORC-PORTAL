import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Home, Plus, ChevronDown, FileSignature, Menu, X } from "lucide-react";
import toast from 'react-hot-toast';

const Header = () => {
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleAddConsent = () => {
    toast.success("Redirecting to consent form...");
    setShowCompanyDropdown(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">OFFICE OF REGISTRAR COMPANIES(ORC)</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <Link
                to="/"
                className="text-gray-900 font-medium flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
              </Link>

              <Link to="/signature">
                <button className="text-gray-900 font-medium flex items-center gap-2">
                  <FileSignature className="w-4 h-4" />
                  Signature
                </button>
              </Link>
            </nav>
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Companies
                <ChevronDown className="w-4 h-4" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <Link
                    to="/consent-form"
                    onClick={handleAddConsent}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Consent
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View All Companies
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
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
                  <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-bold text-gray-900">ORC</h1>
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
                  to="/"
                  className="text-gray-900 font-medium flex items-center gap-2 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  to="/signature"
                  className="text-gray-900 font-medium flex items-center gap-2 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileSignature className="w-4 h-4" />
                  Signature
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/consent-form"
                  className="text-gray-900 font-medium block px-3 py-2 rounded-md"
                  onClick={() => {
                    handleAddConsent();
                    setIsMenuOpen(false);
                  }}
                >
                  Add Consent
                </Link>
                <a
                  href="#"
                  className="text-gray-900 font-medium block px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Companies
                </a>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-900 font-medium">Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;