import Checklists from "eam-components/dist/ui/components/checklists/Checklists";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import BlockUi from "react-block-ui";
import { getEquipment } from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import { ENTITY_TYPE } from "../../components/Toolbar";
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import NCRIframeContainer from "../../components/iframes/NCRIframeContainer";
import Activities from "./activities/Activities";
import AdditionalCosts from "./additionalcosts/AdditionalCosts";
import WorkorderChildren from "./childrenwo/WorkorderChildren";
import MeterReadingWO from "./meter/MeterReadingWO";
import PartUsage from "./partusage/PartUsage";
import WorkorderClosingCodes from "./WorkorderClosingCodes";
import WorkorderGeneral from "./WorkorderGeneral";
import WorkorderScheduling from "./WorkorderScheduling";
import {
  isReadOnlyCustomHandler,
  isRegionAvailable,
  layoutPropertiesMap,
} from "./WorkorderTools";
import EntityRegions from "../../components/entityregions/EntityRegions";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import TuneIcon from "@mui/icons-material/Tune";
import { IconSlash } from "eam-components/dist/ui/components/icons/index";
import { isCernMode } from "../../components/CERNMode";
import { TAB_CODES } from "../../components/entityregions/TabCodeMapping";
import {
  getTabAvailability,
  getTabInitialVisibility,
  registerCustomField,
  getTabGridRegions,
  renderLoading,
  getCustomTabRegions,
} from "../EntityTools";
import WSWorkorders from "../../../tools/WSWorkorders";
import useEntity from "@/hooks/useEntity";
import UserDefinedFields from "@/ui/components/userdefinedfields/UserDefinedFields";
import { isHidden } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import ConstructionIcon from "@mui/icons-material/Construction";
import SpeedIcon from "@mui/icons-material/Speed";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import SegmentRoundedIcon from "@mui/icons-material/SegmentRounded";
import { Article, PendingActions } from "@mui/icons-material";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { PartIcon } from "eam-components/dist/ui/components/icons";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import HardwareIcon from "@mui/icons-material/Hardware";
import EamlightToolbar from "../../components/EamlightToolbar";
import useWorkOrderStore from "../../../state/useWorkOrderStore";
import { isLocalAdministrator } from "../../../state/utils";
import AssetNCRs from "../../pages/equipment/components/EquipmentNCRs";
import CustomFields from "../../components/customfields/CustomFields";
import { getPart } from "../../../tools/WSParts";
import Documents from "../../components/documents/Documents";
import getPartsAssociated from "@/ui/pages/partsAssociated/PartsAssociated";
import { getOrg } from "../../../hooks/tools";

const getEquipmentStandardWOMaxStep = async (eqCode, swoCode) => {
  if (!eqCode || !swoCode) {
    return;
  }
  const response = await WSWorkorder.getEquipmentStandardWOMaxStep(
    eqCode,
    swoCode
  );
  return response.body.data;
};

const customTabGridParamNames = ["evt_code", "EVENT", "WO_CODE"];

