import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Error} from "@mui/icons-material";

export const BulletinLoadingError = ({error}) => {
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