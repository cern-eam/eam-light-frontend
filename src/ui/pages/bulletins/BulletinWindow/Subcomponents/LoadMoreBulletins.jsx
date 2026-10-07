import {Box, LinearProgress} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const LoadMoreBulletins = ({
    isLoadingMore,
    loadedCount,
    onLoadMoreBulletins,
    historyCount,
    displayCount}) => {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 2,
            mb: 2
        }}>
            {isLoadingMore && (
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <Typography variant="body2" sx={{ mb: 1, textAlign: 'center' }}>
                        Loading {loadedCount} / { historyCount - displayCount >= 5 ? "5" : historyCount - displayCount} more bulletins...
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={((loadedCount - displayCount) / Math.min(5, historyCount - displayCount)) * 100}
                    />
                </Box>
            )}
            <Button
                variant="outlined"
                onClick={onLoadMoreBulletins}
                disabled={isLoadingMore}
            >
                {isLoadingMore ? 'Loading...' : `Load More`}
            </Button>
        </Box>
    )
}