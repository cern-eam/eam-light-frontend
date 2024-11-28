import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import TabsMenu from "./components/TabsMenuSidebar";
import TabsMenuContent from "./components/TabsMenuContent";

const EamlightMenu = () => {
    return (
        <div id="menu">
            <div id="menuscrollable">
                <TabsMenu />
                <TabsMenuContent />
            </div>
        </div>
    );
};

export default EamlightMenu;
