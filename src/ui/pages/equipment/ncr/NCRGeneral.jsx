import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import WS from "../../../../tools/WS";
import { readStatuses } from "../../../../tools/WSGrids";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const NCRGeneral = (props) => {
    const { register, ncr, userGroup, newEntity } = props;

    const equipmentCode = ncr?.EQUIPMENTID?.EQUIPMENTCODE;

    return (
        <React.Fragment>
            <EAMTextField {...register("description")} />

            <EAMComboAutocomplete
                {...register("equipment")}
                link={() =>
                    equipmentCode ? "/equipment/" + equipmentCode : null
                }
            />

            <EAMComboAutocomplete {...register("location")} />

            <EAMComboAutocomplete {...register("department")} />

            <EAMSelect {...register("type")} />

            <EAMSelect
                {...register("status")}
                autocompleteHandler={readStatuses}
                autocompleteHandlerParams={["NOCF", newEntity, ncr.statusCode]}
            />

            <EAMComboAutocomplete {...register("class")} />

            <EAMSelect
                {...register("severity")}
                autocompleteHandler={WS.getCodeLov}
                autocompleteHandlerParams={["SEVE"]}
            />

            <EAMSelect
                {...register("importance")}
                autocompleteHandler={WS.getCodeLov}
                autocompleteHandlerParams={["IMPT"]}
            />

            <EAMTextField
                {...register("nonconformitynote")}
                textarea={true}
            />
        </React.Fragment>
    );
};

export default NCRGeneral;
