import {DoneAll, ErrorOutline, Info} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {Alert, alpha, Box, Card, CardActions, CardContent, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WSBulletins from "@/tools/WSBulletins.js";
import {useState} from "react";

export const Bulletin = ({ bulletin, readOnly, onAcknowledge }) => {

    const theme = useTheme();

    const parseBoolean = (value) => value === "true" || value === true;
    const isCritical = bulletin.CRITICAL === "true";
    const [acknowledging, setAcknowledging] = useState(false);
    const [ackError, setAckError] = useState(null);

    const handleAcknowledge = async () => {
        try {
            setAcknowledging(true);
            setAckError(null);

            await WSBulletins.acknowledgeBulletin(
                bulletin.BULLETINCODE,
                bulletin.LANGUAGECODE
            )

            if (onAcknowledge) onAcknowledge(bulletin.BULLETINCODE);
        } catch (err) {
            console.error("Error acknowledging bulletin: ", err);
            setAckError("Failed to acknowledge bulletin. Please try again.");
        } finally {
            setAcknowledging(false);
        }
    }

    const criticalGradient = `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, white 10%)`;
    const borderColor = isCritical
        ? alpha(theme.palette.error.main, 0.2)
        : alpha(theme.palette.divider, 0.2);

    return (
        <Card sx={{
            border: `1px solid ${borderColor}`,
            background: isCritical ? criticalGradient : "inherit",
            backgroundClip: "padding-box"
        }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <Chip
                        icon={isCritical ? <ErrorOutline /> : <Info />}
                        label={isCritical ? 'Critical' : 'Information'}
                        sx={{
                            mb: 2,
                            padding: 1,
                            backgroundColor: isCritical ? theme.palette.error.main : "",
                            color: isCritical ? "white" : "text.secondary",
                            "& .MuiChip-icon": {
                                color: isCritical ? "white" : "text.secondary",
                            },
                        }}
                    />
                    { readOnly && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px"}}>
                            <DoneAll />
                            <Typography variant="body1" color="text.secondary">
                                {bulletin.DATEACK}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                    {bulletin.BULLETINTEXT}
                </Typography>
            </CardContent>
            { !readOnly && (
                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2}}>
                    <Button
                        onClick={handleAcknowledge}
                        variant="outlined"
                        disabled={acknowledging}
                    >
                        {acknowledging ? 'Acknowledging...' : 'Acknowledge'}
                    </Button>
                    { ackError && <Alert severity="error">{ackError}</Alert> }
                </CardActions>
            )}
        </Card>
    )
}