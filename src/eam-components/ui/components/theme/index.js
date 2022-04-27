import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { blue, green, red, lightBlue, lightGreen, deepOrange } from '@mui/material/colors';

const muiSettings = ({ primaryColor, secondaryColor }) => ({
    palette: {
        primary: { main: primaryColor }, // EAMLight blue '#2196F3'
        secondary: { main: secondaryColor } // Darker blue '#01579b'
    },
    typography: {
        body1: {
            fontSize: '14px'
        }
    },
    overrides: {
        MuiButton: {
            root: {
                color: "#585858"
            }
        }
    }
});

export const theme = createTheme(adaptV4Theme({ primaryColor: blue[500], secondaryColor: lightBlue[900] }));

const BLUE = createTheme(adaptV4Theme(muiSettings({ primaryColor: blue[500], secondaryColor: lightBlue[900] })));
const GREEN = createTheme(adaptV4Theme(muiSettings({ primaryColor: green[600], secondaryColor: lightGreen[900] })));
const RED = createTheme(adaptV4Theme(muiSettings({ primaryColor: red[500], secondaryColor: deepOrange[900] })));
const DANGER = createTheme(adaptV4Theme(muiSettings({ primaryColor: red[900], secondaryColor: red[500] })));

export default {
    BLUE,
    GREEN,
    RED,
    DANGER
}