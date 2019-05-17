import EquipmentToolbar from "../pages/equipment/components/EquipmentToolbar";
import WorkorderToolbar from "../pages/work/WorkorderToolbar";
import PartToolbar from "../pages/part/PartToolbar";
import React from 'react';

export const TOOLBARS = {
    WORKORDER: 'WORKORDER',
    EQUIPMENT: 'EQUIPMENT',
    PART: 'PART'
}

class AbstractToolbar extends React.Component {

    toolbarComponents = {
        [TOOLBARS.WORKORDER]: WorkorderToolbar,
        [TOOLBARS.EQUIPMENT]: EquipmentToolbar,
        [TOOLBARS.PART]: PartToolbar
    }

    render() {
        const { _toolbarType, ...other } = this.props;
        const Toolbar = this.toolbarComponents[_toolbarType];
        if(!Toolbar) return null;

        return <Toolbar {...this.props} />
    }

}

export default AbstractToolbar;