import Comments from "eam-components/dist/ui/components/comments/Comments";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSEquipment from "../../../../tools/WSEquipment";
import { ENTITY_TYPE } from "../../../components/Toolbar.jsx";
import CustomFields from "eam-components/dist/ui/components/customfields/CustomFields";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EamlightToolbarContainer from "../../../components/EamlightToolbarContainer";
import AssetDetails from "./AssetDetails";
import AssetGeneral from "./AssetGeneral";
import AssetHierarchy from "./AssetHierarchy";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentPartsMadeOf from "../components/EquipmentPartsMadeOf";
import WSParts from "../../../../tools/WSParts";
import EquipmentGraphIframe from "../../../components/iframes/EquipmentGraphIframe";
import { isCernMode } from "../../../components/CERNMode";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import { getTabAvailability, getTabInitialVisibility, registerCustomField, getTabGridRegions } from "../../EntityTools";
import NCRIframeContainer from "../../../components/iframes/NCRIframeContainer";
import useEntity from "@/hooks/useEntity";
import { isClosedEquipment, assetLayoutPropertiesMap } from "../EquipmentTools";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { AssetIcon, PartIcon } from "eam-components/dist/ui/components/icons";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ShareIcon from "@mui/icons-material/Share";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HardwareIcon from "@mui/icons-material/Hardware";
import WarningIcon from "@mui/icons-material/Warning";
import { handleError } from "@/actions/uiActions";
import Variables from "../components/Variables";
import getPartsAssociated from "@/ui/pages/PartsAssociated";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";

const customTabGridParamNames = ["equipmentno", "obj_code", "main_eqp_code", "OBJ_CODE", "object", "puobject"];

