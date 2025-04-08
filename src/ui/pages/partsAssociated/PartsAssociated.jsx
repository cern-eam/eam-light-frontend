import * as React from "react";
import { PartPlusIcon } from "eam-components/dist/ui/components/icons";
import { PartsAssociatedContainer } from "./PartsAssociatedContainer"

const getPartsAssociated = (
  objCode,
  objOrganization,
  ignore,
  initialVisibility,
  column,
  order,
  hideAddPartAssociation = false
) => {
  return (
  {
  id: "PARTSASSOCIATED",
  label: "Parts Associated",
  isVisibleWhenNewEntity: false,
  maximizable: true,
  render: ({ isMaximized }) => (
    <PartsAssociatedContainer
      objCode={objCode}
      objOrganization={objOrganization}
      isMaximized={isMaximized}
      disabled= {false}
      hideAddPartAssociation = {hideAddPartAssociation}
    />
  ),
  column: column,
  order: order,
  summaryIcon: PartPlusIcon,
  ignore: ignore,
  initialVisibility: initialVisibility,
})};

export default getPartsAssociated;
