import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import '../ApplicationLayout.css'
import './EamlightMenu.css'
import EamlightMenuMyWorkorders from './EamlightMenuMyWorkorders'
import EamlightMenuMyTeamWorkorders from './EamlightMenuMyTeamWorkorders'
import EamlightMenuItem from './EamlightMenuItem'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EamlightSubmenu from "./EamlightSubmenu";
import SpeedometerIcon from 'mdi-material-ui/Speedometer'
import AutorenewIcon from 'mdi-material-ui/Autorenew'
import {PartIcon, WorkorderIcon} from 'eam-components/dist/ui/components/icons'
import {Account, AccountMultiple, Settings} from "mdi-material-ui"
import ScreenChange from "./ScreenChange";
import {AssetIcon} from 'eam-components/dist/ui/components/icons'
import {PositionIcon} from 'eam-components/dist/ui/components/icons'
import {SystemIcon} from 'eam-components/dist/ui/components/icons'

class EamlightMenu extends Component {
    constructor(props) {
        super(props);
        this.mainMenuClickHandler = this.mainMenuClickHandler.bind(this);
        this.openSubMenu = this.openSubMenu.bind(this);
    }

    mainMenuClickHandler(event) {
        // deactivate previous menu and submenu
        this.menudiv.querySelector('#layout-tab-menu li > div.active').classList.remove('active');
        this.menudiv.querySelector('#menuscrollable > .layout-tab-submenu.active').classList.remove('active');
        // activate current menu and submenu
        var rel = event.currentTarget.getAttribute('rel');
        event.currentTarget.classList.add('active');
        this.menudiv.querySelector('#' + rel).classList.add('active');
    }

    openSubMenu(rel) {
        // deactivate previous submenu
        this.menudiv.querySelector('#menuscrollable > .layout-tab-submenu.active').classList.remove('active');
        // activate current submenu
        this.menudiv.querySelector('#' + rel).classList.add('active');
    }


    creationAllowed(screen) {
        return screen && this.props.userData.screens[screen].creationAllowed
    }

    readAllowed(screen) {
        return screen && this.props.userData.screens[screen].readAllowed
    }

    //
    // HEADERS
    //
    getWorkOrdersHeader() {
        return (
            <ScreenChange
                updateScreenLayout={this.props.updateWorkOrderScreenLayout}
                screen={this.props.userData.workOrderScreen}
                screens = {Object.values(this.props.userData.screens).filter(screen => screen.parentScreen === "WSJOBS")}/>
        )
    }

    getAssetsHeader() {
        return (
            <ScreenChange
                updateScreenLayout={this.props.updateAssetScreenLayout}
                screen={this.props.userData.assetScreen}
                screens = {Object.values(this.props.userData.screens).filter(screen => screen.parentScreen === "OSOBJA")}/>
        )
    }

    getPositionsHeader() {
        return (
            <ScreenChange
                updateScreenLayout={this.props.updatePositionScreenLayout}
                screen={this.props.userData.positionScreen}
                screens = {Object.values(this.props.userData.screens).filter(screen => screen.parentScreen === "OSOBJP")}/>
        )
    }

    getSystemsHeader() {
        return (
            <ScreenChange
                updateScreenLayout={this.props.updateSystemScreenLayout}
                screen={this.props.userData.systemScreen}
                screens = {Object.values(this.props.userData.screens).filter(screen => screen.parentScreen === "OSOBJS")}/>
        )
    }

    getPartsHeader() {
        return (
            <ScreenChange
                updateScreenLayout={this.props.updatePartScreenLayout}
                screen={this.props.userData.partScreen}
                screens = {Object.values(this.props.userData.screens).filter(screen => screen.parentScreen === "SSPART")}/>
        )
    }

