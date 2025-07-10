import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMDateTimePicker from "eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import * as React from "react";
import WSUDF from "@/tools/WSUDF";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const NONE = "NONE";
const CODE = "CODE";
const CODEDESC = "CODEDESC";
const RENT = "RENT";

const EAMUDF = (props) => {
  const { udfLookupType, udfLookupEntity, elementId, fieldType, udfUom } =
    props.elementInfo;
    
  if (fieldType === "checkbox") {
    return <EAMCheckbox {...props} />;
  }

  if (fieldType === "date") {
    return <EAMDatePicker {...props} />;
  }

  if (fieldType === "datetime") {
    return <EAMDateTimePicker {...props} />;
  }

  switch (udfLookupType) {
    case CODE:
      return (
        <EAMComboAutocomplete
          {...props}
          autocompleteHandler={WSUDF.getUDFCodeValues}
          autocompleteHandlerParams={[udfLookupEntity, elementId]}
          selectMode={true}
        />
      );
    case CODEDESC:
      return (
        <EAMComboAutocomplete
          {...props}
          autocompleteHandler={WSUDF.getUDFCodeDescValues}
          autocompleteHandlerParams={[udfLookupEntity, elementId]}
          selectMode={true}
        />
      );
    case RENT:
      return (
        <EAMAutocomplete
          {...props}
          autocompleteHandler={WSUDF.autocompleteUserDefinedField}
          autocompleteHandlerParams={[udfLookupEntity]}
        />
      );
    case NONE:
    default:
      return <EAMTextField {...props} endTextAdornment={udfUom} />;
  }
};

export default EAMUDF;
