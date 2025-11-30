import { create } from 'zustand';

export interface Appointment {
  id: string;
  companyName: string;
  appointmentDate: string;
  registrationNumber: string;
  status: 'Active' | 'Pending' | 'Expired';
  consentCode: string; // Make consent code required
}

export interface Auditor {
  fullName: string;
  licenseNumber: string;
  firmName: string;
  status: 'verified' | 'expired' | 'suspended' | 'not_found';
}

export interface ConsentData {
  companyName: string;
  // Changed registrationNumber to email
  companyEmail: string;
  auditorFullName: string;
  firmName: string;
  licenseNumber: string;
  dateOfConsent: string;
  consentCode: string; // Added consent code field
  auditorSignature?: string; // Added auditor signature field
}

interface AppState {
  currentScreen: 'verification' | 'verification-results' | 'consent-form' | 'consent-letter' | 'dashboard';
  auditor: Auditor | null;
  appointments: Appointment[];
  consentData: ConsentData | null;
  showVerificationModal: boolean;
  isAuthenticated: boolean;
  auditorSignature?: string; // Added auditor signature to state
  setCurrentScreen: (screen: AppState['currentScreen']) => void;
  setAuditor: (auditor: Auditor | null) => void;
  setConsentData: (data: ConsentData | null) => void;
  setShowVerificationModal: (show: boolean) => void;
  verifyAuditor: (licenseNumber: string, consentCode?: string) => void; // Added consentCode parameter
  submitConsent: (companyName: string, companyEmail: string, auditorFullName: string) => void; // Added auditorFullName parameter
  setIsAuthenticated: (authenticated: boolean) => void;
  updateAppointmentStatus: (id: string, status: 'Active' | 'Pending' | 'Expired') => void; // Added function to update appointment status
  getAppointmentByConsentCode: (consentCode: string) => Appointment | undefined; // Added function to get appointment by consent code
  setAuditorSignature: (signature: string) => void; // Added function to set auditor signature
}

// Updated mock appointments with consent codes
const mockAppointments: Appointment[] = [
  {
    id: '1',
    companyName: 'Tech Innovations Inc.',
    appointmentDate: '2023-10-26',
    registrationNumber: 'C-12345',
    status: 'Active',
    consentCode: 'CNST-789456'
  },
  {
    id: '2',
    companyName: 'GreenLeaf Organics',
    appointmentDate: '2023-09-15',
    registrationNumber: 'C-67890',
    status: 'Active',
    consentCode: 'CNST-123789'
  },
  {
    id: '3',
    companyName: 'Quantum Solutions',
    appointmentDate: '2023-08-01',
    registrationNumber: 'C-24680',
    status: 'Active',
    consentCode: 'CNST-456123'
  },
  {
    id: '4',
    companyName: 'Starlight Ventures',
    appointmentDate: '2023-07-20',
    registrationNumber: 'C-54321',
    status: 'Pending',
    consentCode: 'CNST-987654'
  },
  {
    id: '5',
    companyName: 'Oceanic Goods',
    appointmentDate: '2023-06-11',
    registrationNumber: 'C-98765',
    status: 'Expired',
    consentCode: 'CNST-321654'
  }
];

// Updated mock auditors with a default auditor
const mockAuditors: { [key: string]: Auditor } = {
  'ICAG/2023/1234': {
    fullName: 'John Doe',
    licenseNumber: 'ICAG/2023/1234',
    firmName: 'Doe & Associates',
    status: 'verified'
  },
  'ICAG/2023/5678': {
    fullName: 'Jane Smith',
    licenseNumber: 'ICAG/2023/5678',
    firmName: 'Smith Auditing LLC',
    status: 'expired'
  },
  'ICAG/2023/9999': {
    fullName: 'Mike Johnson',
    licenseNumber: 'ICAG/2023/9999',
    firmName: 'Johnson & Co',
    status: 'suspended'
  }
};

