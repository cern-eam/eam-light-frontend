import React, { useState } from "react";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import CustomFields from "eam-components/dist/ui/components/customfields/CustomFields";
import WSEquipment from "../../../../tools/WSEquipment";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import PositionGeneral from "./PositionGeneral";
import PositionDetails from "./PositionDetails";
import PositionHierarchy from "./PositionHierarchy";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentPartsAssociated from "../components/EquipmentPartsAssociated";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentGraphIframe from "../../../components/iframes/EquipmentGraphIframe";
import { isCernMode } from "../../../components/CERNMode";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import {
  getTabAvailability,
  getTabInitialVisibility,
  getTabGridRegions,
  renderLoading,
} from "../../EntityTools";
import NCRIframeContainer from "../../../components/iframes/NCRIframeContainer";
import useEntity from "@/hooks/useEntity";
import {
  isClosedEquipment,
  positionLayoutPropertiesMap,
} from "../EquipmentTools";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { PositionIcon } from "eam-components/dist/ui/components/icons";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShareIcon from "@mui/icons-material/Share";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Variables from "../components/Variables";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import getPartsAssociated from "@/ui/pages/PartsAssociated";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";

const customTabGridParamNames = [
  "equipmentno",
  "position",
  "obj_code",
  "main_eqp_code",
  "OBJ_CODE",
  "object",
];

