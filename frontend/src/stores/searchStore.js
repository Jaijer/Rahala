import {create} from 'zustand';

const useSearchStore = create((set) => ({
  departure: '',
  destination: '',
  date: '',
  setDeparture: (departure) => set({ departure }),
  setDestination: (destination) => set({ destination }),
  setDate: (date) => set({ date }),
}));

export default useSearchStore;
