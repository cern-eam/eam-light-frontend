import {create} from 'zustand';
import WS from '../tools/WS';

const useMyTeamWorkOrdersStore = create((set) => ({
    myTeamWorkOrders: [],
    fetchMyTeamWorkOrders: async () => {
        try {
            const response = await WS.getMyTeamWorkOrders();
            set({ myTeamWorkOrders: response.body.data });
        } catch (error) {
            console.error('Error fetching my work orders:', error);
            set({ myTeamWorkOrders: [] });
        }
    },
}));

export default useMyTeamWorkOrdersStore;
