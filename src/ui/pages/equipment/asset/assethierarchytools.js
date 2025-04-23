import { get } from "lodash";
import set from "set-value";

const assetProps = ['AssetDependency.DEPENDENTASSET.ASSETID',
                    'PositionDependency.NONDEPENDENTASSET.ASSETID',
                    'SystemDependency.NONDEPENDENTASSET.ASSETID',
                    'PrimarySystemDependency.NONDEPENDENTASSET.ASSETID',
                    'LocationDependency.NONDEPENDENTASSET.ASSETID',
                    'NonDependentParents.NONDEPENDENTASSET.ASSETID']

export const getAssetHierarchyCode = (equipment) => (
            get(equipment, 'AssetParentHierarchy.AssetDependency.DEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.PositionDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE'));


export const getPositionHierarchyCode = (equipment) => (
            get(equipment, 'AssetParentHierarchy.PositionDependency.DEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.AssetDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE'))

export const getPrimarySystemHierarchyCode = (equipment) => (
            get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.AssetDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.PositionDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
            get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE'))

export const getAssetHierarchyAssetDependent = (equipment) => {
    console.log('eq', equipment)
  return get(equipment, 'AssetParentHierarchy.AssetDependency.DEPENDENTASSET') !== undefined
}




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
        return
    }

    let parent = null;
    if (parentCode && parentOrg) {
        parent = {
            EQUIPMENTCODE: parentCode,
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
    
}


export const getDependencyType = (currentAssetParentHierarchy) => 
    ( [ { path: "AssetDependency.DEPENDENTASSET", type: ParentDependencyTypes.ASSET },
        { path: "PositionDependency.DEPENDENTPOSITION", type: ParentDependencyTypes.POSITION },
        { path: "PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM", type: ParentDependencyTypes.PRIMARYSYSTEM },
        { path: "SystemDependency.DEPENDENTSYSTEM", type: ParentDependencyTypes.SYSTEM },
        { path: "LocationDependency.DEPENDENTLOCATION", type: ParentDependencyTypes.LOCATION },
      ].find(({ path }) => get(currentAssetParentHierarchy, path))?.type || ParentDependencyTypes.NONE);

export const getAssetHierarchyObject = (hierarchyProps, currentAssetParentHierarchy = {}) => {
    const {assetCode, assetOrg, 
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
        ...currentAssetParentHierarchy.LocationDependency,
    }

    convert(currentParents, dependencyType === ParentDependencyTypes.ASSET, "DEPENDENTASSET", "NONDEPENDENTASSET", parentAssetCode, parentAssetOrg, "ASSETID")
    convert(currentParents, dependencyType === ParentDependencyTypes.POSITION, "DEPENDENTPOSITION", "NONDEPENDENTPOSITION", parentPositionCode, parentPositionOrg, "POSITIONID")
    convert(currentParents, dependencyType === ParentDependencyTypes.PRIMARYSYSTEM, "DEPENDENTPRIMARYSYSTEM", "NONDEPENDENTPRIMARYSYSTEM", parentPrimarySystemCode, parentPrimarySystemOrg, "SYSTEMID")
    convert(currentParents, dependencyType === ParentDependencyTypes.SYSTEM, "DEPENDENTSYSTEM", "NONDDEPENDENTSYSTEM", parentSystemCode, parentSystemOrg, "SYSTEMID")

    const assetParentHierarchy = {
        ASSETID: currentAssetParentHierarchy.ASSETID,
        [dependencyType]: currentParents
    }
    
    console.log('return', assetParentHierarchy)
    return assetParentHierarchy
}



