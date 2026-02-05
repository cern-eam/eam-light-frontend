import "./Eamlight.css";
import "react-grid-layout/css/styles.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ApplicationLayout from "./ui/layout/ApplicationLayout";
import EamlightMenu from "./ui/layout/menu/EamlightMenu";
import WorkorderSearch from "./ui/pages/work/search/WorkorderSearch";
import PartSearch from "./ui/pages/part/search/PartSearch";
import LotSearch from "./ui/pages/part/lot/search/LotSearch";
import AssetSearch from "./ui/pages/equipment/asset/search/AssetSearch";
import NCRSearch from "./ui/pages/equipment/ncr/search/NCRSearch";
import PositionSearch from "./ui/pages/equipment/position/search/PositionSearch";
import SystemSearch from "./ui/pages/equipment/system/search/SystemSearch";
import LocationSearch from "./ui/pages/equipment/location/search/LocationSearch";
import InfoPage from "./ui/components/infopage/InfoPage";
import Part from "./ui/pages/part/Part";
import Search from "./ui/pages/search/Search";
import ReplaceEqp from "./ui/pages/equipment/replaceeqp/ReplaceEqp";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import EquipmentRedirect from "./ui/pages/equipment/EquipmentRedirect";
import MeterReading from "./ui/pages/meter/MeterReading";
import Login from "./ui/pages/login/Login";
import Grid from "./ui/pages/grid/Grid";
import EqpTree from "./ui/components/eqtree/EqpTree";
import Themes from "eam-components/dist/ui/components/theme";
import config from "./config";
import Equipment from "./ui/pages/equipment/Equipment";
import Report from "./ui/pages/report/Report";
import ReleaseNotesPage from "./ui/pages/releaseNotes/ReleaseNotes";
import useUserDataStore from "./state/useUserDataStore";
import useApplicationDataStore from "./state/useApplicationDataStore";
import { renderLoading } from "./ui/pages/EntityTools";
import useInforContextStore from "./state/useInforContext";
import useLayoutStore from "./state/useLayoutStore";
import { isCernMode } from "./ui/components/CERNMode";

export const releaseNotesPath = "/releasenotes";

const Eamlight = () => {
  const { inforContext } = useInforContextStore();
  const { userData, fetchUserData, userDataFetchError} = useUserDataStore();
  const { applicationData, fetchApplicationData, applicationDataFetchError } = useApplicationDataStore(); 
  const { screenLayoutFetchError } = useLayoutStore();
  const loginMethod = import.meta.env.VITE_LOGIN_METHOD;

  useEffect(() => {
    if (loginMethod !== "STD" || (loginMethod === "STD" && inforContext))
      fetchUserData();
      fetchApplicationData();
  },[inforContext])
  
  if (!inforContext && loginMethod === "STD") {
    return (
      <ThemeProvider theme={Themes[config.theme.DEFAULT]}>
        <Login />
      </ThemeProvider>
    );
  }

  if (userDataFetchError || applicationDataFetchError || screenLayoutFetchError) {
    return (
      <InfoPage
        title="Error initializing EAM Light"
        message="The application could not be initialized. Please contact EAM support if the problem persists."
        includeAutoRefresh={true}
        includeSupportButton={isCernMode}
        includeLogoutButton={!isCernMode}
      />
    );
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
    "/lot",
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

            <ApplicationLayout>
              <EamlightMenu />
              <div style={{ height: "calc(100% - 30px)" }}>
                <Route exact path="/" component={Search} />
                <Route path="/wosearch" component={WorkorderSearch} />
                <Route path="/part/:code?" component={Part} />
                <Route path="/partsearch" component={PartSearch} />
                <Route path="/assetsearch" component={AssetSearch} />
                <Route path="/ncrsearch" component={NCRSearch} />
                <Route path="/positionsearch" component={PositionSearch} />
                <Route path="/systemsearch" component={SystemSearch} />
                <Route path="/locationsearch" component={LocationSearch} />
                <Route path="/lotsearch" component={LotSearch} />
                <Route path="/equipment/:code(.+)?" component={EquipmentRedirect} />
                <Route path="/replaceeqp" component={ReplaceEqp} />
                <Route path="/meterreading" component={MeterReading} />
                <Route path="/grid" component={Grid} />
                <Route path="/report" component={Report} />
                <Route path={eqpRegex} component={Equipment} />
                <Route path={releaseNotesPath} component={ReleaseNotesPage} />
              </div>
            </ApplicationLayout>
          </Switch>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Eamlight;
