import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ApplicationLayout from './ui/layout/ApplicationLayout';
import EamlightMenuContainer from './ui/layout/menu/EamlightMenuContainer';
import WorkorderContainer from './ui/pages/work/WorkorderContainer';
import WorkorderSearchContainer from './ui/pages/work/search/WorkorderSearchContainer';
import PartSearchContainer from './ui/pages/part/search/PartSearchContainer';
import AssetSearchContainer from './ui/pages/equipment/asset/search/AssetSearchContainer';
import PositionSearchContainer from './ui/pages/equipment/position/search/PositionSearchContainer';
import SystemSearchContainer from './ui/pages/equipment/system/search/SystemSearchContainer';
import BlockUi from 'react-block-ui';
import InfoPage from './ui/components/infopage/InfoPage';
import ImpactContainer from './ui/components/impact/ImpactContainer';
import './Eamlight.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PartContainer from "./ui/pages/part/PartContainer";
import SearchContainer from "./ui/pages/search/SearchContainer";
import ReplaceEqpContainer from "./ui/pages/equipment/replaceeqp/ReplaceEqpContainer";
import {ThemeProvider} from '@material-ui/core/styles';
import EquipmentRedirect from "./ui/pages/equipment/EquipmentRedirect";
import MeterReadingContainer from './ui/pages/meter/MeterReadingContainer';
import EquipmentContainer from "./ui/pages/equipment/EquipmentContainer";
import {theme} from 'eam-components/dist/ui/components/theme';
import LoginContainer from "./ui/pages/login/LoginContainer";
import Grid from "./ui/pages/grid/Grid";

class Eamlight extends Component {

    blockUiStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    blockUiStyleDiv = {
        display: "flex",
        height: 60, alignItems: "flex-end"
    };

    render() {
        // Display login screen
        if (!this.props.inforContext && process.env.REACT_APP_LOGIN_METHOD === 'STD') {
            return (
                <LoginContainer/>
            )
        }

        // User data still not there, display loading page
        if (!this.props.userData) {
            this.props.initializeApplication();
            return (
                <BlockUi tag="div" blocking={true} style={this.blockUiStyle}>
                    <div style={this.blockUiStyleDiv}>Loading EAM Light ...</div>
                </BlockUi>
            )
        } else {
            console.log('userdata', this.props.userData)
        }

        // User has no valid EAM account
        if (this.props.userData.invalidAccount) {
            return <InfoPage title="Access Denied"
                             message="You don't have valid EAM account. "/>
        }

        var eqpRegex = ["/asset/:code(.+)?", "/position/:code(.+)?", "/system/:code(.+)?"]

        // Render real application once user data is there and user has an EAM account
        return (
            <Router basename={process.env.PUBLIC_URL}>
                <ThemeProvider theme={theme}>
                    <Switch>
                    <Route path="/impact"
                           component={ImpactContainer}/>
                    <ApplicationLayout>
                        <EamlightMenuContainer/>
                        <div style={{height: "100%"}}>

                                <Route exact path="/"
                                       component={SearchContainer}/>

                                <Route path="/workorder/:code?"
                                       component={WorkorderContainer}/>

                                <Route path="/wosearch"
                                       component={WorkorderSearchContainer}/>

                                <Route path="/part/:code?"
                                       component={PartContainer}/>

                                       <Route path="/partsearch"
                                       component={PartSearchContainer}/>

                                <Route path="/assetsearch"
                                       component={AssetSearchContainer}/>

                                <Route path="/positionsearch"
                                       component={PositionSearchContainer}/>

                                <Route path="/systemsearch"
                                       component={SystemSearchContainer}/>

                                <Route path="/equipment/:code?"
                                       component={EquipmentRedirect}/>

                                <Route path="/replaceeqp"
                                       component={ReplaceEqpContainer}/>

                                <Route path="/meterreading"
                                       component={MeterReadingContainer}/>

                                <Route path="/grid"
                                       component={Grid}/>

                                <Route path={eqpRegex}
                                       component={EquipmentContainer}/>
                        </div>
                    </ApplicationLayout>∂
                    </Switch>
                </ThemeProvider>
            </Router>
        )
    }
}

export default Eamlight
