import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import IconButton from '@material-ui/core/IconButton';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';
import PortalWrapper from "../../portals/PortalWrapper";
import RegionPanelPortal from "./RegionPanelPortal";

const RegionPanel = (props) => {
    const { children, isMaximized, unMaximize, maximize, showMaximizeControls } = props;

    return (
        <PortalWrapper Portal={RegionPanelPortal} predicate={() => isMaximized}>
            <EISPanel
                headingBar={
                    !showMaximizeControls
                    ? null
                    : isMaximized
                    ? <IconButton onClick={(e) => { e.stopPropagation(); unMaximize(); }}><FullscreenExit /></IconButton>
                    : <IconButton onClick={(e) => { e.stopPropagation(); maximize() }}><Fullscreen /></IconButton>
                }
                {...props}>
                {children}
            </EISPanel>
        </PortalWrapper>
    )
}

export default RegionPanel;