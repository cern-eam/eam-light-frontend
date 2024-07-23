import React from 'react';
import EAMGridTab from 'eam-components/dist/ui/components/grids/eam/EAMGridTab';
import { PartPlusIcon } from 'eam-components/dist/ui/components/icons';


const getPartsAssociated = (objCode, objOrganization, ignore, initialVisibility, column, order) => ({
    id: 'PARTSASSOCIATED',
    label: 'Parts Associated',
    isVisibleWhenNewEntity: false,
    maximizable: true,
    render: ({ isMaximized }) => (
        <EAMGridTab
            gridName='BSPARA'
            objectCode={`${objCode}#${objOrganization}`}
            paramNames={['param.valuecode']}
            additionalParams={{ 'param.entity': 'OBJ' }}
            showGrid={isMaximized}
            rowCount={100}
            gridContainerStyle={isMaximized ? { height: `${document.getElementById('entityContent').offsetHeight - 220}px` } : {}}
        />
    ),
    column: column,
    order: order,
    summaryIcon: PartPlusIcon,
    ignore: ignore,
    initialVisibility: initialVisibility
});

export default getPartsAssociated;