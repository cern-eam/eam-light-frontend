import React, { useEffect } from "react";
import EamlightToolbarContainer from "../../components/EamlightToolbarContainer";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSParts from "../../../tools/WSParts";
import PartGeneral from "./PartGeneral";
import UserDefinedFields from "../../components/userdefinedfields/UserDefinedFields";
import PartStock from "./PartStock";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import CustomFields from "eam-components/dist/ui/components/customfields/CustomFields";
import PartWhereUsed from "./PartWhereUsed";
import PartAssets from "./PartAssets";
import PartTools, { layoutPropertiesMap } from "./PartTools";
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import { ENTITY_TYPE } from "../../components/Toolbar";
import EntityRegions from "../../components/entityregions/EntityRegions";
import { TAB_CODES } from "../../components/entityregions/TabCodeMapping";
import {
  getTabAvailability,
  getTabInitialVisibility,
  getTabGridRegions,
} from "../EntityTools";
import useEntity from "@/hooks/useEntity";

import { AssetIcon, PartIcon } from "eam-components/dist/ui/components/icons";
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PlaceIcon from "@mui/icons-material/Place";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import { isCernMode } from "@/ui/components/CERNMode";
import getPartsAssociated from "../PartsAssociated";

const customTabGridParamNames = [
  "equipmentno",
  "obj_code",
  "part",
  "PAR_CODE",
  "par_code",
  "OBJ_CODE",
  "object",
  "puobject",
];

const Part = () => {
  const {
    screenLayout: partLayout,
    entity: part,
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
    handleError,
    showError,
    showNotification,
  } = useEntity({
    WS: {
      create: WSParts.createPart,
      read: WSParts.getPart,
      update: WSParts.updatePart,
      delete: WSParts.deletePart,
      new: WSParts.initPart,
    },
    postActions: {
      create: postCreate,
    },
    entityCode: "PART",
    entityDesc: "Part",
    entityURL: "/part/",
    entityCodeProperty: "code",
    screenProperty: "partScreen",
    layoutProperty: "partLayout",
    layoutPropertiesMap,
  });

  //
  //
  //

  function postCreate() {
    commentsComponent.current.createCommentForNewEntity();
  }

  function postUpdate() {
    commentsComponent.current.createCommentForNewEntity();
  }

  const getRegions = () => {
    const tabs = partLayout.tabs;

    const commonProps = {
      part,
      newEntity,
      partLayout,
      userData,
      updatePartProperty: updateEquipmentProperty,
      register,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <PartGeneral {...commonProps} screenCode={screenCode} />,
        column: 1,
        order: 1,
        summaryIcon: DescriptionIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "USERDEFINEDFIELDS",
        label: "User Defined Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <UserDefinedFields
            entityLayout={partLayout.fields}
            {...commonProps}
          />
        ),
        column: 1,
        order: 2,
        summaryIcon: AssignmentIndIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "STOCK",
        label: "Part Stock",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <PartStock {...commonProps} applicationData={applicationData} />
        ),
        column: 1,
        order: 3,
        summaryIcon: InventoryIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.STOCK),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.STOCK),
      },
      {
        id: "WHEREUSED",
        label: "Where Used",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        render: () => <PartWhereUsed {...commonProps} />,
        column: 1,
        order: 4,
        summaryIcon: PlaceIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.WHERE_USED),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WHERE_USED),
      },
      {
        id: "ASSETS",
        label: "Assets",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <PartAssets partCode={part.code} />,
        column: 1,
        order: 5,
        summaryIcon: AssetIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.WHERE_USED),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WHERE_USED),
      },
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EDMSDoclightIframeContainer objectType="PART" objectID={part.code} />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 5,
        summaryIcon: FunctionsRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_PARTS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_PARTS
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
            entityCode="PART"
            entityKeyCode={!partLayout.newEntity ? part.code : undefined}
            userCode={userData.eamAccount.userCode}
            handleError={handleError}
            entityOrganization={part.organization}
            allowHtml={true}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 6,
        summaryIcon: DriveFileRenameOutlineIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS),
      },
      {
        id: "CUSTOMFIELDS",
        label: "Custom Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="PART"
            entityKeyCode={part.code}
            classCode={part.classCode}
            customFields={part.customField}
            updateEntityProperty={updateEquipmentProperty}
            register={register}
          />
        ),
        column: 2,
        order: 7,
        summaryIcon: ListAltIcon,
        ignore: partLayout.fields.block_6.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      getPartsAssociated(
        part.code,
        part.organization,
        !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
        getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
        2,
        8
      ),
      ...getTabGridRegions(
        applicationData,
        partLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        part.code
      ),
    ];
  };

  if (!part) {
    return React.Fragment;
  }

  return (
    <div className="entityContainer">
      <BlockUi
        tag="div"
        blocking={loading}
        style={{ height: "100%", width: "100%" }}
      >
        <EamlightToolbarContainer
          isModified={isModified}
          newEntity={newEntity}
          entityScreen={screenPermissions}
          entityName="Part" // TODO: hardcoded (following Location example)
          entityKeyCode={part.code}
          organization={part.organization}
          saveHandler={saveHandler}
          newHandler={newHandler}
          deleteHandler={deleteHandler}
          // TODO: check commented out props (following Location example)
          toolbarProps={{
            entity: part,
            // postInit: this.postInit.bind(this),
            // setLayout: this.setLayout.bind(this),
            newEntity: newEntity,
            applicationData: applicationData,
            screencode: screenCode,
            handleError: handleError,
            showNotification: showNotification,
            showError: showError,
            copyHandler,
            entityType: ENTITY_TYPE.PART,
            entityDesc: "Part", // TODO: hardcoded (following Location example)
            screens: userData.screens,
            workorderScreencode: userData.workOrderScreen,
          }}
          width={730}
          entityIcon={<PartIcon style={{ height: 18 }} />}
          toggleHiddenRegion={toggleHiddenRegion}
          getUniqueRegionID={getUniqueRegionID}
          regions={getRegions()}
          setRegionVisibility={setRegionVisibility}
          isHiddenRegion={isHiddenRegion}
        />
        <EntityRegions
          showEqpTree={showEqpTree}
          regions={getRegions()}
          isNewEntity={newEntity}
          getHiddenRegionState={getHiddenRegionState}
          getUniqueRegionID={getUniqueRegionID}
          setRegionVisibility={setRegionVisibility}
          isHiddenRegion={isHiddenRegion}
        />
      </BlockUi>
    </div>
  );
};

export default Part;
