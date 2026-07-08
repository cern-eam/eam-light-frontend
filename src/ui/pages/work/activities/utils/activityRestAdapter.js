import {fromEAMDate} from "../../../EntityTools.jsx";

export const adaptActivityFromRestFormat = activityRest => {
    return {
        activityCode: activityRest.ACTIVITYID.ACTIVITYCODE.value,
        activityNote: activityRest.ACTIVITYID.ACTIVITYNOTE,
        workOrderNumber: activityRest.ACTIVITYID.WORKORDERID.JOBNUM,
        peopleRequired: activityRest.PERSONS,
        estimatedHours: activityRest.ESTIMATEDHOURS,
        hoursRemaining: activityRest.HOURSREMAINING,
        startDate: fromEAMDate(activityRest.ACTIVITYSTARTDATE),
        endDate: fromEAMDate(activityRest.ACTIVITYENDDATE),
        materialList: activityRest.MATLIST.MTLCODE,
        taskCode: activityRest.TASKSID.TASKCODE,
        taskDesc: activityRest.TASKSID.DESCRIPTION,
        taskRev: activityRest.TASKSID.TASKREVISION,
        tradeCode: activityRest.TRADEID.TRADECODE,
        taskQty: activityRest.TASKSID.TASKQUANTITY.value,
        checklists: null,
        signatures: null,
        forceActivityExpansion: null
    }
}

export const adaptActivitiesFromRestFormat = activitiesRest => {
    let activitiesDesiredFormat = [];
    activitiesRest.forEach(activityRest => {
        activitiesDesiredFormat.push(adaptActivityFromRestFormat(activityRest));
    })
    return activitiesDesiredFormat;
}