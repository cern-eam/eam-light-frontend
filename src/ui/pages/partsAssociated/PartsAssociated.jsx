import * as React from "react";
import { PartPlusIcon } from "eam-components/dist/ui/components/icons";
import { PartsAssociatedContainer } from "./PartsAssociatedContainer"
import Entities from "@/enums/Entities";

const getPartsAssociated = (
  code,
  associationEntity = 'OBJ',
  ignore,
  initialVisibility,
  column,
  order,
  readOnly = false,
  parentEntity  =  Entities.ASSET
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
      disabled={readOnly}
      associationEntity = {associationEntity}
      parentEntity = {parentEntity}
    />
  ),
  column: column,
  order: order,
  summaryIcon: PartPlusIcon,
  ignore: ignore,
  initialVisibility: initialVisibility,
})};

export default getPartsAssociated;