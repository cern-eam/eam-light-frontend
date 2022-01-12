import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import '../ApplicationLayout.css'
import './EamlightMenu.css'
import MenuMyWorkorders from './MenuMyWorkorders'
import MenuMyTeamWorkorders from './MenuMyTeamWorkorders'
import MenuItem from './MenuItem'
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FormatListBulletedTriangle from 'mdi-material-ui/FormatListBulletedTriangle'
import EamlightSubmenu from "./EamlightSubmenu";
import SpeedometerIcon from 'mdi-material-ui/Speedometer'
import AutorenewIcon from 'mdi-material-ui/Autorenew'
import {AssetIcon, PartIcon, PositionIcon, SystemIcon, WorkorderIcon} from 'eam-components/dist/ui/components/icons'
import {Account, AccountMultiple, Settings, Tune, DatabaseRefresh} from "mdi-material-ui"
import ScreenChange from "./ScreenChange";
import MenuTools from './MenuTools'
import RoomIcon from '@material-ui/icons/Room';
import BuildIcon from '@material-ui/icons/Build';
import CERNMode from '../../components/CERNMode';
import MenuGridLink from "./MenuGridLink";

const getScreenHeaderFunction = (screens = {}) => ({ screenName, screen, updateScreenLayout }) =>
    <ScreenChange
        updateScreenLayout={updateScreenLayout}
        screen={screen}
        screens = {Object.values(screens).filter(screen => screen.parentScreen === screenName)}
    />

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
        const rel = event.currentTarget.getAttribute('rel');
        event.currentTarget.classList.add('active');
        this.menudiv.querySelector('#' + rel).classList.add('active');
        
        // At the time of writing, this is required for the tab indicator on my team WOs to work
        // Identified in issue https://github.com/mui-org/material-ui/issues/9337
        // Fixed in material-ui on Aug 26th https://github.com/mui-org/material-ui/pull/27791
        if (['myteamwos', 'mywos'].includes(rel)) {
            window.dispatchEvent(new CustomEvent("resize"));
        }
    }

    openSubMenu(rel) {
        // deactivate previous submenu
        this.menudiv.querySelector('#menuscrollable > .layout-tab-submenu.active').classList.remove('active');
        // activate current submenu
        this.menudiv.querySelector('#' + rel).classList.add('active');
    }


    creationAllowed = (screens, screen) => screen && screens[screen] && screens[screen].creationAllowed

    readAllowed = (screens, screen) => screen && screens[screen] && screens[screen].readAllowed

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

  
        const { myOpenWorkOrders, myTeamWorkOrders, userData, applicationData, showNotification, showError, updateWorkOrderScreenLayout, 
            updateAssetScreenLayout, updatePositionScreenLayout, updateSystemScreenLayout, updatePartScreenLayout, updateLocationScreenLayout } = this.props;
        const { workOrderScreen, assetScreen, positionScreen, systemScreen, partScreen, locationScreen, eamAccount, screens, reports } = userData;
        
        const currentPartScreen = screens[partScreen] || {};
        const currentWorkOrderScreen = screens[workOrderScreen] || {};

        const screenProps = {
            workOrder: {
                screenName: 'WSJOBS',
                updateScreenLayout: updateWorkOrderScreenLayout,
                screen: workOrderScreen
            },
            asset: {
                screenName: 'OSOBJA',
                updateScreenLayout: updateAssetScreenLayout,
                screen: assetScreen
            },
            position: {
                screenName: 'OSOBJP',
                updateScreenLayout: updatePositionScreenLayout,
                screen: positionScreen
            },
            system: {
                screenName: 'OSOBJS',
                updateScreenLayout: updateSystemScreenLayout,
                screen: systemScreen
            },
            location: {
                screenName: 'OSOBJL',
                updateScreenLayout: updateLocationScreenLayout,
                screen: locationScreen
            },
            part: {
                screenName: 'SSPART',
                updateScreenLayout: updatePartScreenLayout,
                screen: partScreen
            },
        }

        const getScreenHeader = getScreenHeaderFunction(screens);

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
                                {!!myOpenWorkOrders.length && <div className="numberOfWorkOrders">
                                    {myOpenWorkOrders.length < 100 ? myOpenWorkOrders.length : '99+'}</div>}
                            </div>
                        </li>

                        <li>
                            <div rel="myteamwos" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MY TEAM's WOs" placement="right">
                                    <AccountMultiple style={iconStyles} />
                                </Tooltip>
                                {!!myTeamWorkOrders.length && <div className="numberOfWorkOrders">
                                    {myTeamWorkOrders.length < 100 ? myTeamWorkOrders.length : '99+'}</div>}
                            </div>
                        </li>

                        {workOrderScreen &&
                        <li>
                            <div rel="workorders" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="WORK ORDERS" placement="right">
                                    <WorkorderIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }

                        {(assetScreen || positionScreen || systemScreen || locationScreen) &&
                        <li>
                            <div rel="equipment" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="EQUIPMENT" placement="right">
                                    <Settings style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }

                        {partScreen &&
                        <li>
                            <div rel="materials" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MATERIALS" placement="right">
                                    <PartIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }

                        {applicationData.EL_ADMUG && applicationData.EL_ADMUG.split(',').includes(eamAccount.userGroup) &&
                        <li>
                            <div rel="settings" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="ADMIN SETTINGS" placement="right">
                                    <Tune style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }

                        {reports &&
                        <li>
                            <div rel="customgrids" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="CUSTOM GRIDS" placement="right">
                                    <FormatListBulletedTriangle style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }
                    </ul>

                    <MenuMyWorkorders myOpenWorkOrders={myOpenWorkOrders}/>

                    <MenuMyTeamWorkorders myTeamWorkOrders={myTeamWorkOrders} eamAccount={eamAccount}/>

                    {workOrderScreen &&
                    <EamlightSubmenu id="workorders" header={getScreenHeader(screenProps.workOrder)}>

                        {currentWorkOrderScreen.creationAllowed &&
                        <MenuItem label="New Work Order"
                                  icon={<AddIcon style={menuIconStyle}/>}
                                  link="workorder"/>
                        }

                        {currentWorkOrderScreen.readAllowed &&
                        <MenuItem label={"Search " + currentWorkOrderScreen.screenDesc}
                                  icon={<SearchIcon style={menuIconStyle}/>}
                                  link="wosearch"/>
                        }
                    </EamlightSubmenu>}


                    {(assetScreen || positionScreen || systemScreen) &&
                    <EamlightSubmenu id="equipment" header={<span>EQUIPMENT</span>}>

                        {assetScreen &&
                        <MenuItem label="Assets"
                                  icon={<AssetIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'assets')}/>
                        }

                        { positionScreen &&
                        <MenuItem label="Positions"
                                  icon={<PositionIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'positions')}/>
                        }

                        { systemScreen &&
                        <MenuItem label="Systems"
                                  icon={<SystemIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'systems')}/>
                        }

                        { locationScreen &&
                        <MenuItem label="Locations"
                                  icon={<RoomIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'locations')}/>
                        }

                        <CERNMode>
                            {assetScreen && screens[assetScreen].updateAllowed &&
                            <MenuItem label="Replace Equipment"
                                        icon={<AutorenewIcon style={menuIconStyle}/>}
                                        link="replaceeqp"/>}
                        </CERNMode>

                        <MenuItem label="Meter Reading"
                                  icon={<SpeedometerIcon style={menuIconStyle}/>}
                                  link="meterreading"/>  
                        
                        <MenuItem label="Install Equipment"
                                  icon={<BuildIcon style={menuIconStyle}/>}
                                  link="installeqp"/>         
                    </EamlightSubmenu>
                    }

                    {assetScreen &&
                    <EamlightSubmenu id="assets" header={getScreenHeader(screenProps.asset)}>

                        {this.creationAllowed(screens, assetScreen) &&
                        <MenuItem label="New Asset"
                                  icon={<AddIcon style={menuIconStyle}/>}
                                  link="asset"/>
                        }

                        {this.readAllowed(screens, assetScreen) &&
                        <MenuItem label={"Search " + screens[assetScreen].screenDesc}
                                  icon={<SearchIcon style={menuIconStyle}/>}
                                  link="assetsearch"/>
                        }


                        <MenuItem label="Back to Equipment"
                                  icon={<ArrowBackIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }

                    {positionScreen &&
                    <EamlightSubmenu id="positions" header={getScreenHeader(screenProps.position)}>

                        {this.creationAllowed(screens, positionScreen)  &&
                        <MenuItem label="New Position"
                                  icon={<AddIcon style={menuIconStyle}/>}
                                  link="position"/>
                        }

                        {this.readAllowed(screens, positionScreen) &&
                        <MenuItem
                            label={"Search " + screens[positionScreen].screenDesc}
                            icon={<SearchIcon style={menuIconStyle}/>}
                            link="positionsearch"/>
                        }

                        <MenuItem label="Back to Equipment"
                                  icon={<ArrowBackIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }

                    {systemScreen &&
                    <EamlightSubmenu id="systems" header={getScreenHeader(screenProps.system)}>

                        {this.creationAllowed(screens, systemScreen)  &&
                        <MenuItem label="New System"
                                  icon={<AddIcon style={menuIconStyle}/>}
                                  link="system"/>
                        }

                        {this.readAllowed(screens, systemScreen) &&
                        <MenuItem label={"Search " + screens[systemScreen].screenDesc}
                                  icon={<SearchIcon style={menuIconStyle}/>}
                                  link="systemsearch"/>
                        }

                        <MenuItem label="Back to Equipment"
                                  icon={<ArrowBackIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }

                    {locationScreen &&
                    <EamlightSubmenu id="locations" header={getScreenHeader(screenProps.location)}>

                        {this.readAllowed(screens, locationScreen) &&
                        <MenuItem label={"Search " + screens[locationScreen].screenDesc}
                                  icon={<SearchIcon style={menuIconStyle}/>}
                                  link="locationsearch"/>
                        }

                        <MenuItem label="Back to Equipment"
                                  icon={<ArrowBackIcon style={menuIconStyle}/>}
                                  onClick={this.openSubMenu.bind(this, 'equipment')}/>
                    </EamlightSubmenu>
                    }


                    {partScreen &&
                    <EamlightSubmenu id="materials" header={getScreenHeader(screenProps.part)}>
                        {currentPartScreen.creationAllowed &&
                        <MenuItem label="New Part"
                                  icon={<AddIcon style={menuIconStyle}/>}
                                  link="part"/>
                        }

                        {currentPartScreen.readAllowed &&
                        <MenuItem label={"Search " + currentPartScreen.screenDesc}
                                  icon={<SearchIcon style={menuIconStyle}/>}
                                  link="partsearch"/>
                        }
                    </EamlightSubmenu>
                    }

                    {applicationData.EL_ADMUG && applicationData.EL_ADMUG.split(',').includes(eamAccount.userGroup) &&
                    <EamlightSubmenu id="settings" header={<span>ADMIN SETTINGS</span>}>
                        <MenuItem label="Refresh EAM Light Cache"
                                  icon={<DatabaseRefresh style={menuIconStyle}/>}
                                  onClick={MenuTools.refreshCache.bind(null, showNotification, showError)}/>
                    </EamlightSubmenu>
                    }

                    {reports &&
                    <EamlightSubmenu id="customgrids" header={<span>CUSTOM GRIDS</span>}>
                        {reports.map( report => (
                            <MenuGridLink grid={report}/>
                            ))
                        }
                    </EamlightSubmenu>
                    }
                </div>
            </div>
        )
    }
}

export default EamlightMenu;