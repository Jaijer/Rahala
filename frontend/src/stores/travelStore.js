import { create } from 'zustand';

const useTravelStore = create((set) => ({
  travel: null,
  selectedPackage: null,
  selectedDate: null,
  numberOfTravelers: 0,

  setTravel: (travel) => set({ travel }),
  setSelectedPackage: (selectedPackage) => set({ selectedPackage }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setNumberOfTravelers: (numberOfTravelers) => set({numberOfTravelers}),
  clearTravel: () => set({ travel: null, selectedPackage: null, selectedDate: null }),
}));

export default useTravelStore;
