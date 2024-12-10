import { create } from 'zustand';

const useAgencyStore = create((set) => ({
  agencies: JSON.parse(localStorage.getItem('agencies')) || [],  // Load agency list from localStorage
  selectedAgency: null, // Currently selected agency for edit or delete

  setAgencies: (agencies) => {
    localStorage.setItem('agencies', JSON.stringify(agencies));  // Store agency list in localStorage
    set({ agencies });
  },

  addAgency: (agency) => {
    set((state) => {
      const updatedAgencies = [...state.agencies, agency];
      localStorage.setItem('agencies', JSON.stringify(updatedAgencies));  // Store in localStorage
      return { agencies: updatedAgencies };
    });
  },

  deleteAgency: (id) => {
    set((state) => {
      const updatedAgencies = state.agencies.filter((agency) => agency._id !== id);
      localStorage.setItem('agencies', JSON.stringify(updatedAgencies));  // Store in localStorage
      return { agencies: updatedAgencies };
    });
  },

  selectAgency: (agency) => {
    set({ selectedAgency: agency });
  },

  clearAgencies: () => {
    localStorage.removeItem('agencies');  // Clear agencies from localStorage
    set({ agencies: [], selectedAgency: null });
  },
}));

export default useAgencyStore;
