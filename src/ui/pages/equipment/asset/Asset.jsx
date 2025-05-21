import Comments from "eam-components/dist/ui/components/comments/Comments";
import React, { useEffect, useState } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { ENTITY_TYPE } from "../../../components/Toolbar.jsx";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import AssetDetails from "./AssetDetails";
import AssetGeneral from "./AssetGeneral";
import AssetHierarchy from "./AssetHierarchy";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from "react-router-dom";
import EquipmentGraphIframe from "../../../components/iframes/EquipmentGraphIframe";
import { isCernMode } from "../../../components/CERNMode";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import { getTabAvailability, getTabInitialVisibility, registerCustomField, getTabGridRegions, renderLoading, getCustomTabRegions } from "../../EntityTools";
import NCRIframeContainer from "../../../components/iframes/NCRIframeContainer";
import useEntity from "@/hooks/useEntity";
import { isClosedEquipment, assetLayoutPropertiesMap, onCategoryChange } from "../EquipmentTools";
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
import Article from "@mui/icons-material/Article";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HardwareIcon from "@mui/icons-material/Hardware";
import WarningIcon from "@mui/icons-material/Warning";
import Variables from "../components/Variables";
import getPartsAssociated from "@/ui/pages/partsAssociated/PartsAssociated";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import EquipmentNCRs from "../components/EquipmentNCRs.jsx";
import { createAsset, deleteAsset, getAsset, getAssetDefault, getAssetHierarchy, updateAsset } from "../../../../tools/WSAssets.js";
import CustomFields from "../../../components/customfields/CustomFields.jsx";
import Documents from "./Documents.jsx";

const customTabGridParamNames = ["equipmentno", "obj_code", "main_eqp_code", "OBJ_CODE", "object", "puobject"];

const Asset = () => {
  const [part, setPart] = useState(null);

  const {
    screenLayout: assetLayout,
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
    showNotification,
    showWarning,
    handleError,
  } = useEntity({
    WS: {
      create: createAsset,
      read: getAsset,
      update: updateAsset,
      delete: deleteAsset,
      new: getAssetDefault
    },
    handlers: {
      "CATEGORYID.CATEGORYCODE": (category) => onCategoryChange(category, updateEquipmentProperty)
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "Asset",
    entityURL: "/asset/",
    entityCodeProperty: "ASSETID.EQUIPMENTCODE",
    entityOrgProperty: "ASSETID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "AssetEquipment",
    resultDataCodeProperty: "ASSETID.EQUIPMENTCODE",
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

  useEffect( () => {
    if (id) {
      updateEquipmentTreeData({equipment: {
        code: id.code,
        organization: id.org,
        systemTypeCode: 'A'
      }});
    } else {
      updateEquipmentTreeData({equipment: null});
    }
  }, [id])

  const getRegions = () => {
    const tabs = assetLayout.tabs;

    const commonProps = {
      equipment,
      id,
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
            equipmentcode={id?.code}
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
        render: () => <EquipmentHistory equipmentcode={id?.code} />,
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
            objectCode={id?.code}
            additionalParams={Object.fromEntries([
              ["parameter.objorganization", id?.org ?? "*"],
              ["parameter.object", id?.code],
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
        render: () => <EDMSDoclightIframeContainer objectType="A" objectID={id?.code} url={applicationData.EL_DOCLI}/>,
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
        id: "DOCUMENTS",
        label: "Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <Documents objectType="A" code={id?.code} organization={id?.org} entity="OBJ"/>,
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
        render: () => <NCRIframeContainer objectType="A" objectID={id?.code} url={`${applicationData.EL_TBURL}/ncr`} edmsDocListLink={applicationData.EL_EDMSL}/>,
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
        id: "LOCATIONNCRS",
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
        ignore: !isCernMode
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
            customFields={equipment.USERDEFINEDAREA?.CUSTOMFIELD}
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
          <EquipmentGraphIframe equipmentCode={id?.code} equipmentGraphURL={applicationData.EL_EQGRH} />
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
        id?.code + '#' + id?.org,
        'OBJ',
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
        id?.code
      ),
      ...getCustomTabRegions(
        assetLayout.customTabs,
        screenCode,
        equipment,
        userData,
        assetLayoutPropertiesMap
      )
    ];
  };

  if (!equipment || !assetLayout) {
    return renderLoading("Reading Asset ...")
  }

  return (
    <BlockUi tag="div" blocking={loading} style={{ height: "100%", width: "100%" }}>
      <EamlightToolbar
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="Asset" // TODO:
        entityKeyCode={id?.code}
        organization={id?.org}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "Asset", // TODO:
          entity: equipment,
          id,
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

export default Asset;
