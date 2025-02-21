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
            <EAMTextField {...register("description", "description")} />
            <EAMAutocomplete
                {...register("equipment", "equipmentCode")}
                link={() =>
                    ncr.equipmentCode ? "/equipment/" + ncr.equipmentCode : null
                }
            />

            <EAMAutocomplete
                {...register("location", "locationCode", "locationDesc")}
            />

            <EAMAutocomplete {...register("department", "department")} />

            <EAMSelect {...register("type", "typeCode")} />

            <EAMSelect 
                {...register("status", "statusCode")} 
                autocompleteHandler={readStatuses}
                autocompleteHandlerParams={["NOCF", newEntity, ncr.statusCode]}
            />

            <EAMAutocomplete {...register("class", "classCode")} />

            <EAMSelect
                {...register("severity", "severity")}
                autocompleteHandler={WS.getCodeLov}
                autocompleteHandlerParams={["SEVE"]}
            />

            <EAMSelect
                {...register("importance", "importance")}
                autocompleteHandler={WS.getCodeLov}
                autocompleteHandlerParams={["IMPT"]}
            />

            <EAMTextField
                {...register("nonconformitynote", "nonConformityNote")}
                textarea={true}
            />
        </React.Fragment>
    );
};

export default NCRGeneral;
