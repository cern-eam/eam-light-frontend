import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { onCategoryChange } from '../EquipmentTools';

const AssetDetails = (props) => {
    
    const { equipment, updateEquipmentProperty, register } = props;

    return (
        <React.Fragment>

            <EAMAutocomplete
                {...register('class', 'classCode', 'classDesc')}
                autocompleteHandler={WS.autocompleteClass}
                autocompleteHandlerParams={['OBJ']}
            />

            <EAMAutocomplete
                {...register('category', 'categoryCode', 'categoryDesc')}
                autocompleteHandler={WSEquipment.autocompleteEquipmentCategory}
                autocompleteHandlerParams={[equipment.classCode]}
                onChangeValue={(categoryCode) =>
                    onCategoryChange(categoryCode, updateEquipmentProperty)
                }
            />

            <EAMAutocomplete
                {...register('costcode', 'costCode', 'costCodeDesc')}
                autocompleteHandler={WSEquipment.autocompleteCostCode}/>

            <EAMDatePicker
                {...register('commissiondate', 'comissionDate')}
            />

            <EAMAutocomplete
                {...register('assignedto', 'assignedTo', 'assignedToDesc')}
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMSelect
                {...register('criticality', 'criticality')}
                autocompleteHandler={WSEquipment.getEquipmentCriticalityValues}
            />

            <EAMAutocomplete
                {...register('manufacturer', 'manufacturerCode', 'manufacturerDesc')}
                autocompleteHandler={WSEquipment.autocompleteManufacturer}
            />

            <EAMTextField
                {...register('serialnumber', 'serialNumber')}
            />

            <EAMTextField
                {...register('model', 'model')}
                inputProps={{maxLength: 30}}
            />

            <EAMAutocomplete
                {...register('part', 'partCode', 'partDesc')}
                autocompleteHandler={WSEquipment.autocompleteEquipmentPart}
                link={() => equipment.partCode ? "/part/" + equipment.partCode: null}
            />

            <EAMAutocomplete
                {...register('store', 'storeCode', 'storeDesc')}
                autocompleteHandler={WSEquipment.autocompleteEquipmentStore}
            />

            <EAMAutocomplete
                {...register('bin', 'bin', 'binDesc')}
                autocompleteHandler={WSEquipment.autocompleteEquipmentBin}
                autocompleteHandlerParams={[equipment.storeCode]}
            />

        </React.Fragment>
    )
}

export default AssetDetails;
