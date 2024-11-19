import { create } from 'zustand';

const useTravelStore = create((set) => ({
  travel: null,
  selectedPackage: null,
  selectedDate: null,

  setTravel: (travel) => set({ travel }),
  setSelectedPackage: (selectedPackage) => set({ selectedPackage }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  clearTravel: () => set({ travel: null, selectedPackage: null, selectedDate: null }),
}));

export default useTravelStore;
