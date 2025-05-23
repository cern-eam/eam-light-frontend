import React, { useEffect, useState } from "react";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import WSEquipment from "../../../../tools/WSEquipment";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import PositionGeneral from "./PositionGeneral";
import PositionDetails from "./PositionDetails";
import PositionHierarchy from "./PositionHierarchy";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
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
  getCustomTabRegions,
} from "../../EntityTools";
import NCRIframeContainer from "../../../components/iframes/NCRIframeContainer";
import useEntity from "@/hooks/useEntity";
import {
  isClosedEquipment,
  onCategoryChange,
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
import getPartsAssociated from "@/ui/pages/partsAssociated/PartsAssociated";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import { createPosition, deletePosition, getPosition, getPositionsDefault, updatePosition } from "../../../../tools/WSPositions.js";
import CustomFields from "../../../components/customfields/CustomFields.jsx";
import Documents from "../../../components/documents/Documents.jsx";
import { Article } from "@mui/icons-material";

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
    id,
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
      create: createPosition,
      read: getPosition,
      update: updatePosition,
      delete: deletePosition,
      new: getPositionsDefault, 
    },
    handlers: {
      "CATEGORYID.CATEGORYCODE": (category) => onCategoryChange(category, updateEquipmentProperty)
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "Position",
    entityURL: "/position/",
    entityCodeProperty: "POSITIONID.EQUIPMENTCODE",
    entityOrgProperty: "POSITIONID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "PositionEquipment",
    resultDataCodeProperty: "POSITIONID.EQUIPMENTCODE",
    screenProperty: "positionScreen",
    layoutProperty: "positionLayout",
    layoutPropertiesMap: positionLayoutPropertiesMap,
  });

  useEffect( () => {
    if (id) {
      updateEquipmentTreeData({equipment: {
        code: id.code,
        organization: id.org,
        systemTypeCode: 'P'
      }});
    } else {
      updateEquipmentTreeData({equipment: null});
    }
  }, [id])

  const getRegions = () => {
    const tabs = positionLayout.tabs;

    const commonProps = {
      equipment,
      id,
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
            equipmentcode={id?.code}
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
        render: () => <EquipmentHistory equipmentcode={id?.code} />,
        column: 1,
        order: 25,
        summaryIcon: ManageHistoryIcon,
        ignore:  !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      getPartsAssociated(
        id?.code + '#' + id?.org,
        'OBJ',
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
            objectID={id?.code}
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
        id: "DOCUMENTS",
        label: "Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <Documents objectType="A"code={id?.code + '#' + id.org}  entity="OBJ"/>,
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: Article,
        ignore: isCernMode
      },
      {
        id: "NCRS",
        label: "NCRs",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <NCRIframeContainer objectType="S" objectID={id?.code} url={`${applicationData.EL_TBURL}/ncr`} edmsDocListLink={applicationData.EL_EDMSL}/>
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
            entityKeyCode={id?.code}
            entityOrganization={id?.org}
            userCode={userData.eamAccount.userCode}
            allowHtml={true}
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
            customFields={equipment.USERDEFINEDAREA?.CUSTOMFIELD}
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
            equipmentCode={id?.code}
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
        id?.code
      ),
      ...getCustomTabRegions(
        positionLayout.customTabs,
        screenCode,
        equipment,
        userData,
        positionLayoutPropertiesMap
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
        entityKeyCode={id?.code}
        organization={id?.org}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "Position",
          entity: equipment,
          id,
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
