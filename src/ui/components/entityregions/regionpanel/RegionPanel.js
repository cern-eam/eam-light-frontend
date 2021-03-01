import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import IconButton from '@material-ui/core/IconButton';
import Fullscreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from '@material-ui/icons/FullscreenExit';

const RegionPanel = (props) => {
    const { children, isMaximized, unMaximize, maximize, showMaximizeControls, style } = props;

    return (
        <EISPanel
            ExpansionPanelProps={{ style }}
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
    )
}

export default RegionPanel;