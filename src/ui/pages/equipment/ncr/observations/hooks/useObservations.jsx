import { useCallback, useEffect, useState } from "react";
import WSNCRs from "@/tools/WSNCRs";

const useObservations = (ncrCode, handleError) => {
    const [observations, setObservations] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const fetchData = useCallback(async (ncr) => {
        if (ncr) {
            try {
                setIsLoading(true);
                const response = await WSNCRs.getNonConformityObservations(ncr);
                setObservations(response.body.data);
            } catch (error) {
                console.log(error);
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (ncrCode) fetchData(ncrCode);
    }, [ncrCode, fetchData]);

    return { observations, isLoading, fetchData };
};

export default useObservations;
