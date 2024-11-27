import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import TabsMenu from "./components/TabsMenu";
import TabsSubMenus from "./components/TabsSubMenus";

const EamlightMenu = () => {
    return (
        <div id="menu">
            <div id="menuscrollable">
                <TabsMenu />
                <TabsSubMenus />
            </div>
        </div>
    );
};

export default EamlightMenu;
