import { create } from 'zustand';
import queryString from 'query-string';
import WS from '../tools/WS';

const useUserDataStore = create((set) => ({
    userData: null,
    userDataFetchError: false, // New property added

    fetchUserData: async () => {
        const fetchUserData = () => {
            // Get URL parameters
            const values = queryString.parse(window.location.search);
            const screenCode = values.screen;
            const currentScreen = window.location.pathname
                .replace(process.env.PUBLIC_URL, '')
                .split('/')[1];
            return WS.getUserData(currentScreen, screenCode);
        };

        try {
            const response = await fetchUserData();
            set({ userData: response.body.data, userDataFetchError: false });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            set({ userDataFetchError: true }); // Update failure state
        }
    },

    updateUserData: (updatedData) => {
        set((state) => ({
            userData: {
                ...state.userData,
                ...updatedData,
            },
        }));
    },

    cleanUserData: () => {
        set({ userData: null, userDataFetchError: false }); // Reset failure state
    }
}));

export default useUserDataStore;
