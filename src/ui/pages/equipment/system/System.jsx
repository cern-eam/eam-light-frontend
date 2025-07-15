import useEntity from "@/hooks/useEntity";
import getPartsAssociated from "@/ui/pages/partsAssociated/PartsAssociated";
import { Article } from "@mui/icons-material";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import ShareIcon from "@mui/icons-material/Share";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import { SystemIcon } from "eam-components/dist/ui/components/icons";
import { useEffect } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { Link } from "react-router-dom";
import { createSystem, deleteSystem, getSystem, getSystemDefault, updateSystem } from "../../../../tools/WSSystems.js";
import { isCernMode } from "../../../components/CERNMode";
import CustomFields from "../../../components/customfields/CustomFields.jsx";
import Documents from "../../../components/documents/Documents.jsx";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import EquipmentGraphIframe from "../../../components/iframes/EquipmentGraphIframe";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import {
  getCustomTabRegions,
  getTabAvailability,
  getTabGridRegions,
  getTabInitialVisibility,
  renderLoading,
} from "../../EntityTools";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import EquipmentNCRs from "../components/EquipmentNCRs.jsx";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import Variables from "../components/Variables";
import {
  isClosedEquipment,
  onCategoryChange,
  systemLayoutPropertiesMap,
} from "../EquipmentTools";
import SystemDetails from "./SystemDetails";
import SystemGeneral from "./SystemGeneral";
import SystemHierarchy from "./SystemHierarchy";

const customTabGridParamNames = [
  "equipmentno",
  "obj_code",
  "main_eqp_code",
  "OBJ_CODE",
  "object",
  "puobject",
];

const System = () => {

  const {
    screenLayout: systemLayout,
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
  } = useEntity({
    WS: {
      create: createSystem,
      read: getSystem,
      update: updateSystem,
      delete: deleteSystem,
      new: getSystemDefault, // TODO: again we have extra arguments, does it perform basic functions without them?
    },
    handlers: {
      "CATEGORYID.CATEGORYCODE": (category) => onCategoryChange(category, updateEquipmentProperty)
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "System",
    entityURL: "/system/",
    entityCodeProperty: "SYSTEMID.EQUIPMENTCODE",
    entityOrgProperty: "SYSTEMID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "SystemEquipment",
    resultDataCodeProperty: "SYSTEMID.EQUIPMENTCODE",
    screenProperty: "systemScreen",
    layoutProperty: "systemLayout",
    layoutPropertiesMap: systemLayoutPropertiesMap,
  });

  useEffect( () => {
    if (id) {
      updateEquipmentTreeData({equipment: {
        code: id.code,
        organization: id.org,
        systemTypeCode: 'S'
      }});
    } else {
      updateEquipmentTreeData({equipment: null});
    }
  }, [id])

  const getEDMSObjectType = (equipment) => {
    if (
      equipment.systemTypeCode === "S" &&
      ["B", "M"].includes(equipment.typeCode)
    ) {
      return "A";
    }
    return "X";
  };

  const getRegions = () => {
    const tabs = systemLayout.tabs;

    let commonProps = {
      equipment,
      id,
      newEntity,
      systemLayout,
      userGroup: userData.eamAccount.userGroup,
      updateEquipmentProperty,
      register,
      readOnly,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <SystemGeneral
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
        render: () => <SystemDetails {...commonProps} />,
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
        ignore: systemLayout.fields.block_9.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "HIERARCHY",
        label: "Hierarchy",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <SystemHierarchy {...commonProps} />,
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
            equipmentorg={id?.org}
            screencode={screenCode}
            defaultFilter={panelQueryParams.defaultFilter}
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
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
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
            objectType={getEDMSObjectType(equipment)}
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
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_SYSTEMS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_SYSTEMS
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
        ignore: isCernMode || !getTabAvailability(tabs, TAB_CODES.DOCUMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.DOCUMENTS),
      },
            {
        id: "NCRS",
        label: "Non Conformities",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <EquipmentNCRs equipment={id?.code}/>,
        RegionPanelProps: {
          customHeadingBar:  (
              <Link to ={`/ncr?equipmentCode=${id?.code}&description=NCR for ${id?.code}`}
                    style={{padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#737373" }}>
                <AddBoxIcon />
              </Link>
          ),
        },
        column: 2,
        order: 7,
        summaryIcon: BookmarkBorderRoundedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.NONCONFORMITIES),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.NONCONFORMITIES),
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
            handleError={handleError}
            allowHtml={true}
            disabled={readOnly}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 8,
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
            entityLayout={systemLayout.fields}
            exclusions={["udfchar45"]}
            {...commonProps}
          />
        ),

        column: 2,
        order: 9,
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
        ignore: systemLayout.fields.block_4.attribute === "H",
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
          !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS
        ),
      },
      ...getTabGridRegions(
        applicationData,
        systemLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        id?.code
      ),
      ...getCustomTabRegions(
        systemLayout.customTabs,
        screenCode,
        equipment,
        userData,
        systemLayoutPropertiesMap
      ),
    ];
  };

  if (!equipment || !systemLayout) {
    return renderLoading("Reading System ...")
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
        entityName="System"
        entityKeyCode={id?.code}
        organization={id?.org}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "System", // TODO:
          entity: equipment,
          id,
          // postInit: this.postInit.bind(this),
          // setLayout: this.setLayout.bind(this),
          newEntity,
          applicationData: applicationData,
          extendedLink: applicationData.EL_SYSLI,
          screencode: screenCode,
          copyHandler,
          entityType: ENTITY_TYPE.EQUIPMENT,
          screens: userData.screens,
          workorderScreencode: userData.workOrderScreen,
        }}
        width={730}
        entityIcon={<SystemIcon style={{ height: 18 }} />}
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

export default System;
