import React from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { getLot, createLot, updateLot, deleteLot, initLot } from "../../../../tools/WSParts";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import {
  getTabAvailability,
  getTabInitialVisibility,
  getTabGridRegions,
  renderLoading,
  getCustomTabRegions,
} from "../../EntityTools";
import useEntity from "@/hooks/useEntity";

import DescriptionIcon from "@mui/icons-material/Description";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InventoryIcon from "@mui/icons-material/Inventory";
import EamlightToolbar from "../../../components/EamlightToolbar";
import CustomFields from "../../../components/customfields/CustomFields";
import StatusRow from "../../../components/statusrow/StatusRow";
import ScreenContainers from "../../../layout/ScreenContainers";
import { layoutPropertiesMap } from "./LotTools";

const customTabGridParamNames = [
  "lot",
  "lotcode",
  "LOT_CODE",
  "lot_code",
];

const Lot = () => {
  const {
    screenLayout: lotLayout,
    entity: lot,
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
    updateEntityProperty: updateLotProperty,
    register,
    handleError,
  } = useEntity({
    WS: {
      create: createLot,
      read: getLot,
      update: updateLot,
      delete: deleteLot,
      new: initLot,
    },
    postActions: {
      new: postInit,
      create: postCreate,
    },
    entityCode: "LOT",
    entityDesc: "Lot",
    entityURL: "/lot/",
    entityCodeProperty: "LOTID.LOTCODE",
    entityOrgProperty: "LOTID.ORGANIZATIONID.ORGANIZATIONCODE",
    resultDataCodeProperty: "Lot.LOTID.LOTCODE",
    entityProperty: "Lot",
    resultDefaultDataProperty: "LotDefault",
    screenProperty: "lotScreen",
    layoutProperty: "lotLayout",
    layoutPropertiesMap,
  });


  function postInit(defaultData) {
    updateLotProperty('LOTID.ORGANIZATIONID', defaultData.ORGANIZATIONID);
  }

  function postCreate() {
    commentsComponent.current?.createCommentForNewEntity();
  }



  const getRegions = () => {
    const tabs = lotLayout.tabs;

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <ScreenContainers
            register={register}
            screenLayout={lotLayout}
            layoutPropertiesMap={layoutPropertiesMap}
            ctx={{ newEntity }}
            containers={["cont_1", "cont_2", "cont_3", "cont_4"]}
            footer={
              !newEntity && (
                <StatusRow
                  entity={lot}
                  entityType={"lot"}
                  screenCode={screenCode}
                  code={id?.code}
                  org={id?.org}
                  style={{ marginTop: "10px", marginBottom: "-10px" }}
                />
              )
            }
          />
        ),
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
          <ScreenContainers
            register={register}
            screenLayout={lotLayout}
            layoutPropertiesMap={layoutPropertiesMap}
            ctx={{ newEntity }}
            containers={["cont_5", "cont_6", "cont_7"]}
          />
        ),
        column: 1,
        order: 2,
        summaryIcon: AssignmentIndIcon,
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
            entityCode="LOT"
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
        order: 3,
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
            customFields={lot.USERDEFINEDAREA?.CUSTOMFIELD}
            register={register}
          />
        ),
        column: 2,
        order: 4,
        summaryIcon: ListAltIcon,
        ignore: lotLayout.fields.block_6?.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      ...getTabGridRegions(
        applicationData,
        lotLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        id?.code
      ),
      ...getCustomTabRegions(
        lotLayout.customTabs,
        screenCode,
        lot,
        userData,
        layoutPropertiesMap
      ),
    ];
  };

  if (!lot || !lotLayout) {
    return renderLoading("Reading Lot ...");
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
          entityName="Lot"
          entityKeyCode={id?.code}
          organization={id?.org}
          saveHandler={saveHandler}
          newHandler={newHandler}
          deleteHandler={deleteHandler}
          toolbarProps={{
            entity: lot,
            id,
            newEntity: newEntity,
            applicationData: applicationData,
            screencode: screenCode,
            handleError: handleError,
            copyHandler,
            entityType: ENTITY_TYPE.LOT,
            entityDesc: "Lot",
            screens: userData.screens,
            workorderScreencode: userData.workOrderScreen,
          }}
          width={730}
          entityIcon={<InventoryIcon style={{ height: 18 }} />}
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

export default Lot;
