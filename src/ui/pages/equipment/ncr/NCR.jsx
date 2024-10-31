import Comments from "eam-components/dist/ui/components/comments/Comments";
import React, { useState } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSEquipment from "../../../../tools/WSEquipment.js";
import { ENTITY_TYPE } from "../../../components/Toolbar.jsx";
import EamlightToolbarContainer from "../../../components/EamlightToolbarContainer.js";
import AssetGeneral from "../asset/AssetGeneral";
import EntityRegions from "../../../components/entityregions/EntityRegions.jsx";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping.js";
import {
  getTabAvailability,
  getTabInitialVisibility,
} from "../../EntityTools.jsx";
import useEntity from "@/hooks/useEntity";
import {
  isClosedEquipment,
  assetLayoutPropertiesMap,
} from "../EquipmentTools.js";
import { AssetIcon } from "eam-components/dist/ui/components/icons";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { handleError } from "@/actions/uiActions";

const NCR = () => {
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
    WSEquipment.getEquipmentStatusValues(
      userData.eamAccount.userGroup,
      neweqp,
      statusCode
    )
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
    ];
  };

  if (!equipment) {
    return React.Fragment;
  }

  return (
    <BlockUi
      tag="div"
      blocking={loading}
      style={{ height: "100%", width: "100%" }}
    >
      <EamlightToolbarContainer
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="NCR"
        entityKeyCode={equipment.code}
        organization={equipment.organization}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "NCR",
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

export default NCR;
