import React from 'react';
import {AssetIcon, PositionIcon, SystemIcon} from 'eam-components/ui/components/icons';
import LocationIcon from '@material-ui/icons/Room';

export const EAMIcon = ({ eqtype, style, classes }) => (
    <div>
        {eqtype === 'A' && <AssetIcon style={style} classes={classes} />}
        {eqtype === 'S' && <SystemIcon style={style} classes={classes}/>}
        {eqtype === 'P' && <PositionIcon style={style} classes={classes}/> }
        {eqtype === 'L' && <LocationIcon style={style} classes={classes}/>}
    </div>
);

export default EAMIcon;