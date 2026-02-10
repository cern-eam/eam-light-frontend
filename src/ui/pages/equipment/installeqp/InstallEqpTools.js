import GridRequest from "../../../../tools/entities/GridRequest";
import { getGridData } from "../../../../tools/WSGrids";
import useUserDataStore from "../../../../state/useUserDataStore";

function buildGridRequest(userGroup, userFunction) {
    const gridRequest = new GridRequest("BSGROU_PRM");
    gridRequest.addParam("param.usergroupcode", userGroup);
    gridRequest.addParam("param.userfunction", userFunction);
    gridRequest.addFilter("tabcode", "STC", "BEGINS");
    return getGridData(gridRequest);
}

export function readStructureTabPermissions() {
    const userData = useUserDataStore.getState().userData;
    const userGroup = userData.eamAccount.userGroup;

    return Promise.all([
        buildGridRequest(userGroup, userData.assetScreen),
        buildGridRequest(userGroup, userData.positionScreen),
        buildGridRequest(userGroup, userData.systemScreen),
    ]).then(([assetResult, positionResult, systemResult]) => ({
        assetPermissions: assetResult?.body?.data[0],
        positionPermissions: positionResult?.body?.data[0],
        systemPermissions: systemResult?.body?.data[0],
    }));
}
