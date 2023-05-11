const store = window.electron.store;
const { get, set } = store;
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return get(name) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    set(name, null);
  },
};
export default storage;