const Asset = () => {
  const [part, setPart] = useState(null);
  const [statuses, setStatuses] = useState([]);

  const {
    screenLayout: assetLayout,
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
    getHiddenRegionState,
    getUniqueRegionID,
    showEqpTree,
    toggleHiddenRegion,
    setRegionVisibility,
    setLayoutProperty,
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty: updateEquipmentProperty,
    register,
    showNotification,
    showWarning,
  } = useEntity({
    WS: {
      create: WSEquipment.createEquipment,
      read: WSEquipment.getEquipment,
      update: WSEquipment.updateEquipment,
      delete: WSEquipment.deleteEquipment,
      new: WSEquipment.initEquipment.bind(null, "A"), // TODO: again we have extra arguments. What to do?
    },
    postActions: {
      read: postRead,
      new: postInit,
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "Asset",
    entityURL: "/asset/",
    entityCodeProperty: "code",
    screenProperty: "assetScreen",
    layoutProperty: "assetLayout",
    layoutPropertiesMap: assetLayoutPropertiesMap,
  });

  useEffect(() => {
    // Part input is cleared
    if (equipment?.partCode === "") {
      setPart(null);
    }
    // Part input is filled
    if (equipment?.partCode) {
      WSParts.getPart(equipment.partCode)
        .then((response) => {
          setPart(response.body.data);
        })
        .catch((error) => {
          setPart(null);
        });
    }
  }, [equipment?.partCode]);

  function postInit() {
    readStatuses(true);
    setLayoutProperty("equipment", null);
  }

  function postRead(equipment) {
    readStatuses(false, equipment.statusCode);
    if (!showEqpTree) {
      setLayoutProperty("equipment", equipment);
    }
  }

  const readStatuses = (neweqp, statusCode) => {
    WSEquipment.getEquipmentStatusValues(userData.eamAccount.userGroup, neweqp, statusCode)
      .then((response) => setStatuses(response.body.data))
      .catch(console.error);
  };

  const getRegions = () => {
    const tabs = assetLayout.tabs;

    const commonProps = {
      equipment,
      newEntity,
      assetLayout,
      updateEquipmentProperty,
      register,
      userGroup: userData.eamAccount.userGroup,
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
          <AssetGeneral
            showNotification={showNotification}
            {...commonProps}
            statuses={statuses}
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
        render: () => <AssetDetails {...commonProps} />,
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
        ignore: assetLayout.fields.block_7.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "HIERARCHY",
        label: "Hierarchy",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <AssetHierarchy {...commonProps} />,
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
            equipmenttype="A"
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
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "SAFETY",
        label: "Safety",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EAMGridTab
            gridName={"OSOBJA_ESF"}
            objectCode={equipment.code}
            additionalParams={Object.fromEntries([
              ["parameter.objorganization", "*"],
              ["parameter.object", equipment.code],
            ])}
            paramNames={["equipmentno"]}
            additionalAttributes={Object.fromEntries([["userFunctionName", "OSOBJA"]])}
          />
        ),
        column: 1,
        order: 35,
        summaryIcon: WarningIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.SAFETY),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.SAFETY),
      },
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <EDMSDoclightIframeContainer objectType="A" objectID={equipment.code} />,
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: FunctionsRoundedIcon,
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
      },
      {
        id: "NCRS",
        label: "NCRs",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <NCRIframeContainer objectType="A" objectID={equipment.code} />,
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 8,
        summaryIcon: BookmarkBorderRoundedIcon,
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
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
            entityOrganization={equipment.organization}
            handleError={handleError}
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
        render: () => <UserDefinedFields {...commonProps} entityLayout={assetLayout.fields} />,
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
        ignore: assetLayout.fields.block_6.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "PARTCUSTOMFIELDS",
        label: "Part Custom Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        customVisibility: () => part,
        render: () => {
          return (
            <CustomFields
              entityCode="PART"
              entityKeyCode={part?.code}
              classCode={part?.classCode}
              customFields={part?.customField}
              register={registerCustomField(part)}
            />
          );
        },
        column: 2,
        order: 25,
        summaryIcon: HardwareIcon,
        ignore: assetLayout.fields.block_6.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
      },
      {
        id: "EQUIPMENTGRAPH",
        label: "Equipment Graph",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EquipmentGraphIframe equipmentCode={equipment.code} equipmentGraphURL={applicationData.EL_EQGRH} />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 30,
        summaryIcon: ShareIcon,
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_ASSETS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_GRAPH_ASSETS),
      },
      getPartsAssociated(
        equipment.code,
        equipment.organization,
        !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
        getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
        2,
        31
      ),
      ...getTabGridRegions(
        applicationData,
        assetLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        equipment.code
      ),
    ];
  };

  if (!equipment) {
    return React.Fragment;
  }

  return (
    <BlockUi tag="div" blocking={loading} style={{ height: "100%", width: "100%" }}>
      <EamlightToolbarContainer
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="Asset" // TODO:
        entityKeyCode={equipment.code}
        organization={equipment.organization}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "Asset", // TODO:
          entity: equipment,
          // postInit: this.postInit.bind(this),
          // setLayout: this.setLayout.bind(this),
          newEntity,
          applicationData: applicationData,
          extendedLink: applicationData.EL_ASSLI,
          screencode: screenCode,
          copyHandler,
          entityType: ENTITY_TYPE.EQUIPMENT,
          screens: screenPermissions,
          workorderScreencode: userData.workOrderScreen,
        }}
        width={730}
        entityIcon={<AssetIcon style={{ height: 18 }} />}
        toggleHiddenRegion={toggleHiddenRegion}
        getUniqueRegionID={getUniqueRegionID}
        regions={getRegions()}
        isHiddenRegion={isHiddenRegion}
        getHiddenRegionState={getHiddenRegionState}
      />
      <EntityRegions
        showEqpTree={showEqpTree}
        regions={getRegions()}
        isNewEntity={newEntity}
        isHiddenRegion={isHiddenRegion}
        getUniqueRegionID={getUniqueRegionID}
        setRegionVisibility={setRegionVisibility}
        getHiddenRegionState={getHiddenRegionState}
      />
    </BlockUi>
  );
};

export default Asset;
