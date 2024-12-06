import useUserDataStore from "@/state/useUserDataStore";
import { useMemo } from "react";

const useScreenPermissions = (screen) => {
    const {
        userData: { screens },
    } = useUserDataStore();

    const selectedScreen = useMemo(() => {
        if (!screen || !screens) return null;
        return screens[screen];
    }, [screens, screen]);

    if (!selectedScreen) return null;

    return {
        creationAllowed: selectedScreen.creationAllowed,
        readAllowed: selectedScreen.readAllowed,
        updateAllowed: selectedScreen.updateAllowed,
    };
};

export default useScreenPermissions;
