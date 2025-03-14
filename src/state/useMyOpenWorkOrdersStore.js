import {create} from 'zustand';
import WSWorkorders from '../tools/WSWorkorders';
import useUserDataStore from './useUserDataStore';

const useMyOpenWorkOrdersStore = create((set) => ({
    myOpenWorkOrders: [],
    fetchMyOpenWorkOrders: async () => {
        try {
            const userData = useUserDataStore.getState().userData;
            
            const [scheduledWorkOrders, assignedWorkOrders] = await Promise.allSettled([
                WSWorkorders.getScheduledWorkOrders(),
                WSWorkorders.getAssignedWorkOrders(userData.eamAccount.employeeCode)
            ]);

            const combinedWorkOrders = [
                ...(scheduledWorkOrders.status === 'fulfilled' ? scheduledWorkOrders.value.body.data : []),
                ...(assignedWorkOrders.status === 'fulfilled' ? assignedWorkOrders.value.body.data : [])
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
