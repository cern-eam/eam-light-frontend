import {create} from 'zustand';
import WSWorkorders from '../tools/WSWorkorders';
import useUserDataStore from './useUserDataStore';

const useMyTeamWorkOrdersStore = create((set) => ({
    myTeamWorkOrders: [],
    fetchMyTeamWorkOrders: async () => {
        try {
            let eamAccount = useUserDataStore.getState().userData.eamAccount
            const response = await WSWorkorders.getMyTeamWorkOrders(eamAccount.userDepartments.join(','));
            set({ myTeamWorkOrders: response.body.data });
        } catch (error) {
            console.error('Error fetching my work orders:', error);
            set({ myTeamWorkOrders: [] });
        }
    },
}));

export default useMyTeamWorkOrdersStore;