const Position = () => {

  const {
    screenLayout: positionLayout,
    entity: equipment,
    loading,
    readOnly,
    isModified,
    screenPermissions,
    screenCode,
    userData,
    applicationData,
    newEntity,
    commentsComponent,
    isHiddenRegion,
    getUniqueRegionID,
    showEqpTree,
    updateEquipmentTreeData,
    setRegionVisibility,
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty: updateEquipmentProperty,
    register,
    handleError,
    showError,
    showNotification,
    showWarning,
  } = useEntity({
    WS: {
      create: WSEquipment.createEquipment,
      read: WSEquipment.getEquipment,
      update: WSEquipment.updateEquipment,
      delete: WSEquipment.deleteEquipment,
      new: WSEquipment.initEquipment.bind(null, "P"), // TODO: again we have extra arguments. What to do?
    },
    postActions: {
      read: postRead,
      new: postInit,
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "Position",
    entityURL: "/position/",
    entityCodeProperty: "code",
    screenProperty: "positionScreen",
    layoutProperty: "positionLayout",
    layoutPropertiesMap: positionLayoutPropertiesMap,
  });

  function postInit() {
    updateEquipmentTreeData({equipment: null})
  }

  function postRead(equipment) {
    if (!showEqpTree) {
      updateEquipmentTreeData({equipment})
    }
  }

  const getRegions = () => {
    const tabs = positionLayout.tabs;

    const commonProps = {
      equipment,
      newEntity,
      positionLayout,
      userGroup: userData.eamAccount.userGroup,
      updateEquipmentProperty,
      register,
      readOnly,
      showWarning,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <PositionGeneral
            showNotification={showNotification}
            {...commonProps}
            userData={userData}
            screenCode={screenCode}
            screenPermissions={screenPermissions}
          />
        ),
        column: 1,
        order: 1,
        summaryIcon: DescriptionIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "DETAILS",
        label: "Details",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <PositionDetails {...commonProps} />,
        column: 1,
        order: 2,
        summaryIcon: AssignmentIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "VARIABLES",
        label: "Variables",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <Variables {...commonProps} />,
        column: 1,
        order: 10,
        summaryIcon: ClearAllIcon,
        ignore: positionLayout.fields.block_8.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "HIERARCHY",
        label: "Hierarchy",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <PositionHierarchy {...commonProps} />,
        column: 1,
        order: 15,
        summaryIcon: AccountTreeRoundedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "WORKORDERS",
        label: "Work Orders",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: ({ panelQueryParams }) => (
          <EquipmentWorkOrders
            equipmentcode={equipment.code}
            defaultFilter={panelQueryParams.defaultFilter}
            equipmenttype="P"
          />
        ),
        column: 1,
        order: 20,
        summaryIcon: ContentPasteIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      {
        id: "HISTORY",
        label: "History",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        render: () => <EquipmentHistory equipmentcode={equipment.code} />,
        column: 1,
        order: 25,
        summaryIcon: ManageHistoryIcon,
        ignore:  !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      getPartsAssociated(
        equipment.code,
        equipment.organization,
        !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
        getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
        1,
        30
      ),
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EDMSDoclightIframeContainer
            objectType="S"
            objectID={equipment.code}
            url={applicationData.EL_DOCLI}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: FunctionsRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_POSITIONS
        ),
      },
      {
        id: "NCRS",
        label: "NCRs",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <NCRIframeContainer objectType="S" objectID={equipment.code} url={`${applicationData.EL_TBURL}/ncr`} edmsDocListLink={applicationData.EL_EDMSL}/>
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 8,
        summaryIcon: BookmarkBorderRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_POSITIONS
        ),
      },
      {
        id: "COMMENTS",
        label: "Comments",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <Comments
            ref={(comments) => (commentsComponent.current = comments)}
            entityCode="OBJ"
            entityKeyCode={!newEntity ? equipment.code : undefined}
            userCode={userData.eamAccount.userCode}
            allowHtml={true}
            entityOrganization={equipment.organization}
            disabled={readOnly}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 9,
        summaryIcon: DriveFileRenameOutlineIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS),
      },
      {
        id: "USERDEFINEDFIELDS",
        label: "User Defined Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <UserDefinedFields
            entityLayout={positionLayout.fields}
            {...commonProps}
          />
        ),
        column: 2,
        order: 10,
        summaryIcon: AssignmentIndIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "CUSTOMFIELDS",
        label: "Custom Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="OBJ"
            entityKeyCode={equipment.code}
            classCode={equipment.classCode}
            customFields={equipment.customField}
            register={register}
          />
        ),
        column: 2,
        order: 20,
        summaryIcon: ListAltIcon,
        ignore: positionLayout.fields.block_4.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "EQUIPMENTGRAPH",
        label: "Equipment Graph",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EquipmentGraphIframe
            equipmentCode={equipment.code}
            equipmentGraphURL={applicationData.EL_EQGRH}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 25,
        summaryIcon: ShareIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_POSITIONS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EQUIPMENT_GRAPH_POSITIONS
        ),
      },
      ...getTabGridRegions(
        applicationData,
        positionLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        equipment.code
      ),
    ];
  };

  if (!equipment || !positionLayout) {
    return renderLoading("Reading Position ...")
  }

  return (
    <BlockUi
      tag="div"
      blocking={loading}
      style={{ width: "100%", height: "100%" }}
    >
      <EamlightToolbar
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="Position"
        entityKeyCode={equipment.code}
        organization={equipment.organization}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "Position",
          entity: equipment,
          // postInit: this.postInit.bind(this),
          // setLayout: this.setLayout.bind(this),
          newEntity,
          applicationData: applicationData,
          extendedLink: applicationData.EL_POSLI,
          screencode: screenCode,
          copyHandler,
          entityType: ENTITY_TYPE.EQUIPMENT,
          screens: userData.screens,
          workorderScreencode: userData.workOrderScreen,
        }}
        width={730}
        entityIcon={<PositionIcon style={{ height: 18 }} />}
        getUniqueRegionID={getUniqueRegionID}
        regions={getRegions()}
        isHiddenRegion={isHiddenRegion}
        setRegionVisibility={setRegionVisibility}
      />
      <EntityRegions
        showEqpTree={showEqpTree}
        regions={getRegions()}
        isNewEntity={newEntity}
        getUniqueRegionID={getUniqueRegionID}
        isHiddenRegion={isHiddenRegion}
        setRegionVisibility={setRegionVisibility}
      />
    </BlockUi>
  );
};

export default Position;
