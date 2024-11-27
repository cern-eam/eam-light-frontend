import {create} from 'zustand';
import queryString from 'query-string';
import WS from '../tools/WS';

const useUserDataStore = create((set) => ({
    userData: null,
    
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

        const response = await fetchUserData();
        set({ userData: response.body.data });
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
        set({ userData: null });
    }
}));

export default useUserDataStore;