// Better sample signature data URL (base64 encoded) - a clear signature image
const sampleSignature = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNIDEwIDUwIFEgNTAgMTAsIDkwIDUwIFQgMTcwIDUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj5TYW1wbGUgU2lnbmF0dXJlPC90ZXh0Pgo8L3N2Zz4K";

export const useStore = create<AppState>((set, get) => ({
  currentScreen: 'verification',
  auditor: {
    fullName: 'John Doe',
    licenseNumber: 'ICAG/2023/1234',
    firmName: 'Doe & Associates',
    status: 'verified'
  }, // Prefill with default auditor data
  appointments: mockAppointments,
  consentData: null,
  showVerificationModal: false,
  isAuthenticated: false,
  auditorSignature: localStorage.getItem('auditorSignature') || sampleSignature, // Load signature from localStorage or use sample

  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  setAuditor: (auditor) => set({ auditor }),

  setConsentData: (data) => set({ consentData: data }),

  setShowVerificationModal: (show) => set({ showVerificationModal: show }),

  setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

  // Added function to set auditor signature
  setAuditorSignature: (signature) => {
    // Save to localStorage for persistence
    localStorage.setItem('auditorSignature', signature);
    set({ auditorSignature: signature });
  },

  // Updated verifyAuditor function to include consentCode
  verifyAuditor: (licenseNumber: string, consentCode?: string) => {
    const auditor = mockAuditors[licenseNumber];
    
    // If consent code is provided, find the corresponding appointment
    if (consentCode) {
      const appointment = get().appointments.find(app => app.consentCode === consentCode);
      if (appointment) {
        // If we found an appointment with this consent code, update the consentData
        const consentData: ConsentData = {
          companyName: appointment.companyName,
          companyEmail: `${appointment.companyName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          auditorFullName: auditor?.fullName ?? 'John Doe', // Default to John Doe
          firmName: auditor?.firmName ?? 'Doe & Associates', // Default to Doe & Associates
          licenseNumber: licenseNumber,
          dateOfConsent: new Date().toISOString().split('T')[0],
          consentCode: consentCode,
          auditorSignature: get().auditorSignature // Include signature in consent data
        };
        set({ consentData });
      }
    }
    
    if (auditor) {
      set({ auditor, showVerificationModal: true });
    } else {
      set({
        auditor: {
          fullName: '',
          licenseNumber,
          firmName: '',
          status: 'not_found'
        },
        showVerificationModal: true
      });
    }
  },

  // Updated submitConsent function to use companyEmail instead of registrationNumber and include auditorFullName
  submitConsent: (companyName: string, companyEmail: string, auditorFullName: string) => {
    // Generate a unique consent code
    const consentCode = `CNST-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const consentData: ConsentData = {
      companyName,
      companyEmail, // Changed from registrationNumber
      auditorFullName, // Use the actual auditor name instead of hardcoded "John Doe"
      firmName: 'Doe & Associates',
      licenseNumber: 'ICAG/2023/1234',
      dateOfConsent: new Date().toISOString().split('T')[0],
      consentCode, // Added consent code
      auditorSignature: get().auditorSignature // Include signature in consent data
    };
    
    // Add new appointment with the consent code
    const newAppointment: Appointment = {
      id: (get().appointments.length + 1).toString(),
      companyName,
      appointmentDate: new Date().toISOString().split('T')[0],
      registrationNumber: `C-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Active',
      consentCode
      
    };
    
    set({ 
      consentData, 
      currentScreen: 'consent-letter',
      appointments: [...get().appointments, newAppointment]
    });
  },

  // Added function to update appointment status
  updateAppointmentStatus: (id: string, status: 'Active' | 'Pending' | 'Expired') => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    }));
  },

  // Added function to get appointment by consent code
  getAppointmentByConsentCode: (consentCode: string) => {
    return get().appointments.find(appointment => appointment.consentCode === consentCode);
  }
}));