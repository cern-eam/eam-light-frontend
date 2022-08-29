import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSParts from "../../../tools/WSParts";
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import WS from "../../../tools/WS";
import StatusRow from "../../components/statusrow/StatusRow"
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

const PartGeneral = (props) => {

    const { part, newEntity, register } = props;

    return (
        <React.Fragment>

            {newEntity && <EAMTextField {...register('partcode', 'code')} />}

            <EAMTextField {...register('description', 'description')} />

            <EAMAutocomplete
                {...register('class', 'classCode', 'classDesc')}
                autocompleteHandler={WS.autocompleteClass}
                autocompleteHandlerParams={['PART']}
            />

            <EAMAutocomplete
                {...register('category', 'categoryCode', 'categoryDesc')}
                autocompleteHandler={WSParts.autocompletePartCategory}
            />

            <EAMAutocomplete
                {...register('uom', 'uom', 'uomdesc')}
                autocompleteHandler={WSParts.autocompletePartUOM}
            />

            <EAMSelect
                {...register('trackingtype', 'trackingMethod')}
                autocompleteHandler={WSParts.getPartTrackingMethods}
            />

            <EAMAutocomplete
                {...register('commoditycode', 'commodityCode', 'commodityDesc')}
                autocompleteHandler={WSParts.autocompletePartCommodity}
            />

            <EAMCheckbox {...register('trackbyasset', 'trackByAsset')} />

            <EAMCheckbox {...register('repairablespare', 'trackCores')} />

            <StatusRow
                entity={part}
                entityType={"part"}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
            
        </React.Fragment>
    );
}

export default PartGeneral;