const Workorder = () => {
  const history = useHistory();
  const [equipmentMEC, setEquipmentMEC] = useState();
  const [equipment, setEquipment] = useState();
  const [equipmentPart, setEquipmentPart] = useState();
  const [statuses, setStatuses] = useState([]);
  const [otherIdMapping, setOtherIdMapping] = useState({});
  const [expandChecklistsOptions, setExpandChecklistsOptions] = useState(false);
  const checklists = useRef(null);
  const { setCurrentWorkOrder } = useWorkOrderStore();
  //
  //
  //
  const {
    screenLayout: workOrderLayout,
    entity: workorder,
    id,
    setEntity: setWorkOrder,
    loading,
    readOnly,
    isModified,
    screenPermissions,
    screenCode,
    userData,
    applicationData,
    newEntity,
    updateExtraData,
    commentsComponent,
    isHiddenRegion,
    getUniqueRegionID,
    setRegionVisibility,
    updateEquipmentTreeData,
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty: updateWorkorderProperty,
    register,
    handleError,
    showError,
    showNotification,
    showWarning,
    createEntity,
    setLoading,
    setReadOnly,
  } = useEntity({
    WS: {
      create: WSWorkorder.createWorkOrder,
      read: WSWorkorder.getWorkOrder,
      update: WSWorkorder.updateWorkOrder,
      delete: WSWorkorder.deleteWorkOrder,
      new: WSWorkorder.initWorkOrder,
    },
    postActions: {
      read: postRead,
      new: postInit,
      copy: postCopy,
    },
    handlers: {
      "STANDARDWO.STDWOCODE": onChangeStandardWorkOrder,
      "EQUIPMENTID.EQUIPMENTCODE,EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE":
        onChangeEquipment,
    },
    isReadOnlyCustomHandler: isReadOnlyCustomHandler,
    entityCode: "EVNT",
    entityDesc: "Work Order",
    entityURL: "/workorder/",
    entityCodeProperty: "WORKORDERID.JOBNUM",
    entityOrgProperty: "WORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "WorkOrder",
    resultDataCodeProperty: "JOBNUM",
    screenProperty: "workOrderScreen",
    layoutPropertiesMap,
    onMountHandler: mountHandler,
    onUnmountHandler: unmountHandler,
    codeQueryParamName: "workordernum",
  });

  function onChangeEquipment(equipmentData) {
    
    const equipmentCode = equipmentData["EQUIPMENTID.EQUIPMENTCODE"];
    const equipmentOrg = equipmentData["EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE"];

    if (!equipmentCode) {
      setEquipment(null);
      setEquipmentPart(null);
      return;
    }

    Promise.all([
      getEquipment(equipmentCode, equipmentOrg),
      WSWorkorders.getWOEquipLinearDetails(equipmentCode),
    ])
      .then(([equipment, linearDetails]) => {
        setEquipment(equipment);
        
        if (!workorder?.DEPARTMENTID?.DEPARTMENTCODE) {
          updateWorkorderProperty("DEPARTMENTID", equipment.DEPARTMENTID);
        }

        if (!workorder?.LOCATIONID?.LOCATIONCODE) {
          updateWorkorderProperty("LOCATIONID", equipment?.AssetParentHierarchy?.LOCATIONID ?? equipment?.PositionParentHierarchy?.LOCATIONID ?? equipment?.SystemParentHierarchy?.LOCATIONID);
        }

        if (!workorder?.COSTCODEID) {
          updateWorkorderProperty("COSTCODEID", equipment.COSTCODEID);
        }

        //TODO warranty: linearDetails.ISWARRANTYACTIVE,

        if (linearDetails.body?.data?.ISWARRANTYACTIVE === "true") {
          showWarning("This equipment is currently under warranty.");
        }
      })
      .catch(console.error);
  }

  function onChangeStandardWorkOrder(standardWorkOrderCode) {
    if (!standardWorkOrderCode) {
      return;
    }

    WSWorkorder.getStandardWorkOrder(standardWorkOrderCode)
      .then((response) => {
        const standardWorkOrder = response.body.Result.ResultData.StandardWorkOrder;
        updateWorkorderProperty("CLASSID.CLASSCODE", standardWorkOrder.WORKORDERCLASSID?.CLASSCODE);
        updateWorkorderProperty("TYPE", standardWorkOrder.WORKORDERTYPE);
        updateWorkorderProperty("PRIORITY", standardWorkOrder.PRIORITY);
        updateWorkorderProperty("PROBLEMCODEID", standardWorkOrder.PROBLEMCODEID);
        updateWorkorderProperty("WORKORDERID.DESCRIPTION", standardWorkOrder.STANDARDWO.DESCRIPTION);
        console.log(standardWorkOrder);
      })
      .catch(console.error);
  }

  useEffect( () => {
    updateExtraData("equipmentclass", equipment?.CLASSID?.CLASSCODE)
    updateExtraData("equipmentclassorg", equipment?.CLASSID?.ORGANIZATIONID?.ORGANIZATIONCODE)
    updateExtraData("equipmentcategory", equipment?.CATEGORYID?.CATEGORYCODE)
  }, [equipment])

  const getRegions = () => {
    const { tabs } = workOrderLayout;
    const commonProps = {
      workorder,
      id,
      newEntity,
      workOrderLayout,
      userGroup: userData.eamAccount.userGroup,
      updateWorkorderProperty,
      register,
    };

    return [
      {
        id: "DETAILS",
        label: "Details",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <WorkorderGeneral
            {...commonProps}
            applicationData={applicationData}
            userData={userData}
            equipment={equipment}
            statuses={statuses}
            newEntity={newEntity}
            screenCode={screenCode}
            screenPermissions={screenPermissions}
          />
        ),
        column: 1,
        order: 1,
        summaryIcon: AssignmentIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "SCHEDULING",
        label: "Scheduling",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        customVisibility: () =>
          isRegionAvailable("SCHEDULING", commonProps.workOrderLayout),
        render: () => <WorkorderScheduling {...commonProps} />,
        column: 1,
        order: 2,
        summaryIcon: CalendarMonthIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "CLOSINGCODES",
        label: "Closing Codes",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        customVisibility: () =>
          isRegionAvailable("CLOSING_CODES", commonProps.workOrderLayout),
        render: () => (
          <WorkorderClosingCodes {...commonProps} equipment={equipment} />
        ),
        column: 1,
        order: 3,
        summaryIcon: SportsScoreIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.CLOSING_CODES),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.CLOSING_CODES
        ),
      },
      {
        id: "PARTUSAGE",
        label: "Part Usage",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        customVisibility: () =>
          isRegionAvailable("PAR", commonProps.workOrderLayout),
        render: () => (
          <PartUsage
            workOrderCode={id?.code}
            workOrder={workorder}
            tabLayout={tabs.PAR}
            equipmentMEC={equipmentMEC}
            disabled={readOnly}
          />
        ),
        column: 1,
        order: 4,
        summaryIcon: PartIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.PART_USAGE),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PART_USAGE),
      },
      getPartsAssociated(
        id?.code,
        "EVNT",
        !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
        getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
        1,
        30,
        "EVNT"
      ),
      {
        id: "ADDITIONALCOSTS",
        label: "Additional Costs",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        customVisibility: () =>
          isRegionAvailable("ACO", commonProps.workOrderLayout),
        render: () => (
          <AdditionalCosts
            workOrderNumber={id?.code}
            tabLayout={tabs.ACO}
            equipmentMEC={equipmentMEC}
            disabled={readOnly}
          />
        ),
        column: 1,
        order: 4,
        summaryIcon: MonetizationOnRoundedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.ADDITIONAL_COSTS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.ADDITIONAL_COSTS
        ),
      },
      {
        id: "CHILDRENWOS",
        label: "Child Work Orders",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        customVisibility: () =>
          isRegionAvailable("CWO", commonProps.workOrderLayout),
        render: () => <WorkorderChildren workorder={id?.code} />,
        column: 1,
        order: 4,
        summaryIcon: SegmentRoundedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.CHILD_WO),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHILD_WO),
      },
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EDMSDoclightIframeContainer
            objectType="J"
            objectID={id?.code}
            url={applicationData.EL_DOCLI}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 5,
        summaryIcon: FunctionsRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS
        ),
      },
      {
        id: "DOCUMENTS",
        label: "Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <Documents objectType="A" code={id?.code} entity="EVNT" />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: Article,
        ignore: isCernMode || !getTabAvailability(tabs, TAB_CODES.DOCUMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.DOCUMENTS),
      },
      {
        id: "NCRS",
        label: "NCRs",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () =>
          applicationData.EL_TBURL ? (
            <NCRIframeContainer
              objectType="J"
              objectID={id?.code}
              mode="NCR"
              url={`${applicationData.EL_TBURL}/ncr`}
              edmsDocListLink={applicationData.EL_EDMSL}
            />
          ) : (
            <AssetNCRs equipment={workorder.EQUIPMENTID?.EQUIPMENTCODE} />
          ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 6,
        summaryIcon: BookmarkBorderRoundedIcon,
        ignore:
          !isCernMode &&
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS
        ),
      },
      {
        id: "COMMENTS",
        label: "Comments",
        isVisibleWhenNewEntity: true,
        maximizable: true,
        render: () => (
          <Comments
            ref={(comments) => (commentsComponent.current = comments)}
            entityCode="EVNT"
            entityKeyCode={id?.code}
            userCode={userData.eamAccount.userCode}
            handleError={handleError}
            allowHtml={true}
            //entityOrganization={workorder.organization}
            disabled={readOnly}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: DriveFileRenameOutlineIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS),
      },
      {
        id: "ACTIVITIES",
        label: "Activities and Booked Labor",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <Activities
            workorder={id?.code}
            version={workorder.updateCount}
            department={workorder?.DEPARTMENTID?.DEPARTMENTCODE}
            departmentDesc={workorder?.DEPARTMENTID?.DEPARTMENTCODE}
            layout={tabs}
            defaultEmployee={userData.eamAccount.employeeCode}
            defaultEmployeeDesc={userData.eamAccount.employeeDesc}
            postAddActivityHandler={postAddActivityHandler}
            updateEntityProperty={updateWorkorderProperty}
            updateCount={workorder.updateCount}
            startDate={workorder.startDate}
            disabled={readOnly}
            handleError={handleError}
          />
        ),
        column: 2,
        order: 8,
        summaryIcon: PendingActions,
        ignore:
          !getTabAvailability(tabs, TAB_CODES.ACTIVITIES) &&
          !getTabAvailability(tabs, TAB_CODES.BOOK_LABOR),
        initialVisibility:
          getTabInitialVisibility(tabs, TAB_CODES.ACTIVITIES) ||
          getTabInitialVisibility(tabs, TAB_CODES.BOOK_LABOR),
      },
      {
        id: "CHECKLISTS",
        label: "Checklists",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: ({ panelQueryParams }) => (
          <Checklists
            workorder={id?.code}
            version={workorder.recordid}
            eqpToOtherId={otherIdMapping}
            printingChecklistLinkToAIS={applicationData.EL_PRTCL}
            maxExpandedChecklistItems={
              Math.abs(parseInt(applicationData.EL_MCHLS)) || 50
            }
            getWoLink={(wo) => "/workorder/" + wo}
            ref={checklists}
            showSuccess={showNotification}
            showError={showError}
            handleError={handleError}
            userCode={userData.eamAccount.userCode}
            disabled={readOnly}
            hideFollowUpProp={isHidden(
              commonProps.workOrderLayout.tabs.ACK.fields.createfollowupwo
            )}
            expandChecklistsOptions={expandChecklistsOptions}
            showFilledItems={
              panelQueryParams.CHECKLISTSshowFilledItems === "true" ||
              panelQueryParams.CHECKLISTSshowFilledItems === undefined
            }
            activity={panelQueryParams.CHECKLISTSactivity}
            register={register}
          />
        ),
        RegionPanelProps: {
          customHeadingBar: applicationData.EL_PRTCL && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <IconButton
                onClick={() =>
                  window.open(
                    applicationData.EL_PRTCL + workorder.number,
                    "_blank",
                    "noopener noreferrer"
                  )
                }
              >
                <PrintIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandChecklistsOptions(!expandChecklistsOptions);
                }}
              >
                <TuneIcon fontSize="small" />{" "}
                {expandChecklistsOptions ? (
                  <IconSlash backgroundColor="#fafafa" iconColor="#737373" />
                ) : null}
              </IconButton>
            </div>
          ),
        },
        column: 2,
        order: 9,
        summaryIcon: PlaylistAddCheckIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.CHECKLIST),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHECKLIST),
      },
      {
        id: "CUSTOMFIELDS",
        label: "Custom Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="EVNT"
            entityKeyCode={workorder.number}
            classCode={workorder.classCode}
            customFields={workorder.USERDEFINEDAREA?.CUSTOMFIELD}
            register={register}
          />
        ),
        column: 2,
        order: 10,
        summaryIcon: ListAltIcon,
        ignore: workOrderLayout.fields.block_5.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "CUSTOMFIELDSEQP",
        label: "Custom Fields Equipment",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="OBJ"
            customFields={equipment?.USERDEFINEDAREA.CUSTOMFIELD}
            register={registerCustomField(equipment)}
          />
        ),
        column: 2,
        order: 11,
        summaryIcon: ConstructionIcon,
        ignore: !isRegionAvailable(
          "CUSTOM_FIELDS_EQP",
          commonProps.workOrderLayout
        ),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "CUSTOMFIELDSPART",
        label: "Custom Fields Part",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="PART"
            customFields={equipmentPart?.USERDEFINEDAREA.CUSTOMFIELD}
            register={registerCustomField(equipmentPart)}
          />
        ),
        column: 2,
        order: 12,
        summaryIcon: HardwareIcon,
        ignore: !isRegionAvailable(
          "CUSTOM_FIELDS_PART",
          commonProps.workOrderLayout
        ),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.PARTS_ASSOCIATED
        ),
      },
      {
        id: "METERREADINGS",
        label: "Meter Readings",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <MeterReadingWO
            equipment={workorder.EQUIPMENTID.EQUIPMENTCODE}
            disabled={readOnly}
          />
        ),
        column: 2,
        order: 12,
        summaryIcon: SpeedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.METER_READINGS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.METER_READINGS
        ),
      },
      {
        id: "USERDEFINEDFIELDS",
        label: "User Defined Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <UserDefinedFields
            {...commonProps}
            entityLayout={workOrderLayout.fields}
          />
        ),
        column: 2,
        order: 10,
        summaryIcon: AssignmentIndIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      ...getTabGridRegions(
        applicationData,
        workOrderLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        workorder.number
      ),
      ...getCustomTabRegions(
        workOrderLayout.customTabs,
        screenCode,
        workorder,
        userData,
        layoutPropertiesMap
      ),
    ];
  };

  const getNextStep = (n) =>
    n
      ? (([integ, deci]) => +(integ + "." + (+(deci || 0) + 1)))(n.split("."))
      : "";

  const repeatStepHandler = async () => {
    setLoading(true);
    const fields = workOrderLayout.fields;
    const {
      customField,
      number,
      equipmentCode,
      standardWO,
      parentWO,
      departmentCode,
      locationCode,
    } = workorder;
    try {
      let value;

      try {
        const maxSWO = await getEquipmentStandardWOMaxStep(
          equipmentCode,
          standardWO
        );
        value = getNextStep(maxSWO.step);
      } catch (err) {
        value = "";
      }

      const newCustomFields = [{ code: "MTFEVP1", value }];
      const newWorkOrder = {
        standardWO,
        equipmentCode,
        customField: newCustomFields,
        statusCode: "R",
        systemStatusCode: "R",
        parentWO,
        departmentCode,
        locationCode,
        classCode: "MTF2",
      };

      createEntity(newWorkOrder);
    } catch (err) {
      showError(JSON.stringify(err), "Could not repeat step.");
    }
  };
  //
  // CALLBACKS FOR ENTITY CLASS
  //
  function postInit(wo) {
    readStatuses("", true);
    setCurrentWorkOrder(null);
    updateWorkorderProperty(
      "WORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE",
      getOrg()
    );
  }

  function postRead(workorder) {
    getEquipment(
      workorder?.EQUIPMENTID?.EQUIPMENTCODE,
      workorder?.EQUIPMENTID?.ORGANIZATIONID?.ORGANIZATIONCODE
    )
      .then((equipment) => {
        setEquipment(equipment);

        const part = equipment?.PartAssociation?.PARTID;
        if (part) {
          getPart(part.PARTCODE, part.ORGANIZATIONID.ORGANIZATIONCODE)
            .then((response) =>
              setEquipmentPart(response.body.Result.ResultData.Part)
            )
            .catch(console.error);
        }
      })
      .catch(console.error);

    updateEquipmentTreeData({
      equipment: {
        code: workorder.EQUIPMENTID.EQUIPMENTCODE,
        organization: workorder.EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE,
      },
    });
    setCurrentWorkOrder(workorder.WORKORDERID.JOBNUM);

    updateWorkorderProperty("Activities", null);
    updateWorkorderProperty("confirmincompletechecklist", "confirmed");
    readStatuses(workorder.STATUS.STATUSCODE, false);
    readOtherIdMapping(workorder.WORKORDERID.JOBNUM);
  }

  function postCopy() {
    readStatuses("", true);
    updateWorkorderProperty("ENTEREDBY", null)
    updateWorkorderProperty("CREATEDBY", null)
    updateWorkorderProperty("CREATEDDATE", null)
    let fields = workOrderLayout.fields;
    isCernMode &&
      updateWorkorderProperty(
        "STATUS.STATUSCODE",
        fields.workorderstatus.defaultValue
          ? fields.workorderstatus.defaultValue
          : "R"
      );
    isCernMode &&
      updateWorkorderProperty(
        "TYPE.TYPECODE",
        fields.workordertype.defaultValue
          ? fields.workordertype.defaultValue
          : "CD"
      );
    isCernMode && updateWorkorderProperty("COMPLETEDDATE", null);
  }

  //
  // DROP DOWN VALUES
  //
  const readStatuses = (status, newwo) => {
    WSWorkorder.getWorkOrderStatusValues(status, newwo)
      .then((response) => setStatuses(response.body.data))
      .catch(console.error);
  };

  const postAddActivityHandler = () => {
    //Refresh the activities in the checklist
    checklists.current && checklists.current.readActivities(workorder.number);
  };

  const readOtherIdMapping = (number) => {
    WSWorkorder.getWOEquipToOtherIdMapping(number)
      .then((response) => setOtherIdMapping(response.body.data))
      .catch((error) => console.error("readOtherIdMapping", error));
  };

  function mountHandler() {
    updateEquipmentTreeData({
      eqpTreeMenu: [
        {
          desc: "Use for this Work Order",
          icon: <ContentPasteIcon />,
          handler: (rowInfo) => {
            updateWorkorderProperty(
              "EQUIPMENTID.EQUIPMENTCODE",
              rowInfo.node.id
            );
          },
        },
      ],
    });
  }

  function unmountHandler() {
    updateEquipmentTreeData({ eqpTreeMenu: null });
    setCurrentWorkOrder(null);
  }

  if (!workorder || !workOrderLayout) {
    return renderLoading("Reading Work Order ...");
  }

  return (
    <div className="entityContainer">
      <BlockUi
        tag="div"
        blocking={loading}
        style={{ height: "100%", width: "100%" }}
      >
        <EamlightToolbar
          isModified={isModified}
          newEntity={newEntity}
          entityScreen={screenPermissions}
          entityName="Work Order"
          entityKeyCode={id?.code}
          organization={id?.org}
          saveHandler={saveHandler}
          newHandler={newHandler}
          deleteHandler={deleteHandler}
          width={790}
          toolbarProps={{
            entity: workorder,
            equipment: equipment,
            id,
            // postInit: this.postInit.bind(this),
            // setLayout: this.setLayout.bind(this),
            newEntity,
            applicationData: applicationData,
            userGroup: userData.eamAccount.userGroup,
            screencode: screenCode,
            copyHandler: copyHandler,
            repeatStepHandler: repeatStepHandler,
            entityDesc: "Work Order",
            entityType: ENTITY_TYPE.WORKORDER,
            screens: userData.screens,
            workorderScreencode: userData.workOrderScreen,
            departmentalSecurity: userData.eamAccount.departmentalSecurity,
          }}
          entityIcon={<ContentPasteIcon style={{ height: 18 }} />}
          regions={getRegions()}
          getUniqueRegionID={getUniqueRegionID}
          isHiddenRegion={isHiddenRegion}
          setRegionVisibility={setRegionVisibility}
          isLocalAdministrator={isLocalAdministrator(userData)}
        />
        <EntityRegions
          regions={getRegions()}
          isNewEntity={newEntity}
          getUniqueRegionID={getUniqueRegionID}
          setRegionVisibility={setRegionVisibility}
          isHiddenRegion={isHiddenRegion}
        />
      </BlockUi>
    </div>
  );
};

export default Workorder;
