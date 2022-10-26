import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

const LightDialog = styled(Dialog)(({theme}) => ({
    '& .MuiPaper-root': {
        backgroundColor: "#fafafa"
    }
}))

export default LightDialog;