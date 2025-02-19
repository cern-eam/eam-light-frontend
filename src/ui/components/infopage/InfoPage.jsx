import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import useInforContextStore from '../../../state/useInforContext';

const InfoPage = ({
    title,
    message,
    includeAutoRefresh = false,
    includeSupportButton = false,
    includeLogoutButton = false,
}) => {
    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        if (includeAutoRefresh) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        window.location.reload();
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [includeAutoRefresh]);

    const handleEmail = () => {
        window.location.href = 'mailto:EAM.Support@cern.ch';
    };

    const handleLogout = () => {
        useInforContextStore.getState().setInforContext(null);
    };

    const blueColor = '#1976d2'; // Material-UI primary blue

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f4f8',
                padding: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    padding: 4,
                    maxWidth: 500,
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginBottom: 2,
                    }}
                >
                    <InfoOutlinedIcon
                        sx={{
                            fontSize: 40,
                            color: blueColor,
                            marginRight: 1,
                        }}
                    />
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                    sx={{ color: 'gray', marginBottom: 3 }}
                >
                    {message}
                    {includeAutoRefresh && ` Refreshing in ${countdown} seconds...`}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    {includeSupportButton && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<EmailIcon />}
                            onClick={handleEmail}
                        >
                            Contact Support
                        </Button>
                    )}
                    {includeLogoutButton && (
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default InfoPage;
