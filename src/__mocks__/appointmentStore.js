import { vi } from 'vitest';

const mockAppointments = [
  {
    id: 1,
    date: '2025-08-07',
    time: '10:00',
    status: 'في الإنتظار',
    reason: '',
    payment: false,
    cancelled: false,
    amount: 100,
    patient_id: 1,
    patientName: 'John Doe',
    doctor_id: 1,
    doctorName: 'Dr. Smith',
    visitType: 'فحص',
  },
];

export const useAppointmentStore = vi.fn(() => ({
  appointments: mockAppointments,
  addAppointment: vi.fn(),
  reorderAppointments: vi.fn(),
  fetchAppointments: vi.fn(),
  error: null,
}));