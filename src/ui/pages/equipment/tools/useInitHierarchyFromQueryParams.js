import { useEffect } from "react";
import queryString from "query-string";
import { getCodeOrg } from "@/hooks/tools";
import { getHierarchyObject, ParentDependencyTypes } from "./hierarchyTools";

export const useInitHierarchyFromQueryParams = ({
  newEntity,
  equipment,
  updateEquipmentProperty,
  hierarchyKey
}) => {
  useEffect(() => {
    if (!newEntity) return;
    
    const queryParams = queryString.parse(window.location.search);

    const dependencyType =
      queryParams["dependencytype"] ??
      (queryParams["parentlocation"] ? "LocationDependency" : ParentDependencyTypes.NONE);

    const hierarchyProps = {
      parentAssetCode: getCodeOrg(queryParams["parentasset"])?.code,
      parentAssetOrg: getCodeOrg(queryParams["parentasset"])?.org,
      parentPositionCode: getCodeOrg(queryParams["parentposition"])?.code,
      parentPositionOrg: getCodeOrg(queryParams["parentposition"])?.org,
      parentPrimarySystemCode: getCodeOrg(queryParams["parentsystem"])?.code,
      parentPrimarySystemOrg: getCodeOrg(queryParams["parentsystem"])?.org,
      parentLocationCode: getCodeOrg(queryParams["parentlocation"])?.code,
      parentLocationOrg: getCodeOrg(queryParams["parentlocation"])?.org,
      dependencyType
    };

    const hierarchy = getHierarchyObject(hierarchyProps, equipment?.[hierarchyKey]);
    updateEquipmentProperty(hierarchyKey, hierarchy);
  }, []);
};
