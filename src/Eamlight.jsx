import "./Eamlight.css";
import "react-grid-layout/css/styles.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ApplicationLayoutContainer from "./ui/layout/ApplicationLayoutContainer";
import EamlightMenuContainer from "./ui/layout/menu/EamlightMenuContainer";
import WorkorderSearchContainer from "./ui/pages/work/search/WorkorderSearchContainer";
import PartSearchContainer from "./ui/pages/part/search/PartSearchContainer";
import AssetSearchContainer from "./ui/pages/equipment/asset/search/AssetSearchContainer";
import NCRSearchContainer from "./ui/pages/equipment/ncr/search/NCRSearchContainer";
import PositionSearchContainer from "./ui/pages/equipment/position/search/PositionSearchContainer";
import SystemSearchContainer from "./ui/pages/equipment/system/search/SystemSearchContainer";
import LocationSearchContainer from "./ui/pages/equipment/location/search/LocationSearchContainer";
import BlockUi from "react-block-ui";
import InfoPage from "./ui/components/infopage/InfoPage";
import Part from "./ui/pages/part/Part";
import SearchContainer from "./ui/pages/search/SearchContainer";
import ReplaceEqpContainer from "./ui/pages/equipment/replaceeqp/ReplaceEqpContainer";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import EquipmentRedirect from "./ui/pages/equipment/EquipmentRedirect";
import MeterReadingContainer from "./ui/pages/meter/MeterReadingContainer";
import LoginContainer from "./ui/pages/login/LoginContainer";
import Grid from "./ui/pages/grid/Grid";
import EqpTree from "./ui/components/eqtree/EqpTree";
import Themes from "eam-components/dist/ui/components/theme";
import config from "./config";
import Equipment from "./ui/pages/equipment/Equipment";
import Report from "./ui/pages/report/Report";
import ReleaseNotesPage from "./ui/pages/releaseNotes/ReleaseNotes";
import useLayoutStore from "./state/useLayoutStore";
import useUserDataStore from "./state/useUserDataStore";
import useApplicationDataStore from "./state/useApplicationDataStore";
import { renderLoading } from "./ui/pages/EntityTools";

export const releaseNotesPath = "/releasenotes";

const Eamlight = ({ inforContext }) => {
  const { screenLayout, fetchScreenLayout, fetchScreenLayoutFailed } = useLayoutStore();
  const { userData, fetchUserData} = useUserDataStore();
  const { applicationData, fetchApplicationData } = useApplicationDataStore();

  useEffect(() => {
    fetchUserData();
    fetchApplicationData();
  },[])

  if (!inforContext && import.meta.env.VITE_LOGIN_METHOD === "STD") {
    return (
      <ThemeProvider theme={Themes[config.theme.DEFAULT]}>
        <LoginContainer />
      </ThemeProvider>
    );
  }

  if (userData) {
    if (userData.invalidAccount) {
      return (
        <InfoPage
          title="Access Denied"
          message="You don't have valid EAM account. "
        />
      );
    }
    if (fetchScreenLayoutFailed) {
      return (
        <InfoPage
          title="Unable to initialize EAM Light"
          message="Something went wrong while loading the screen layouts, please retry or contact the support at eam.support@cern.ch."
        />
      );
    }
  }

  if (!userData || !applicationData) {
    return renderLoading("Loading EAM Light")
  }

  const eqpRegex = [
    "/asset",
    "/ncr",
    "/position",
    "/system",
    "/location",
    "/workorder",
    "/installeqp",
  ].map((e) => `${e}/:code(.+)?`);

  const selectedTheme =
    Themes[
      config.theme[applicationData.EL_ENVIR] || config.theme.DEFAULT
    ] || Themes.DANGER;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={selectedTheme}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/eqptree" component={EqpTree} />

            <ApplicationLayoutContainer>
              <EamlightMenuContainer />
              <div style={{ height: "calc(100% - 30px)" }}>
                <Route exact path="/" component={SearchContainer} />
                <Route path="/wosearch" component={WorkorderSearchContainer} />
                <Route path="/part/:code?" component={Part} />
                <Route path="/partsearch" component={PartSearchContainer} />
                <Route path="/assetsearch" component={AssetSearchContainer} />
                <Route path="/ncrsearch" component={NCRSearchContainer} />
                <Route path="/positionsearch" component={PositionSearchContainer} />
                <Route path="/systemsearch" component={SystemSearchContainer} />
                <Route path="/locationsearch" component={LocationSearchContainer} />
                <Route path="/equipment/:code(.+)?" component={EquipmentRedirect} />
                <Route path="/replaceeqp" component={ReplaceEqpContainer} />
                <Route path="/meterreading" component={MeterReadingContainer} />
                <Route path="/grid" component={Grid} />
                <Route path="/report" component={Report} />
                <Route path={eqpRegex} component={Equipment} />
                <Route path={releaseNotesPath} component={ReleaseNotesPage} />
              </div>
            </ApplicationLayoutContainer>
          </Switch>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Eamlight;
