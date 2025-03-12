import {create} from 'zustand';
import WSWorkorders from '../tools/WSWorkorders';
import useUserDataStore from './useUserDataStore';

const useMyOpenWorkOrdersStore = create((set) => ({
    myOpenWorkOrders: [],
    fetchMyOpenWorkOrders: async () => {
        try {
            const userData = useUserDataStore.getState().userData;
            
            const [myOpenWorkOrders, scheduledWorkOrders] = await Promise.allSettled([
                WSWorkorders.getMyOpenWorkOrders(userData.eamAccount.employeeCode),
                WSWorkorders.getScheduledWorkOrders(),
            ]);

            const combinedWorkOrders = [
                ...(myOpenWorkOrders.status === 'fulfilled' ? myOpenWorkOrders.value.body.data : []),
                ...(scheduledWorkOrders.status === 'fulfilled' ? scheduledWorkOrders.value.body.data : [])
            ]

            //TODO remove possible duplicates 

            set({ myOpenWorkOrders: combinedWorkOrders });
        } catch (error) {
            console.error('Error fetching my work orders:', error);
            set({ myOpenWorkOrders: [] });
        }
    },
}));

export default useMyOpenWorkOrdersStore;
