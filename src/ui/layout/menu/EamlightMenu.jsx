import { useCallback, useRef } from "react";
import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import TabsMenu from "./components/TabsMenu";
import TabsSubMenus from "./components/TabsSubMenus";

const EamlightMenu = () => {
    const menuDivRef = useRef(null);

    const tabsMenuClickHandler = useCallback((e) => {
        if (!menuDivRef.current) return;
        // deactivate previous menu and submenu
        menuDivRef.current
            .querySelector("#layout-tab-menu li > div.active")
            .classList.remove("active");
        menuDivRef.current
            .querySelector("#menuscrollable > .layout-tab-submenu.active")
            .classList.remove("active");
        // activate current menu and submenu
        const rel = e.currentTarget.getAttribute("rel");
        e.currentTarget.classList.add("active");
        menuDivRef.current.querySelector("#" + rel).classList.add("active");

        // At the time of writing, this is required for the tab indicator on my team WOs to work
        // Identified in issue https://github.com/mui-org/material-ui/issues/9337
        // Fixed in material-ui on Aug 26th https://github.com/mui-org/material-ui/pull/27791
        if (["myteamwos", "mywos"].includes(rel)) {
            window.dispatchEvent(new CustomEvent("resize"));
        }
    }, []);

    const tabsSubMenuClickHandler = useCallback((rel) => {
        if (!menuDivRef.current) return;

        // deactivate previous submenu
        menuDivRef.current
            .querySelector("#menuscrollable > .layout-tab-submenu.active")
            .classList.remove("active");
        // activate current submenu
        menuDivRef.current.querySelector("#" + rel).classList.add("active");
    }, []);

    return (
        <div id="menu" ref={menuDivRef}>
            <div id="menuscrollable">
                <TabsMenu onTabClick={tabsMenuClickHandler} />
                <TabsSubMenus onTabsSubMenuClick={tabsSubMenuClickHandler} />
            </div>
        </div>
    );
};

export default EamlightMenu;