    //
    // RENDER
    //
    render() {
        const iconStyles = {
            width: 22,
            height: 22,
            color: "white"
        };

        const menuIconStyle = {
            display: "inline-block",
            marginRight: 5,
            color: "#f7ce03",
            width: "100%",
            height: 36
        }


        return (
            <div id="menu" ref={(menudiv) => {
                this.menudiv = menudiv;
            }}>
                <div id="menuscrollable">
                    <ul id="layout-tab-menu">
                        <li>
                            <div rel="mywos" className="active" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MY OPEN WOs" placement="right">
                                    <Account style={iconStyles} />
                                </Tooltip>
                                {!!this.props.myOpenWorkOrders.length && <div className="numberOfWorkOrders">
                                    {this.props.myOpenWorkOrders.length < 100 ? this.props.myOpenWorkOrders.length : '99+'}</div>}
                            </div>
                        </li>
                        <li>
                            <div rel="myteamwos" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MY TEAM's WOs" placement="right">
                                    <AccountMultiple style={iconStyles} />
                                </Tooltip>
                                {!!this.props.myTeamWorkOrders.length && <div className="numberOfWorkOrders">
                                    {this.props.myTeamWorkOrders.length < 100 ? this.props.myTeamWorkOrders.length : '99+'}</div>}
                            </div>
                        </li>
                        {this.props.userData.workOrderScreen &&
                        <li>
                            <div rel="workorders" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="WORK ORDERS" placement="right">
                                    <WorkorderIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }
                        {(this.props.userData.assetScreen || this.props.userData.positionScreen || this.props.userData.systemScreen) &&
                        <li>
                            <div rel="equipment" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="EQUIPMENT" placement="right">
                                    <Settings style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }
                        {this.props.userData.partScreen &&
                        <li>
                            <div rel="materials" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MATERIALS" placement="right">
                                    <PartIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }
                    </ul>


                    <EamlightMenuMyWorkorders myOpenWorkOrders={this.props.myOpenWorkOrders}/>


                    <EamlightMenuMyTeamWorkorders myTeamWorkOrders={this.props.myTeamWorkOrders} eamAccount={this.props.userData.eamAccount}/>


                    {this.props.userData.workOrderScreen &&
                    <EamlightSubmenu id="workorders" header={this.getWorkOrdersHeader()}>

                        {this.props.userData.screens[this.props.userData.workOrderScreen].creationAllowed &&
                        <EamlightMenuItem label="New Work Order"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="workorder"/>
                        }

                        {this.props.userData.screens[this.props.userData.workOrderScreen].readAllowed &&
                        <EamlightMenuItem label={"Search " + this.props.userData.screens[this.props.userData.workOrderScreen].screenDesc}
                                          icon={<SearchIcon style={menuIconStyle}/>}
                                          link="wosearch"/>
                        }

                        <EamlightMenuItem label="Meter Reading"
                                          icon={<SpeedometerIcon style={menuIconStyle}/>}
                                          link="meterreading"/>
                    </EamlightSubmenu>}


                    {(this.props.userData.assetScreen || this.props.userData.positionScreen || this.props.userData.systemScreen) &&
                    <EamlightSubmenu id="equipment" header={<a href="#">EQUIPMENT</a>}>

                        {this.props.userData.assetScreen &&
                        <EamlightMenuItem label="Assets"
                                          icon={<AssetIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'assets')}/>
                        }

                        { this.props.userData.positionScreen &&
                        <EamlightMenuItem label="Positions"
                                          icon={<PositionIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'positions')}/>
                        }

                        { this.props.userData.systemScreen &&
                        <EamlightMenuItem label="Systems"
                                          icon={<SystemIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'systems')}/>
                        }

                        {this.props.userData.assetScreen && this.props.userData.screens[this.props.userData.assetScreen].updateAllowed &&
                        <EamlightMenuItem label="Replace Equipment"
                                          icon={<AutorenewIcon style={menuIconStyle}/>}
                                          link="replaceeqp"/>}
                    </EamlightSubmenu>
                    }

                    {this.props.userData.assetScreen &&
                    <EamlightSubmenu id="assets" header={this.getAssetsHeader()}>

                        {this.creationAllowed(this.props.userData.assetScreen) &&
                        <EamlightMenuItem label="New Asset"
                                           icon={<AddIcon style={menuIconStyle}/>}
                                           link="asset"/>
                        }

                        {this.readAllowed(this.props.userData.assetScreen) &&
                        <EamlightMenuItem label={"Search " + this.props.userData.screens[this.props.userData.assetScreen].screenDesc}
                                          icon={<SearchIcon style={menuIconStyle}/>}
                                          link="assetsearch"/>
                        }


                        <EamlightMenuItem label="Back to Equipment"
                                          icon={<ArrowBackIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }

                    {this.props.userData.positionScreen &&
                    <EamlightSubmenu id="positions" header={this.getPositionsHeader()}>

                        {this.creationAllowed(this.props.userData.positionScreen)  &&
                        <EamlightMenuItem label="New Position"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="position"/>
                        }

                        {this.readAllowed(this.props.userData.positionScreen) &&
                        <EamlightMenuItem
                            label={"Search " + this.props.userData.screens[this.props.userData.positionScreen].screenDesc}
                            icon={<SearchIcon style={menuIconStyle}/>}
                            link="positionsearch"/>
                        }

                        <EamlightMenuItem label="Back to Equipment"
                                          icon={<ArrowBackIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }

                    {this.props.userData.systemScreen &&
                    <EamlightSubmenu id="systems" header={this.getSystemsHeader()}>

                        {this.creationAllowed(this.props.userData.systemScreen)  &&
                        <EamlightMenuItem label="New System"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="system"/>
                        }

                        {this.readAllowed(this.props.userData.systemScreen) &&
                        <EamlightMenuItem label={"Search " + this.props.userData.screens[this.props.userData.systemScreen].screenDesc}
                                          icon={<SearchIcon style={menuIconStyle}/>}
                                          link="systemsearch"/>
                        }

                        <EamlightMenuItem label="Back to Equipment"
                                          icon={<ArrowBackIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }


                    {this.props.userData.partScreen &&
                    <EamlightSubmenu id="materials" header={this.getPartsHeader()}>
                        {this.props.userData.screens[this.props.userData.partScreen].creationAllowed &&
                        <EamlightMenuItem label="New Part"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="part"/>
                        }

                        {this.props.userData.screens[this.props.userData.partScreen].readAllowed &&
                        <EamlightMenuItem label={"Search " + this.props.userData.screens[this.props.userData.partScreen].screenDesc}
                                          icon={<SearchIcon style={menuIconStyle}/>}
                                          link="partsearch"/>
                        }
                    </EamlightSubmenu>
                    }
                </div>
            </div>
        )
    }
}

export default EamlightMenu;