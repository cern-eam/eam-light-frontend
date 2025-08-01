import { get } from "lodash";

export const getParentAssetCode = (hierarchyKey, equipment) => (
            get(equipment, `${hierarchyKey}.AssetDependency.DEPENDENTASSET.ASSETID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.PositionDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.SystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.PrimarySystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.LocationDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.NonDependentParents.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE`));


export const getParentPositionCode = (hierarchyKey, equipment) => (
            get(equipment, `${hierarchyKey}.PositionDependency.DEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.AssetDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.SystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.PrimarySystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.LocationDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.NonDependentParents.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE`))

export const getParentPrimarySystemCode = (hierarchyKey, equipment) => (
            get(equipment, `${hierarchyKey}.PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.AssetDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.PositionDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.SystemDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.LocationDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`) ??
            get(equipment, `${hierarchyKey}.NonDependentParents.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE`))

export const getParentAssetCostRollUp = (hierarchyKey, equipment) => [
            get(equipment, `${hierarchyKey}.AssetDependency.DEPENDENTASSET.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.PositionDependency.NONDEPENDENTASSET.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.SystemDependency.NONDEPENDENTASSET.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.PrimarySystemDependency.NONDEPENDENTASSET.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.LocationDependency.NONDEPENDENTASSET.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.NonDependentParents.NONDEPENDENTASSET.COSTROLLUP`),
            ].some(value => value === "true");

export const getParentPositionCostRollUp = (hierarchyKey, equipment) => [
            get(equipment, `${hierarchyKey}.PositionDependency.DEPENDENTPOSITION.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.AssetDependency.NONDEPENDENTPOSITION.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.SystemDependency.NONDEPENDENTPOSITION.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.PrimarySystemDependency.NONDEPENDENTPOSITION.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.LocationDependency.NONDEPENDENTPOSITION.COSTROLLUP`),
            get(equipment, `${hierarchyKey}.NonDependentParents.NONDEPENDENTPOSITION.COSTROLLUP`),
            ].some(value => value === "true");

export const ParentDependencyTypes = Object.freeze({
    ASSET: "AssetDependency",
    POSITION: "PositionDependency",
    PRIMARYSYSTEM: "PrimarySystemDependency",
    SYSTEM: "SystemDependency",
    LOCATION: "LocationDependency",
    NONE: "NonDependentParents",
  });


export const convert = (currentParents, dependent, dependentProp, nonDependentProp, parentCode, parentOrg, parentProp) => {
    if (!currentParents[dependentProp] && !currentParents[nonDependentProp] && !parentCode) {
        return false
    }

    if (parentCode === '' && parentOrg === '') {
        delete currentParents[dependentProp]
        delete currentParents[nonDependentProp]
        return dependent
    }

    let parent = null;
    if (parentCode && parentOrg) {
        parent = {
            [parentProp === 'LOCATIONID' ? 'LOCATIONCODE' : 'EQUIPMENTCODE']: parentCode,
            ORGANIZATIONID: {ORGANIZATIONCODE: parentOrg}
        }
    }

    currentParents[dependent ? dependentProp : nonDependentProp] = {
        ...currentParents[dependentProp],
        ...currentParents[nonDependentProp],
        ...(parent ? { [parentProp]: parent } : {})
    }
    delete currentParents[dependent ? nonDependentProp : dependentProp]

    return false

}


export const getDependencyType = (currentParentHierarchy) =>
    ( [ { path: "AssetDependency.DEPENDENTASSET", type: ParentDependencyTypes.ASSET },
        { path: "PositionDependency.DEPENDENTPOSITION", type: ParentDependencyTypes.POSITION },
        { path: "PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM", type: ParentDependencyTypes.PRIMARYSYSTEM },
        { path: "SystemDependency.DEPENDENTSYSTEM", type: ParentDependencyTypes.SYSTEM },
        { path: "LocationDependency.DEPENDENTLOCATION", type: ParentDependencyTypes.LOCATION },
        { path: "LocationDependency.NONDEPENDANTASSET", type: ParentDependencyTypes.ASSET },
      ].find(({ path }) => get(currentParentHierarchy, path))?.type || ParentDependencyTypes.NONE);

export const getHierarchyObject = (hierarchyProps, currentParentHierarchy = {}) => {
    let {dependencyType = getDependencyType(currentParentHierarchy),
            parentAssetCode, parentAssetOrg,
            parentPositionCode, parentPositionOrg,
            parentPrimarySystemCode, parentPrimarySystemOrg,
            parentSystemCode, parentSystemOrg,
            parentLocationCode, parentLocationOrg
        } = hierarchyProps;

    const currentParents = {
        ...currentParentHierarchy.AssetDependency,
        ...currentParentHierarchy.PositionDependency,
        ...currentParentHierarchy.PrimarySystemDependency,
        ...currentParentHierarchy.SystemDependency,
        ...currentParentHierarchy.LocationDependency,
        ...currentParentHierarchy.NonDependentParents,
    }

    if (convert(currentParents, dependencyType === ParentDependencyTypes.ASSET, "DEPENDENTASSET", "NONDEPENDENTASSET", parentAssetCode, parentAssetOrg, "ASSETID")) {
        dependencyType = ParentDependencyTypes.NONE;
    }
    if (convert(currentParents, dependencyType === ParentDependencyTypes.POSITION, "DEPENDENTPOSITION", "NONDEPENDENTPOSITION", parentPositionCode, parentPositionOrg, "POSITIONID")) {
        dependencyType = ParentDependencyTypes.NONE;
    }
    if (convert(currentParents, dependencyType === ParentDependencyTypes.PRIMARYSYSTEM, "DEPENDENTPRIMARYSYSTEM", "NONDEPENDENTPRIMARYSYSTEM", parentPrimarySystemCode, parentPrimarySystemOrg, "SYSTEMID")) {
        dependencyType = ParentDependencyTypes.NONE;
    }
    if (convert(currentParents, dependencyType === ParentDependencyTypes.SYSTEM, "DEPENDENTSYSTEM", "NONDDEPENDENTSYSTEM", parentSystemCode, parentSystemOrg, "SYSTEMID")) {
        dependencyType = ParentDependencyTypes.NONE;
    }
    if (convert(currentParents, dependencyType === ParentDependencyTypes.LOCATION, "DEPENDENTLOCATION", "NONDDEPENDENTLOCATION", parentLocationCode, parentLocationOrg, "LOCATIONID")) {
        dependencyType = ParentDependencyTypes.NONE;
    }

    const assetParentHierarchy = {
        ASSETID: currentParentHierarchy.ASSETID,
        POSITIONID: currentParentHierarchy.POSITIONID,
        //LOCATIONID: currentParentHierarchy.LOCATIONID,
        [dependencyType]: currentParents
    }

    return assetParentHierarchy
}



