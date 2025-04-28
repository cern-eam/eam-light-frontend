import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isMultiOrg } from "@/ui/pages/EntityTools";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";
import { readStatuses } from "../../../../tools/WSGrids";

const NCRGeneral = (props) => {
    const { register, ncr, userGroup, newEntity } = props;

    return (
        <React.Fragment>
            <EAMTextField {...register("description")} />

            <EAMAutocomplete
                {...register("equipment")}
                link={() =>
                    ncr.equipmentCode ? "/equipment/" + ncr.equipmentCode : null
                }
            />

            <EAMAutocomplete {...register("location")} />

            <EAMAutocomplete {...register("department")} />

            <EAMSelect {...register("type", "typeCode")} />

            <EAMSelect 
                {...register("status")} 
                autocompleteHandler={readStatuses}
                autocompleteHandlerParams={["NOCF", newEntity, ncr.statusCode]}
            />

            <EAMAutocomplete {...register("class")} />

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
