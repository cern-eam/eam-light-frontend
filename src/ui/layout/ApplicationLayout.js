import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setLayoutProperty} from '../../actions/uiActions'
import {Link} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import Menu from 'mdi-material-ui/Menu'
import './ApplicationLayout.css'
import UserInfoContainer from './UserInfoContainer'
import {FileTree, FormatHorizontalAlignLeft, FormatHorizontalAlignRight} from 'mdi-material-ui';

export default function ApplicationLayout(props) {
    const [menuCompacted, setMenuCompacted] = useState(true)
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const dispatch = useDispatch();
    const showEqpTree = useSelector(state => state.ui.layout.showEqpTree)
    const showEqpTreeButton = useSelector(state => state.ui.layout.showEqpTreeButton)

    const headerLinkStyle = {
        color: "white",
        textDecoration: "none",
        fontWeight: 900,
        marginLeft: 15
    }

    const menuIconStyle = {
        display: "inline-block",
        color: "white",
        fontSize: 18
    }

    return (
        <div id="maindiv" className={(menuCompacted) ? '' : 'SlimMenu'} onClick={() => menuCompacted && mobileMenuActive && setMobileMenuActive(false)}>
            <div id="layout-topbar-cover">
                <div id="layout-topbar-row">
                    <div id="layout-topbar-left">
                        <Link style={headerLinkStyle} to="/">EAM Light</Link>
                    </div>
                    <div id="layout-topbar-right">
                        <div id="menu-resize-btn">
                            <IconButton onClick={() => setMenuCompacted(!menuCompacted)}>
                                {(menuCompacted) ? (
                                    <FormatHorizontalAlignLeft style={menuIconStyle}/>
                                ) : (
                                    <FormatHorizontalAlignRight style={menuIconStyle}/>
                                )}
                            </IconButton>
                        </div>
                        <div id="mobile-menu-btn">
                            <IconButton onClick={() => setMobileMenuActive(!mobileMenuActive)}>
                                <Menu style={menuIconStyle}/>
                            </IconButton>
                        </div>

                        {showEqpTreeButton &&
                        <div id="eqp-tree-btn">
                            <div style={{borderLeft: "1px solid rgba(255, 255, 255, 0.8)", height: 22}}/>
                            <IconButton onClick={() => dispatch(setLayoutProperty('showEqpTree', !showEqpTree))}>
                                <FileTree style={menuIconStyle}/>
                            </IconButton>
                        </div>}
                    </div>

                    <UserInfoContainer/>

                </div>
            </div>

            <div id="layout-container">
                <div id="layout-container-row">
                    <div id="layout-menu-cover" className={(mobileMenuActive) ? 'active' : ''}
                         onClick={(event) => event.stopPropagation()}>
                        {props.children[0]}
                    </div>

                    <div id="layout-portlets-cover">
                        {props.children[1]}
                    </div>
                </div>
            </div>
        </div>

    )
}