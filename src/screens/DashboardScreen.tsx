import { useState } from 'react';
import { Search, ChevronDown, Table, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

export default function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [sortField, setSortField] = useState<'appointmentDate' | 'companyName'>('appointmentDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false); // Added state for sort dropdown
  const appointmentsPerPage = 5;
  const appointments = useStore((state) => state.appointments);
  const updateAppointmentStatus = useStore((state) => state.updateAppointmentStatus);
  const setConsentData = useStore((state) => state.setConsentData);
  const navigate = useNavigate();

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort appointments based on sort field and direction
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortField === 'appointmentDate') {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortDirection === 'asc' 
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName);
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(startIndex, endIndex);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Toggle sort direction when clicking on the same field
  const handleSort = (field: 'appointmentDate' | 'companyName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setShowSortDropdown(false); // Close dropdown after selection
  };

  const toggleActionDropdown = (id: string) => {
    setShowActionDropdown(showActionDropdown === id ? null : id);
  };

  const handleStatusChange = (id: string, status: 'Active' | 'Pending' | 'Expired') => {
    updateAppointmentStatus(id, status);
    setShowActionDropdown(null);
    toast.success(`Status updated to ${status.toLowerCase()}!`);
  };

  const handleViewLetter = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      const consentData = {
        companyName: appointment.companyName,
        companyEmail: `${appointment.companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        auditorFullName: 'John Doe',
        firmName: 'Doe & Associates',
        licenseNumber: 'ICAG/2023/1234',
        dateOfConsent: appointment.appointmentDate,
        consentCode: appointment.consentCode
      };
      
      setConsentData(consentData);
      setShowActionDropdown(null);
      navigate('/consent-letter');
    }
  };

  // Card view component
  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{appointment.companyName}</h3>
          <p className="text-sm text-gray-500 mt-1">{appointment.appointmentDate}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(appointment.status)}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {appointment.status}
        </span>
      </div>
      
      <div className="mt-3 text-sm">
        <p className="text-gray-600">Reg #: {appointment.registrationNumber}</p>
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="relative">
          <button 
            onClick={() => toggleActionDropdown(appointment.id)}
            className="text-blue-900 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 text-sm"
          >
            View Details
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showActionDropdown === appointment.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleViewLetter(appointment.id)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Letter
              </button>
              <button
                onClick={() => handleStatusChange(appointment.id, 'Expired')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mark as Expired
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Mintah JR!</h2>
          <p className="text-gray-600">You have {appointments.length} active appointments.</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Company Name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
                    title="Table View"
                  >
                    <Table className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white shadow-sm' : ''}`}
                    title="Card View"
                  >
                    <CreditCard className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm whitespace-nowrap">
                      {sortField === 'appointmentDate' ? 'Sort by Date' : 'Sort by Name'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => handleSort('appointmentDate')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <span>Appointment Date</span>
                        {sortField === 'appointmentDate' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleSort('companyName')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <span>Company Name</span>
                        {sortField === 'companyName' && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            {currentAppointments.length > 0 ? (
              viewMode === 'table' ? (
                // Table view
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Company Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Appointment Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Registration Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">{appointment.companyName}</td>
                          <td className="px-6 py-4 text-gray-700">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 text-gray-700">{appointment.registrationNumber}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                                appointment.status
                              )}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 relative">
                            <div className="relative">
                              <button 
                                onClick={() => toggleActionDropdown(appointment.id)}
                                className="text-blue-900 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
                              >
                                View Details
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              
                              {showActionDropdown === appointment.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  <button
                                    onClick={() => handleViewLetter(appointment.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View Letter
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(appointment.id, 'Expired')}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Expired
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Card view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No records found</h3>
                <p className="text-gray-500">No companies match your search criteria.</p>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedAppointments.length)} of {sortedAppointments.length} entries
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}