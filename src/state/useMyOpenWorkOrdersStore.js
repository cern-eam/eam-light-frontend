import {create} from 'zustand';
import WS from '../tools/WS';

const useMyOpenWorkOrdersStore = create((set) => ({
    myOpenWorkOrders: [],
    fetchMyOpenWorkOrders: async () => {
        try {
            const response = await WS.getMyOpenWorkOrders();
            set({ myOpenWorkOrders: response.body.data });
        } catch (error) {
            console.error('Error fetching my work orders:', error);
            set({ myOpenWorkOrders: [] });
        }
    },
}));

export default useMyOpenWorkOrdersStore;
