import { create } from 'zustand';

const useSearchStore = create((set) => ({
  departure: '',
  destination: '',
  date: '',
  sortBy: 'الأشهر', // Default sort option
  alterSearch: false,
  setDeparture: (departure) => set({ departure }),
  setDestination: (destination) => set({ destination }),
  setDate: (date) => set({ date }),
  setSortBy: (sortBy) => set({ sortBy }), // Setter for sortBy
  setAlterSearch: (alterSearch) => set({alterSearch})
}));

export default useSearchStore;
