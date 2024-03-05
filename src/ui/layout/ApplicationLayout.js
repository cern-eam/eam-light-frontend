import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setLayoutProperty} from '../../actions/uiActions'
import {Link} from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import Menu from 'mdi-material-ui/Menu'
import './ApplicationLayout.css'
import UserInfoContainer from './UserInfoContainer'
import {FileTree, FormatHorizontalAlignLeft, FormatHorizontalAlignRight} from 'mdi-material-ui';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import clsx from 'clsx';
import ScanUser from '../../ui/components/servicelogin/ScanUser';
import Footer from './Footer';
import GridTools from 'tools/GridTools';

const styles = {
    topBarLink: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: '900',
        fontSize:'18px'
    },
    topBarSpan: {
        fontSize: '12px',
    }
};

export default withStyles(styles)(function ApplicationLayout(props) {
    const { classes, applicationData, userData, scannedUser, updateScannedUser, handleError, showNotification } = props;

    const environment = applicationData.EL_ENVIR;

    const [menuCompacted, setMenuCompacted] = useState(false)
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const theme = useTheme();
    const dispatch = useDispatch();
    const showEqpTree = useSelector(state => state.ui.layout.showEqpTree)
    const equipment = useSelector(state => state.ui.layout.equipment)
    const location = useLocation()

    const menuIconStyle = {
        color: "white",
        fontSize: 18
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.get('maximize') && setMenuCompacted(true);
    }, [])

    const topbar = (
        <div id="topbar" style={{backgroundColor: theme.palette.primary.main}}>
            <div id="topbar-left">
                <Link to="/" className={clsx(classes.topBarLink)}>EAM Light</Link>
                {environment !== 'PROD' && <span className={clsx(classes.topBarSpan)}>{environment}</span>}
            </div>

            <div id="topbar-right">
                <div id="menu-resize-btn">
                    <IconButton onClick={() => setMenuCompacted(!menuCompacted)} size="large">
                        {(menuCompacted) ? (
                            <FormatHorizontalAlignRight style={menuIconStyle}/>
                        ) : (
                            <FormatHorizontalAlignLeft style={menuIconStyle}/>
                        )}
                    </IconButton>
                </div>
                <div id="mobile-menu-btn">
                    <IconButton onClick={() => setMobileMenuActive(!mobileMenuActive)} size="large">
                        <Menu style={menuIconStyle}/>
                    </IconButton>
                </div>

                {equipment &&
                <div id="eqp-tree-btn">
                    <div style={{borderLeft: "1px solid rgba(255, 255, 255, 0.8)", height: 22}}/>
                    <IconButton
                        onClick={() => dispatch(setLayoutProperty('showEqpTree', !showEqpTree))}
                        size="large">
                        <FileTree style={menuIconStyle}/>
                    </IconButton>
                </div>}

                <UserInfoContainer/>
            </div>
        </div>
    );

    const isInsideIframe = window.self !== window.top;
    const isInsideAllowedURL = document.referrer.match(applicationData.EL_IFURL);
    const showTopBar = !(isInsideAllowedURL && isInsideIframe);

    const loadAfterLogin = GridTools.getURLParameterByName("loadAfterLogin") === 'true';

    const showScan = applicationData.serviceAccounts && applicationData.serviceAccounts.includes( userData.eamAccount.userCode) && (!scannedUser || !scannedUser.userCode)
        && <ScanUser
                updateScannedUser={updateScannedUser}
                showNotification={showNotification}
                handleError={handleError}
            />;

    return (
        <div id="maindiv" className={(menuCompacted) ? 'SlimMenu' : ''} onClick={() => !menuCompacted && mobileMenuActive && setMobileMenuActive(false)}>
            {showTopBar && topbar}
            {showScan && loadAfterLogin ? null
                : <div id="layout-container" >
                    {props.children[0] && <div id="layout-menu-cover" className={(mobileMenuActive) ? 'active' : ''} onClick={(event) => event.stopPropagation()}>
                        {props.children[0]}
                    </div>}
                    <div id="layout-portlets-cover">
                        {props.children[1]}
                        <Footer applicationData={applicationData}/>
                    </div>
                </div>
            }
            {showScan}
        </div>

    )
})