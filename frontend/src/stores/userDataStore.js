import { create } from 'zustand';

const useUserStore = create((set) => ({
  userData: JSON.parse(localStorage.getItem('userData')) || null,  // Load from localStorage if available
  userType: JSON.parse(localStorage.getItem('userType')) || null,  // Load user type from localStorage
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,  // Load authentication status from localStorage

  setUserData: (data) => {
    localStorage.setItem('userData', JSON.stringify(data));  // Store user data in localStorage
    set({ userData: data, isAuthenticated: true });
  },
  
  setUserType: (type) => {
    localStorage.setItem('userType', JSON.stringify(type));  // Store user type in localStorage
    set({ userType: type });
  },
  
  clearUser: () => {
    localStorage.removeItem('userData');  // Remove user data from localStorage
    localStorage.removeItem('userType');  // Remove user type from localStorage
    localStorage.removeItem('isAuthenticated');  // Remove authentication status from localStorage
    set({ userData: null, userType: null, isAuthenticated: false });
  },
}));

export default useUserStore;
