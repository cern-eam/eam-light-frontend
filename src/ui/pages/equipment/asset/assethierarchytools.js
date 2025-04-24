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

    //console.log('data', currentParents, dependent, dependentProp, nonDependentProp, parentCode, parentOrg)

    currentParents[dependent ? dependentProp : nonDependentProp] = {
        ...currentParents[dependentProp],
        ...currentParents[nonDependentProp],
        ...(parent ? { [parentProp]: parent } : {})
    } 
    delete currentParents[dependent ? nonDependentProp : dependentProp]

    return false
    
}


export const getDependencyType = (currentAssetParentHierarchy) => 
    ( [ { path: "AssetDependency.DEPENDENTASSET", type: ParentDependencyTypes.ASSET },
        { path: "PositionDependency.DEPENDENTPOSITION", type: ParentDependencyTypes.POSITION },
        { path: "PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM", type: ParentDependencyTypes.PRIMARYSYSTEM },
        { path: "SystemDependency.DEPENDENTSYSTEM", type: ParentDependencyTypes.SYSTEM },
        { path: "LocationDependency.DEPENDENTLOCATION", type: ParentDependencyTypes.LOCATION },
      ].find(({ path }) => get(currentAssetParentHierarchy, path))?.type || ParentDependencyTypes.NONE);

export const getHierarchyObject = (hierarchyProps, currentAssetParentHierarchy = {}) => {
    let {assetCode, assetOrg, 
        dependencyType = getDependencyType(currentAssetParentHierarchy),
        parentAssetCode, parentAssetOrg,
        parentPositionCode, parentPositionOrg,
        parentPrimarySystemCode, parentPrimarySystemOrg,
        parentSystemCode, parentSystemOrg,
        parentLocationCode, parentLocationOrg
        } = hierarchyProps;
        
    const currentParents = {
        ...currentAssetParentHierarchy.AssetDependency,
        ...currentAssetParentHierarchy.PositionDependency,
        ...currentAssetParentHierarchy.PrimarySystemDependency,
        ...currentAssetParentHierarchy.SystemDependency,
        ...currentAssetParentHierarchy.LocationDependency,
        ...currentAssetParentHierarchy.NonDependentParents,
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
        ASSETID: currentAssetParentHierarchy.ASSETID,
        POSITIONID: currentAssetParentHierarchy.POSITIONID,
        //LOCATIONID: currentAssetParentHierarchy.LOCATIONID,
        [dependencyType]: currentParents
    }
    
    return assetParentHierarchy
}



