import { create } from 'zustand';

const useLoadingStore = create((set) => ({
    isLoading: false,
    setIsLoading: (bool) => set({
        isLoading: bool
    })
}));

export default useLoadingStore;