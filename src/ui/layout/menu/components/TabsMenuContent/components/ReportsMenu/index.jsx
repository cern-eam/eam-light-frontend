import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "../common/SubMenu";
import EISPanel from "@/ui/components/panel/Panel";
import MenuLinks from "./components/MenuLinks";

const EAM_REPORTS_MENU = "Lists & Reports";

const ReportsMenu = () => {
    const {
        userData: { reports },
    } = useUserDataStore();

    if (!reports) return null;

    return (
        <SubMenu id="customgrids" header={<span>LISTS & REPORTS</span>}>
            {/* Render list in main menu */}
            <div>
                <MenuLinks menusMetaData={reports[EAM_REPORTS_MENU]} />
            </div>

            {/* Render sub-menus */}
            {Object.entries(reports).map(([menuName, menusMetaData]) => {
                if (menuName !== EAM_REPORTS_MENU) {
                    return (
                        <EISPanel
                            heading={menuName}
                            key={menuName}
                            detailsStyle={{
                                backgroundColor: "#242021",
                            }}
                            summaryStyle={{
                                backgroundColor: "#242021",
                                color: "white",
                            }}
                        >
                            <MenuLinks menusMetaData={menusMetaData} />
                        </EISPanel>
                    );
                }
            })}
        </SubMenu>
    );
};

export default ReportsMenu;
