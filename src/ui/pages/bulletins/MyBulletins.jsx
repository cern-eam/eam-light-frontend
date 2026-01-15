import styles from "./MyBulletins.module.css";
import {useCallback, useEffect, useState} from "react";
import {Bulletin} from "@/ui/pages/bulletins/Bulletin.jsx";
import {Box, IconButton, LinearProgress, Skeleton} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {Close} from "mdi-material-ui";
import {Error, ManageSearch, TaskAlt} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import WSBulletins from "@/tools/WSBulletins.js";
import {theme} from "eam-components/src/ui/components/theme/index.js";
import {formatShort, batchRequests} from "@/helpers/HelperFunctions.js";
import Button from "@mui/material/Button";

export const MyBulletins = (
    {
        closeDrawer,
        bulletins,
        loading,
        error,
        onAcknowledge,
    }) => {

    const [historyBulletins, setHistoryBulletins] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);
    const [historyFetched, setHistoryFetched] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);

    const messageCache = new Map();

    const getMessage = async (bulletinCode, languageCode) => {
        const key = `${bulletinCode}-${languageCode}`

        if (messageCache.has(key)) {
            return messageCache.get(key);
        }

        const response = await WSBulletins.getBulletinHistoryById(bulletinCode, languageCode);
        messageCache.set(key, response);
        return response;
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    }

    const fetchBulletinHistory = useCallback(async () => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);

            const response = await WSBulletins.getBulletinHistory();
            const bulletins = response.body.Result.ResultData.DATARECORD || [];
            setHistoryCount(bulletins.length);

            const bulletinsWithMessages = await batchRequests(
                bulletins,
                10,
                async (bulletin) => {
                    const bulletinCode = bulletin.BULLETINHISTORYPK.BULLETINCODE;
                    const languageCode = bulletin.BULLETINHISTORYPK.LANGUAGEID.LANGUAGECODE;

                    const messageResponse = await getMessage(bulletinCode, languageCode);

                    return {
                        ...bulletin,
                        BULLETINTEXT: messageResponse.body.Result.ResultData.BulletinHistory.BULLETINMESSAGE,
                        CRITICAL: messageResponse.body.Result.ResultData.BulletinHistory.CRITICAL,
                        DATEACK: formatShort(messageResponse.body.Result.ResultData.BulletinHistory.DATEACKNOWLEDGED)
                    }
                },
                () => setLoadedCount((prev) => prev + 1)
            )

            setHistoryBulletins(bulletinsWithMessages);
            setHistoryFetched(true);
            console.log("BulletinsWithMessages:", bulletinsWithMessages);
        } catch (err) {
            setHistoryError(err);
            console.error('Failed to fetch bulletin history: ', err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 1 && !historyFetched) {
            void fetchBulletinHistory();
        }
    }, [activeTab, fetchBulletinHistory, historyFetched]);

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Error color="error" sx={{ fontSize: 60 }} />
                <Typography variant="h5" sx={{ mt: 2 }}>
                    Failed to Load Bulletins
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {error.message || 'An unexpected error occurred'}
                </Typography>
                <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Box>
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
                <Box sx={{ p: 3, height: "-webkit-fill-available" }}>
                    { loading ? (
                        <div>
                            <Skeleton variant="rectangular" width="100%" height={155} sx={{ mb: 2, borderRadius: "4px"}}/>
                            <Skeleton variant="rectangular" width="100%" height={155} sx={{ mb: 2, borderRadius: "4px" }}/>
                            <Skeleton variant="rectangular" width="100%" height={155} sx={{ mb: 2, borderRadius: "4px"}}/>
                            <Skeleton variant="rectangular" width="100%" height={155} sx={{ mb: 2, borderRadius: "4px" }}/>
                        </div>
                    ) : (
                        <div className={styles.bulletinsContainer}>
                            {bulletins.length === 0 ? (
                                <div className={styles.noBulletins}>
                                    <TaskAlt style={{ fontSize: 80 }}/>
                                    <Typography variant="h3">
                                        All Bulletins Acknowledged
                                    </Typography>
                                </div>
                            ) : (
                                bulletins.map((bulletin) => (
                                    <Bulletin
                                        key={bulletin.BULLETINCODE}
                                        bulletin={bulletin}
                                        onAcknowledge={onAcknowledge}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </Box>
            )}

            {activeTab === 1 && (
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    { historyLoading ? (
                        <Box sx={{ mt: 10, height: "-webkit-fill-available" }}>
                            <Typography variant="body1">
                                Loading {loadedCount} / {historyCount} bulletins...
                            </Typography>
                            <Box sx={{ width: "100%", mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(loadedCount / bulletins.length) * 100}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <div>
                            {!historyBulletins || historyBulletins.length <= 0 ? (
                                <div className={styles.noBulletins}>
                                    { historyError ? (
                                        <div style={{ height: "-webkit-fit-content" }}>
                                            <Error sx={{ color: theme.palette.error.main, fontSize: 80 }}/>
                                            <Typography variant="h3">
                                                Error Loading Acknowledged Bulletins
                                            </Typography>
                                        </div>
                                    ) : (
                                        <div>
                                            <ManageSearch style={{ fontSize: 80 }}/>
                                            <Typography variant="h3">
                                                No Acknowledged Bulletins
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.bulletinsContainer}>
                                    {historyBulletins.map((bulletin) => (
                                        <Bulletin
                                            key={bulletin.BULLETINHISTORYPK.BULLETINCODE}
                                            readOnly={true}
                                            bulletin={bulletin}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Box>
            )}
        </div>
    )
}