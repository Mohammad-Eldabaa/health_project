import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NursingAppointments from '../pages/Nursing/NursingAppointments';
import { supabase } from '../supaBase/NursingBooking';
import { useAppointmentStore } from '../store/appointmentStore';

// Mock dependencies
vi.mock('../supaBase/NursingBooking', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Dr. Smith', fees: 100 },
          { id: 2, name: 'Dr. Jones', fees: 150 },
        ],
        error: null,
      }),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
  },
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

describe('NursingAppointments', () => {
  beforeEach(() => {
    useAppointmentStore.mockReturnValue({
      appointments: [
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
      ],
      addAppointment: vi.fn(),
      reorderAppointments: vi.fn(),
      fetchAppointments: vi.fn(),
      error: null,
    });
  });

  it('renders the component and displays appointments', async () => {
    render(<NursingAppointments />);
    
    expect(screen.getByText('جدولة المواعيد')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('فحص')).toBeInTheDocument();
  });

  it('opens the add appointment modal when the button is clicked', async () => {
    render(<NursingAppointments />);
    
    const addButton = screen.getByRole('button', { name: /إضافة موعد جديد/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('إضافة موعد جديد')).toBeInTheDocument();
      expect(screen.getByLabelText('الاسم الكامل')).toBeInTheDocument();
    });
  });

  it('fetches doctors on mount', async () => {
    render(<NursingAppointments />);
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('doctors');
      expect(screen.getByText(/Dr. Smith/i)).toBeInTheDocument();
    });
  });
});