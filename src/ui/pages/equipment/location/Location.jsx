import LocationIcon from "@mui/icons-material/Room";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import useEntity from "@/hooks/useEntity";
import * as React from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSLocation, { getLocation, updateLocation } from "../../../../tools/WSLocation";
import { isCernMode } from "../../../components/CERNMode";
import CustomFields from "eam-components/dist/ui/components/customfields/CustomFields";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import NCRIframeContainer from "../../../components/iframes/NCRIframeContainer";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import {
  getTabAvailability,
  getTabInitialVisibility,
  getTabGridRegions,
  renderLoading,
  getCustomTabRegions,
} from "../../EntityTools";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import LocationDetails from "./LocationDetails";
import LocationGeneral from "./LocationGeneral";
import LocationHierarchy from "./LocationHierarchy";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from "react-router-dom";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import { locationLayoutPropertiesMap } from "../EquipmentTools";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import EquipmentNCRs from "../components/EquipmentNCRs.jsx";

const customTabGridParamNames = [
  "equipmentno",
  "obj_code",
  "main_eqp_code",
  "OBJ_CODE",
  "object",
  "puobject",
];

export default Location = (props) => {
  const {
    screenLayout: locationLayout,
    entity: location,
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
    updateEntityProperty: updateEquipmentProperty,
    register,
  } = useEntity({
    WS: {
      create: WSLocation.create,
      read: getLocation,
      update: updateLocation,
      delete: WSLocation.remove,
      new: WSLocation.init,
    },
    postActions: {
      create: postCreate,
      read: postRead,
      new: postInit
    },
    entityCode: "LOC",
    entityDesc: "Location",
    entityURL: "/location/",
    entityCodeProperty: "LOCATIONID.LOCATIONCODE",
    entityOrgProperty: "LOCATIONID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "Location",
    screenProperty: "locationScreen",
    layoutProperty: "locationLayout",
    layoutPropertiesMap: locationLayoutPropertiesMap,
  });

  function postInit() {
    updateEquipmentTreeData({equipment: null});
  }

  function postRead(location) {
    updateEquipmentTreeData({equipment: location});
  }

  function postCreate(location) {
    commentsComponent.current?.createCommentForNewEntity(location.code);
  }

  const getRegions = () => {
    const tabs = locationLayout.tabs;

    const commonProps = {
      location,
      id,
      newEntity,
      locationLayout,
      updateEquipmentProperty,
      register,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <LocationGeneral {...commonProps} />,
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
        render: () => <LocationDetails {...commonProps} />,
        column: 1,
        order: 2,
        summaryIcon: AssignmentIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "HIERARCHY",
        label: "Hierarchy",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <LocationHierarchy {...commonProps} />,
        column: 1,
        order: 3,
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
            equipmentcode={location.code}
            defaultFilter={panelQueryParams.defaultFilter}
            equipmenttype="L"
          />
        ),
        column: 1,
        order: 4,
        summaryIcon: ContentPasteIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      {
        id: "HISTORY",
        label: "History",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <EquipmentHistory equipmentcode={location.code} />,
        column: 1,
        order: 5,
        summaryIcon: ManageHistoryIcon,
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EDMSDoclightIframeContainer
            objectType="L"
            objectID={location.code}
            url={applicationData.EL_DOCLI}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 6,
        summaryIcon: FunctionsRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_LOCATIONS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_LOCATIONS
        ),
      },
      {
        id: "LOCATIONNCRS",
        label: "Non Conformities",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => <EquipmentNCRs equipment={location.code}/>,
        RegionPanelProps: {
          customHeadingBar:  (
              <Link to ={`/ncr?equipmentCode=${location.code}&description=NCR for ${location.code}`}
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
      // {
      //     id: 'NCRS',
      //     label: 'NCRs',
      //     isVisibleWhenNewEntity: false,
      //     maximizable: false,
      //     render: () =>
      //         <EDMSWidget
      //             objectID={location.code}
      //             objectType="L"
      //             creationMode="NCR"
      //             edmsDocListLink={applicationData.EL_EDMSL}
      //             showError={showError}
      //             showSuccess={showSuccess} />
      //     ,
      //     column: 2,
      //     order: 7
      // },
      {
        id: "NCRS",
        label: "NCRs",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <NCRIframeContainer objectType="L" objectID={location.code} url={`${applicationData.EL_TBURL}/ncr`} edmsDocListLink={applicationData.EL_EDMSL}/>
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
            entityCode="LOC"
            entityKeyCode={!newEntity ? location.code : undefined}
            userCode={userData.eamAccount.userCode}
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
            entityLayout={locationLayout.fields}
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
            entityCode="LOC"
            entityKeyCode={location.code}
            classCode={location.classCode}
            customFields={location.customField}
            updateEntityProperty={updateEquipmentProperty}
            readonly={readOnly}
          />
        ),
        column: 2,
        order: 10,
        summaryIcon: ListAltIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      // {
      //     id: 'EQUIPMENTGRAPH',
      //     label: 'Equipment Graph',
      //     isVisibleWhenNewEntity: false,
      //     maximizable: true,
      //     render: () =>
      //         <EquipmentGraphIframe
      //             equipmentCode={location.code}
      //             equipmentGraphURL={applicationData.EL_EQGRH}
      //         />
      //     ,
      //     RegionPanelProps: {
      //         detailsStyle: { padding: 0 }
      //     },
      //     column: 2,
      //     order: 11,
      //     ignore: !isCernMode,
      //     initialVisibility: false
      // },
      ...getTabGridRegions(
        applicationData,
        locationLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        location.code
      ),
      ...getCustomTabRegions(
        locationLayout.customTabs,
        screenCode,
        location,
        userData,
        locationLayoutPropertiesMap
      )
    ];
  };

  if (!location || !locationLayout) {
    return renderLoading("Reading Location ...")
  }

  return (
    <BlockUi
      tag="div"
      blocking={loading}
      style={{ height: "100%", width: "100%" }}
    >
      <EamlightToolbar
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="Location"
        entityKeyCode={location.code}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "Location",
          entity: location,
          //postInit: this.postInit.bind(this),
          //setLayout: this.setLayout.bind(this),
          newEntity: newEntity,
          applicationData: applicationData,
          extendedLink: applicationData.EL_LOCLI,
          screencode: screenCode,
          //copyHandler: this.copyEntity.bind(this),
          entityType: ENTITY_TYPE.LOCATION,
          screens: userData.screens,
          workorderScreencode: userData.workOrderScreen,
        }}
        width={730}
        entityIcon={<LocationIcon style={{ height: 18 }} />}
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
