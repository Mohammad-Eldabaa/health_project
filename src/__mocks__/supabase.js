import { jest } from '@jest/globals';

export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
  })),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
  })),
  removeChannel: jest.fn(),
  auth: {
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
};