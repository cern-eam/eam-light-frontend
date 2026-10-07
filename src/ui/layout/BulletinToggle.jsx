import {Bell } from "mdi-material-ui";
import {Badge, Drawer, IconButton, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {MyBulletins} from "@/ui/pages/bulletins/BulletinWindow/MyBulletins.jsx";
import WSBulletins from "@/tools/WSBulletins.js";

import { keyframes } from "@mui/system";

const smoothScalePulse = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.13);
    }
    100% {
        transform: scale(1);
    }
`;

export const BulletinToggle = () => {

    const bellIcon = {
        fontSize: 20,
        margin: 5,
        cursor: "pointer",
        color: 'rgba(255, 255, 255, 0.8)'
    };

    const [hasUnreadBulletins, setHasUnreadBulletins] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadBulletins, setUnreadBulletins] = useState([]);
    const [hasUnreadCriticalBulletins, setHasUnreadCriticalBulletins] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }

    const openDrawer = () => {
        setIsDrawerOpen(true);
    }

    const checkForCriticalBulletins = (bulletins) => {
        if (bulletins.some(bulletin => bulletin.CRITICAL === "true")) {
            setHasUnreadCriticalBulletins(true);
        }
    }

    const fetchBulletins = async () => {
        try {
            setIsLoading(true);
            const response = await WSBulletins.getUserBulletins();
            const bulletins = response.body.Result.ResultData.UserBulletins.Bulletin || [];
            if (bulletins.length > 0) {
                setHasUnreadBulletins(true);
                setUnreadBulletins(bulletins);
                checkForCriticalBulletins(bulletins);
            }
        } catch (err) {
            setError(err);
            console.error('Failed to fetch notifications: ', err)
        } finally {
            setIsLoading(false);
        }
    }

    const handleBulletinAcknowledged = (bulletinCode) => {
        setUnreadBulletins(prev => prev.filter(b => b.BULLETINCODE !== bulletinCode));

        const remainingBulletins = unreadBulletins.filter(b => b.BULLETINCODE !== bulletinCode);
        setHasUnreadBulletins(remainingBulletins.length > 0);

        const hasCritical = remainingBulletins.some(bulletin => bulletin.CRITICAL === "true");
        setHasUnreadCriticalBulletins(hasCritical);
    }


    useEffect(() => {
        fetchBulletins();
    }, []);

    useEffect(() => {
        if (isDrawerOpen) {
            setTooltipOpen(false)
        } else if (hasUnreadCriticalBulletins) {
            setTooltipOpen(true)
        }
    }, [hasUnreadCriticalBulletins, isDrawerOpen]);

    const tooltipMessage = hasUnreadCriticalBulletins
        ? "You have critical unread notifications!"
        : "You have unread notifications!";

    return (
        <>
            { !isDrawerOpen && (
                <Tooltip
                    title={hasUnreadBulletins ? tooltipMessage : "Show notifications"}
                    arrow
                    open={tooltipOpen}
                    onOpen={() => {
                        if (!hasUnreadCriticalBulletins && !isDrawerOpen) {
                            setTooltipOpen(true);
                        }
                    }}
                    onClose={() => {
                        if (!hasUnreadCriticalBulletins) {
                            setTooltipOpen(false);
                        }
                    }}
                    PopperProps={{
                        sx: hasUnreadBulletins ? {
                            '& .MuiTooltip-tooltip': {
                                backgroundColor: hasUnreadCriticalBulletins ? 'error.main' : 'text.secondary',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            },
                            '& .MuiTooltip-arrow': {
                                color: hasUnreadCriticalBulletins ? 'error.main' : 'text.secondary',
                            }
                        } : {}
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={isDrawerOpen ? closeDrawer : openDrawer}
                    >
                        {hasUnreadBulletins ? (
                            <Badge
                                badgeContent={unreadBulletins.length}
                                color="error"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        minWidth: 8,
                                        height: 8,
                                        padding: 1,
                                        position: "relative",
                                        top: 8,
                                        right: 24,
                                    },
                                    ...(hasUnreadCriticalBulletins &&
                                        !isDrawerOpen && {
                                            animation: `${smoothScalePulse} 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                                        }),
                                }}
                            >
                                <Bell style={bellIcon} />
                            </Badge>
                        ) : (
                            <Bell style={bellIcon} />
                        )}
                    </IconButton>
                </Tooltip>
            )}

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={closeDrawer}
                SlideProps={{
                    style: {
                        zIndex: 1260
                    }
                }}
                PaperProps={{
                    sx: {
                        width: 800,
                    },
                }}
                ModalProps={{
                    keepMounted: false,
                    sx: {
                        "& .MuiBackdrop-root": {
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                        }
                    }
                }}
            >
                <MyBulletins
                    closeDrawer={closeDrawer}
                    bulletins={unreadBulletins}
                    loading={loading}
                    error={error}
                    onAcknowledge={handleBulletinAcknowledged}
                    activeTabOnOpen={ hasUnreadBulletins ? 0 : 1}
                />
            </Drawer>
        </>
    )
}