import { create } from 'zustand';
import { createAuthSlice } from './slices/authslice.js';

export const useAppStore = create((...args) => ({
  ...createAuthSlice(...args),
}));