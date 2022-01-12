import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ApplicationLayoutContainer from './ui/layout/ApplicationLayoutContainer';
import EamlightMenuContainer from './ui/layout/menu/EamlightMenuContainer';
import WorkorderContainer from './ui/pages/work/WorkorderContainer';
import WorkorderSearchContainer from './ui/pages/work/search/WorkorderSearchContainer';
import PartSearchContainer from './ui/pages/part/search/PartSearchContainer';
import AssetSearchContainer from './ui/pages/equipment/asset/search/AssetSearchContainer';
import PositionSearchContainer from './ui/pages/equipment/position/search/PositionSearchContainer';
import SystemSearchContainer from './ui/pages/equipment/system/search/SystemSearchContainer';
import LocationSearchContainer from './ui/pages/equipment/location/search/LocationSearchContainer';
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
import LoginContainer from "./ui/pages/login/LoginContainer";
import Grid from "./ui/pages/grid/Grid";
import JMTIntegrationContainer from "./ui/components/jmt/JMTIntegrationContainer";
import EqpTree from "./ui/components/eqtree/EqpTree";
import InstallEqpContainer from "./ui/pages/equipment/installeqp/InstallEqpContainer";
import Themes from 'eam-components/dist/ui/components/theme';
import config from './config';

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

        if (this.props.userData && this.props.userData.invalidAccount) {
              return <InfoPage title="Access Denied"
                               message="You don't have valid EAM account. "/>
       }

        // User data still not there, display loading page
        if (!this.props.userData || !this.props.applicationData) {
            this.props.initializeApplication();
            return (
                <BlockUi tag="div" blocking={true} style={this.blockUiStyle}>
                    <div style={this.blockUiStyleDiv}>Loading EAM Light ...</div>
                </BlockUi>
            )
        }

        const eqpRegex = ["/asset", "/position", "/system", "/location"].map(e => `${e}/:code(.+)?`)
        eqpRegex.push("/installeqp");

        const selectedTheme = Themes[config.theme[this.props.applicationData.EL_ENVIR] || config.theme.DEFAULT] || Themes.DANGER;

        // Render real application once user data is there and user has an EAM account
        return (
            <Router basename={process.env.PUBLIC_URL}>
                <ThemeProvider theme={selectedTheme}>
                    <Switch>
                    <Route path="/impact"
                           component={ImpactContainer}/>
                    <Route path="/jmt"
                           component={JMTIntegrationContainer}/>
                     <Route path="/eqptree"
                           component={EqpTree}/>
                    <ApplicationLayoutContainer>
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

                                <Route path="/locationsearch"
                                       component={LocationSearchContainer}/>

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
                    </ApplicationLayoutContainer>
                    </Switch>
                </ThemeProvider>
            </Router>
        )
    }
}

export default Eamlight
