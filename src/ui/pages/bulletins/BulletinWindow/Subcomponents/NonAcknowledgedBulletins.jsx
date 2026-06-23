import {Box, Skeleton} from "@mui/material";
import styles from "@/ui/pages/bulletins/BulletinWindow/MyBulletins.module.css";
import {TaskAlt} from "@mui/icons-material";
import Typography from "@mui/material/Typography/index.d.ts";
import {Bulletin} from "@/ui/pages/bulletins/Bulletin.jsx";

export const NonAcknowledgedBulletins = ({bulletins, loading, onAcknowledge, setNewlyAcknowledged}) => {
    return (
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
                                setNewlyAcknowledged={setNewlyAcknowledged}
                            />
                        ))
                    )}
                </div>
            )}
        </Box>
    )
}