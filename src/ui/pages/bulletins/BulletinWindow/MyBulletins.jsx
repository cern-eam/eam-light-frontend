import styles from "./MyBulletins.module.css";
import {useState} from "react";
import {Box, IconButton} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {Close} from "mdi-material-ui";
import {BulletinLoadingError} from "@/ui/pages/bulletins/BulletinWindow/Subcomponents/BulletinLoadingError.jsx";
import {NonAcknowledgedBulletins} from "@/ui/pages/bulletins/BulletinWindow/Subcomponents/NonAcknowledgedBulletins.jsx";
import {AcknowledgedBulletins} from "@/ui/pages/bulletins/BulletinWindow/Subcomponents/AcknowledgedBulletins.jsx";

export const MyBulletins = (
    {
        closeDrawer,
        bulletins,
        loading,
        error,
        onAcknowledge,
        activeTabOnOpen
    }) => {

    const [activeTab, setActiveTab] = useState(activeTabOnOpen);
    const [newlyAcknowledged, setNewlyAcknowledged] = useState(false);

    const [messageCache] = useState(() => new Map());

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    }

    if (error) {
        return (
            <BulletinLoadingError error={error} />
        )
    }

    return (
        <div
            className={styles.container}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1}}>
                <h1>Notifications</h1>
                <IconButton onClick={closeDrawer}>
                    <Close />
                </IconButton>
            </Box>

            <Box
                sx={{ borderBottom: 1, borderColor: 'divider'}}
            >
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Not Acknowledged" />
                    <Tab label="Acknowledged" />
                </Tabs>
            </Box>

            {activeTab === 0 && (
                <NonAcknowledgedBulletins
                    bulletins={bulletins}
                    loading={loading}
                    onAcknowledge={onAcknowledge}
                    setNewlyAcknowledged={setNewlyAcknowledged}
                />
            )}

            {activeTab === 1 && (
                <AcknowledgedBulletins
                    messageCache={messageCache}
                    activeTab={activeTab}
                    newlyAcknowledged={newlyAcknowledged}
                    onRefreshComplete={() => setNewlyAcknowledged(false)}
                />
            )}
        </div>
    )
}