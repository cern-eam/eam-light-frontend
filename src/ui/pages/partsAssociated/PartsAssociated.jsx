import * as React from "react";
import { PartPlusIcon } from "eam-components/dist/ui/components/icons";
import { PartsAssociatedContainer } from "./PartsAssociatedContainer"

const getPartsAssociated = (
  code,
  associationEntity = 'OBJ',
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
      code={code}
      isMaximized={isMaximized}
      disabled= {false}
      hideAddPartAssociation = {hideAddPartAssociation}
      associationEntity = {associationEntity}
    />
  ),
  column: column,
  order: order,
  summaryIcon: PartPlusIcon,
  ignore: ignore,
  initialVisibility: initialVisibility,
})};

export default getPartsAssociated;