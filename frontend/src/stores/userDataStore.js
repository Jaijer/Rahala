import { create } from 'zustand';

const useUserStore = create((set) => ({
  userData: null,
  userType: null,
  isAuthenticated: false,
  
  setUserData: (data) => set({ 
    userData: data,
    isAuthenticated: true 
  }),
  
  setUserType: (type) => set({ userType: type }),
  
  clearUser: () => set({ 
    userData: null,
    userType: null,
    isAuthenticated: false 
  }),
}));

export default useUserStore;