import { Link } from 'react-router-dom';
import { Building, Home } from 'lucide-react';

const SimplifiedHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">ICAG</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-5 h-5 mr-1" />
              <span className="font-medium">Home</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimplifiedHeader;