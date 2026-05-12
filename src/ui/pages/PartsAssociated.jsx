import * as React from "react";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import { PartPlusIcon } from "eam-components/dist/ui/components/icons";
import { PartsAssociatedContainer } from "./partsAssociated/PartsAssociatedContainer";

const getPartsAssociated = (
  objCode,
  objOrganization,
  ignore,
  initialVisibility,
  column,
  order
) => ({
  id: "PARTSASSOCIATED",
  label: "Parts Associated",
  isVisibleWhenNewEntity: false,
  maximizable: true,
  render: ({ isMaximized }) => (
      <PartsAssociatedContainer
          code={`${objCode}`}
          isMaximized={isMaximized}
          disabled= {false}
          hideAddPartAssociation = {true}
        />
  ),
  column: column,
  order: order,
  summaryIcon: PartPlusIcon,
  ignore: ignore,
  initialVisibility: initialVisibility,
});

export default getPartsAssociated;
