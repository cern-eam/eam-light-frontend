import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import TabsMenuSidebar from "./components/TabsMenuSidebar";
import TabsMenuContent from "./components/TabsMenuContent";

const EamlightMenu = () => {
    return (
        <div id="menu">
            <div id="menuscrollable">
                <TabsMenuSidebar />
                <TabsMenuContent />
            </div>
        </div>
    );
};

export default EamlightMenu;
