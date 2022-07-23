import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import Panel from 'ui/components/panel/Panel';

const RegionPanel = (props) => {
    const { children, isMaximized, unMaximize, maximize, showMaximizeControls, style, initiallyExpanded } = props;

    const [panelExpanded, setPanelExpanded] = useState(initiallyExpanded);

    return (
        <Panel
            AccordionProps={{ style }}
            headingBar={
                !showMaximizeControls
                ? null
                : isMaximized
                ? <IconButton onClick={(e) => { e.stopPropagation(); unMaximize(); }} size="large"><FullscreenExit /></IconButton>
                : <IconButton onClick={(e) => { e.stopPropagation(); maximize() }} size="large"><Fullscreen /></IconButton>
            }
            panelExpanded={panelExpanded}
            onPanelChange={expanded => setPanelExpanded(expanded)}
            {...props}>
            {children}
        </Panel>
    );
}

export default RegionPanel;