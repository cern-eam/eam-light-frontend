import React, { useEffect } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { createPart, deletePart, getPart, initPart, updatePart } from "../../../tools/WSParts";
import PartGeneral from "./PartGeneral";
import UserDefinedFields from "../../components/userdefinedfields/UserDefinedFields";
import PartStock from "./PartStock";
import Comments from "eam-components/dist/ui/components/comments/Comments";
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
  renderLoading,
  getCustomTabRegions,
  isMultiOrg,
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
import EamlightToolbar from "../../components/EamlightToolbar";
import CustomFields from "../../components/customfields/CustomFields";
import { getOrg } from "../../../hooks/tools";
import { Article } from "@mui/icons-material";
import Documents from "../../components/documents/Documents";
import ScreenContainer from "../../components/ScreenContainer";
import StatusRow from "../../components/statusrow/StatusRow";

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
    setRegionVisibility,
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty: updatePartProperty,
    register,
    handleError,
    showError,
    showNotification,
  } = useEntity({
    WS: {
      create: createPart,
      read: getPart,
      update: updatePart,
      delete: deletePart,
      new: initPart,
    },
    postActions: {
      create: postCreate,
    },
    handlers: {
      "PARTID.DESCRIPTION": onChangeDescription
    },
    entityCode: "PART",
    entityDesc: "Part",
    entityURL: "/part/",
    entityCodeProperty: "PARTID.PARTCODE",
    entityOrgProperty: "PARTID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "Part",
    resultDataCodeProperty: "PARTID.PARTCODE",
    resultDefaultDataProperty: "PartDefault",
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

  function onChangeDescription() {
    !isMultiOrg && updatePartProperty('PARTID.ORGANIZATIONID.ORGANIZATIONCODE', getOrg())
  }

  const getRegions = () => {
    const tabs = partLayout.tabs;

    const commonProps = {
      part,
      id,
      newEntity,
      partLayout,
      userData,
      updatePartProperty: updatePartProperty,
      register,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <ScreenContainer register={register} screenLayout={partLayout} layoutPropertiesMap={layoutPropertiesMap} ctx={{newEntity}} containers={['cont_1', 'cont_2', 'cont_3', 'cont_4']}
                       footer={!newEntity &&
                              <StatusRow entity={part} entityType={"part"} screenCode={screenCode} code={id?.code} org={id?.org} style={{ marginTop: "10px", marginBottom: "-10px" }}/>}/>, 
        //render: () => <PartGeneral {...commonProps} screenCode={screenCode} />,
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
        render: () => <PartAssets partCode={id?.code} />,
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
          <EDMSDoclightIframeContainer objectType="PART" objectID={id?.code} url={applicationData.EL_DOCLI} />
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
        id: "DOCUMENTS",
        label: "Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <Documents objectType="A" code={id?.code + '#' + id.org}entity="PART"/>,
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
        id: "COMMENTS",
        label: "Comments",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <Comments
            ref={(comments) => (commentsComponent.current = comments)}
            entityCode="PART"
            entityKeyCode={id?.code}
            entityOrganization={id?.org}
            userCode={userData.eamAccount.userCode}
            handleError={handleError}
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
            customFields={part.USERDEFINEDAREA?.CUSTOMFIELD}
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
        id?.code,
        id?.org,
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
        id?.code
      ),
      ...getCustomTabRegions(
        partLayout.customTabs,
        screenCode,
        part,
        userData,
        layoutPropertiesMap
      ),
    ];
  };

  if (!part || !partLayout) {
    return renderLoading("Reading Part ...")
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
          entityName="Part" // TODO: hardcoded (following Location example)
          entityKeyCode={id?.code}
          organization={id?.org}
          saveHandler={saveHandler}
          newHandler={newHandler}
          deleteHandler={deleteHandler}
          // TODO: check commented out props (following Location example)
          toolbarProps={{
            entity: part,
            id,
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
    </div>
  );
};

export default Part;
