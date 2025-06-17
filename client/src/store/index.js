import { create } from 'zustand';
import { createAuthSlice } from './slices/authslice.js';
import { createChatSlice } from './slices/chat-slice.js';

export const useAppStore = create((...args) => ({
  ...createAuthSlice(...args),
  ...createChatSlice(...args)
}));