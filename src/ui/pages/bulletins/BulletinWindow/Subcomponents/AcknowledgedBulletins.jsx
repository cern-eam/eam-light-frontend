import {Box, CircularProgress, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Bulletin} from "@/ui/pages/bulletins/Bulletin.jsx";
import styles from "@/ui/pages/bulletins/BulletinWindow/MyBulletins.module.css";
import {useCallback, useEffect, useState} from "react";
import WSBulletins from "@/tools/WSBulletins.js";
import {formatShort} from "@/helpers/HelperFunctions.js";
import {LoadMoreBulletins} from "@/ui/pages/bulletins/BulletinWindow/Subcomponents/LoadMoreBulletins.jsx";
import {EmptyBulletinsState} from "@/ui/pages/bulletins/BulletinWindow/Subcomponents/EmptyBulletinsState.jsx";

export const AcknowledgedBulletins = ({ messageCache, activeTab, newlyAcknowledged, onRefreshComplete }) => {

    const [historyBulletins, setHistoryBulletins] = useState([]);
    const [displayedBulletins, setDisplayedBulletins] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);
    const [historyFetched, setHistoryFetched] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [initializing, setInitializing] = useState(true);

    const getMessage = useCallback((bulletinCode, languageCode) => {
        const key = `${bulletinCode}-${languageCode}`;

        if (messageCache.has(key)) {
            return Promise.resolve(messageCache.get(key));
        }

        return WSBulletins.getBulletinHistoryById(bulletinCode, languageCode)
            .then(response => {
                messageCache.set(key, response);
                return response;
            });
    }, [messageCache]);

    const areAllMessagesCached = (bulletins) => {
        return bulletins.every(b => {
            const key = `${b.BULLETINHISTORYPK.BULLETINCODE}-${b.BULLETINHISTORYPK.LANGUAGEID.LANGUAGECODE}`;
            return messageCache.has(key);
        });
    };

    const processBulletins = useCallback( async (bulletinsToLoad) => {
        const results = await Promise.allSettled(
            bulletinsToLoad.map(async (bulletin) => {
                try {
                    const bulletinCode = bulletin.BULLETINHISTORYPK.BULLETINCODE;
                    const languageCode = bulletin.BULLETINHISTORYPK.LANGUAGEID.LANGUAGECODE;

                    const messageResponse = await getMessage(bulletinCode, languageCode);

                    setLoadedCount(prev => prev + 1);

                    return {
                        ...bulletin,
                        BULLETINCODE: bulletinCode,
                        LANGUAGECODE: languageCode,
                        BULLETINTEXT: messageResponse.body.Result.ResultData.BulletinHistory.BULLETINMESSAGE,
                        CRITICAL: messageResponse.body.Result.ResultData.BulletinHistory.CRITICAL,
                        DATEACK: formatShort(messageResponse.body.Result.ResultData.BulletinHistory.DATEACKNOWLEDGED)
                    }
                } catch (error) {
                    console.error(`Failed to process bulletin ${bulletin.BULLETINHISTORYPK.BULLETINCODE}:`, error);

                    return {
                        ...bulletin,
                        BULLETINCODE: bulletin.BULLETINHISTORYPK.BULLETINCODE,
                        LANGUAGECODE: bulletin.BULLETINHISTORYPK.LANGUAGEID.LANGUAGECODE,
                        BULLETINTEXT: 'Failed to load bulletin content',
                        CRITICAL: 'false',
                        DATEACK: 'N/A'
                    };
                }

            })
        );

        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.status === 'fulfilled' ? result.value : null)
            .filter(Boolean);

    }, [getMessage])

    const fetchBulletinHistory = useCallback(async (count = 5) => {
        try {
            setHistoryError(null);
            setLoadedCount(0);

            const response = await WSBulletins.getBulletinHistory();
            const bulletins = response.body.Result.ResultData.DATARECORD || [];
            setHistoryCount(bulletins.length);

            const bulletinsToLoad = bulletins.slice(0, count);

            const allCached = areAllMessagesCached(bulletinsToLoad);

            if (!allCached) {
                setHistoryLoading(true);
            } else {
                setInitializing(false);
            }

            const bulletinsWithMessages = await processBulletins(bulletinsToLoad);

            setHistoryBulletins(bulletins);
            setDisplayedBulletins(bulletinsWithMessages);
            setHistoryFetched(true);
            setDisplayCount(count);

            if (onRefreshComplete) onRefreshComplete();
        } catch (err) {
            setHistoryError(err);
            console.error('Failed to fetch bulletin history: ', err);
        } finally {
            setHistoryLoading(false);
            setInitializing(false);
        }
    }, [processBulletins]);

    const onLoadMoreBulletins = useCallback(async () => {
        try {
            setIsLoadingMore(true);
            const currentCount = displayedBulletins.length;
            const nextCount = Math.min(currentCount + 5, historyCount);

            const bulletinsToLoad = historyBulletins.slice(currentCount, nextCount);

            setLoadedCount(0);

            const bulletinsWithMessages = await processBulletins(bulletinsToLoad);

            setDisplayedBulletins(prev => [...prev, ...bulletinsWithMessages]);
            setDisplayCount(nextCount);

        } catch (err) {
            console.error('Failed to load more bulletins:', err);
            setHistoryError(err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [displayedBulletins.length, historyCount, historyBulletins, processBulletins]);

    useEffect(() => {
        if (activeTab === 1 && (!historyFetched || newlyAcknowledged)) {
            void fetchBulletinHistory();
        }
    }, [activeTab, fetchBulletinHistory, historyFetched, newlyAcknowledged]);

    return (
        <Box
            sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",

            }}>
            { historyLoading ? (
                <Box sx={{ mt: 10, textAlign: "center" }}>
                    <Typography variant="body1">
                        Loading {loadedCount} / {Math.min(5, historyCount)} bulletins...
                    </Typography>
                    <Box sx={{ width: "100%", mt: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={(loadedCount / Math.min(5, historyCount)) * 100}
                        />
                    </Box>
                </Box>
            ) : (
                <>
                    {initializing ? (
                        <Box sx={{ mt: 10, textAlign: "center" }}>
                            <CircularProgress />
                        </Box>
                    ) : displayedBulletins.length === 0 ? (
                        <EmptyBulletinsState historyError={historyError} />
                    ) : (
                        <>
                            <div className={styles.bulletinsContainer}>
                                {displayedBulletins.map((bulletin) => (
                                    <Bulletin
                                        key={bulletin.BULLETINCODE}
                                        readOnly={true}
                                        bulletin={bulletin}
                                    />
                                ))}
                            </div>
                            {displayCount < historyCount && (
                                <LoadMoreBulletins
                                    isLoadingMore={isLoadingMore}
                                    loadedCount={loadedCount}
                                    onLoadMoreBulletins={onLoadMoreBulletins}
                                    historyCount={historyCount}
                                    displayCount={displayCount}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </Box>
    )
}