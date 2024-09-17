import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import Panel from "@/ui/components/panel/Panel";

const RegionPanel = (props) => {
  const {
    children,
    isMaximized,
    unMaximize,
    maximize,
    showMaximizeControls,
    style,
    initiallyExpanded,
    customHeadingBar,
    headingBarStyle,
  } = props;

  const [panelExpanded, setPanelExpanded] = useState(initiallyExpanded);

  const divStyle = {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
  };

  return (
    <Panel
      ExpansionPanelProps={{ style }}
      headingBar={
        <div style={{ ...divStyle, ...headingBarStyle }}>
          {customHeadingBar && customHeadingBar}
          {!showMaximizeControls ? null : isMaximized ? (
            <IconButton
              style={{ marginLeft: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                unMaximize();
              }}
              size="large"
            >
              <FullscreenExit />
            </IconButton>
          ) : (
            <IconButton
              style={{ marginLeft: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                maximize();
              }}
              size="large"
            >
              <Fullscreen />
            </IconButton>
          )}
        </div>
      }
      panelExpanded={panelExpanded}
      onPanelChange={(expanded) => setPanelExpanded(expanded)}
      {...props}
    >
      {children}
    </Panel>
  );
};

export default RegionPanel;
