import {create} from 'zustand';
import WS from '../tools/WS';

const useApplicationDataStore = create((set) => ({
    applicationData: null,
    fetchApplicationData: async () => {
        try {
            const response = await WS.getApplicationData();

            let serviceAccounts;
            try {
                serviceAccounts =
                    response.body.data.EL_SERVI &&
                    Object.keys(
                        JSON.parse(response.body.data.EL_SERVI)
                    );
            } catch (err) {
                serviceAccounts = [];
            }
            
            set({ applicationData: 
                {...response.body.data, 
                    serviceAccounts}
             });
        } catch (error) {
            console.error('Error fetching application data:', error);
            set({ applicationData: null });
        }
    },
}));

export default useApplicationDataStore;
