import {ManageSearch} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {Error} from "@mui/icons-material"
import styles from "@/ui/pages/bulletins/BulletinWindow/MyBulletins.module.css";
import {theme} from "eam-components/src/ui/components/theme/index.js";

export const EmptyBulletinsState = ({historyError}) => {

    return (
        <div className={styles.noBulletins} >
            { historyError ? (
                <div style={{ height: "-webkit-fit-content" }}>
                    <Error sx={{ color: theme.palette.error.main, fontSize: 80 }} />
                    <Typography variant="h3">
                        Error Loading Acknowledged Bulletins
                    </Typography>
                </div>
            ) : (
                <div>
                    <ManageSearch style={{ fontSize: 80}}/>
                    <Typography variant="h3">
                        No Acknowledged Bulletins
                    </Typography>
                </div>
            )}
        </div>
    )
}