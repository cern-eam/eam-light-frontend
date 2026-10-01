import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import BlockUi from "react-block-ui";
import LightDialog from "@/ui/components/LightDialog";
import useEntity from "@/hooks/useEntity";
import CustomFields from "../../../components/customfields/CustomFields.jsx";
import { equipmentRevisionLayoutPropertiesMap, REVISION_BLOCKS } from "./EquipmentRevisionTools";
import {
  createEquipmentRevision,
  createEquipmentRevisionForEquipment,
  deleteEquipmentRevision,
  getEquipmentRevision,
  getEquipmentRevisionDefault,
  getEquipmentRevisionsByEquipment,
  updateEquipmentRevision,
} from "../../../../tools/WSEquipmentRevisions";
import { getOrg } from "../../../../hooks/tools";
import ScreenBlock from "../../../layout/ScreenBlock.jsx";
import RegionPanel from "../../../components/entityregions/regionpanel/RegionPanel";

const postReadEquipmentRevision = (entity, setEntity) => {
  if (!entity?.USERDEFINEDAREA?.CUSTOMFIELD) {
    return;
  }

  setEntity({
    ...entity,
    USERDEFINEDAREA: {
      ...entity.USERDEFINEDAREA,
      CUSTOMFIELD: entity.USERDEFINEDAREA.CUSTOMFIELD.filter(
        (field) => field.CUSTOMFIELDREVISIONCONTROL === "true",
      ),
    },
  });
};

const EquipmentRevisionDialogContent = ({ revisionIdentifier, onClose }) => {
  const {
    screenLayout,
    entity,
    loading,
    saveHandler,
    register,
    setEntity,
  } = useEntity({
    WS: {
      create: createEquipmentRevision,
      read: getEquipmentRevision,
      update: updateEquipmentRevision,
      delete: deleteEquipmentRevision,
      new: getEquipmentRevisionDefault,
    },
    entityDesc: "Equipment Revision",
    entityProperty: "EquipmentRevision",
    resultDefaultDataProperty: "EquipmentRevisionDefault",
    entityCodeProperty: "REVISIONID.REVISIONCODE",
    entityOrgProperty: "REVISIONID.ORGANIZATIONID.ORGANIZATIONCODE",
    screenProperty: "equipmentRevisionScreen",
    explicitIdentifier: revisionIdentifier,
    layoutPropertiesMap: equipmentRevisionLayoutPropertiesMap,
    postActions: {
      read: (revision) => postReadEquipmentRevision(revision, setEntity),
      update: onClose,
    },
    pageMode: false,
  });


  const screenContainerProps = {
    register,
    screenLayout: screenLayout,
    layoutPropertiesMap: equipmentRevisionLayoutPropertiesMap
  };

  return (
    <>
      <DialogTitle
        id="equipment-revision-dialog-title"
        style={{ flexShrink: 0 }}
      >
        Equipment Revision
      </DialogTitle>

      <DialogContent
        id="content"
        style={{
          backgroundColor: "#eeeeee",
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 8,
          paddingBottom: 4,
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        <BlockUi tag="div" blocking={loading}>
          {entity && screenLayout && (
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <RegionPanel
                  heading={(screenLayout.fields?.[REVISION_BLOCKS.GENERAL.code]?.text || "General").toUpperCase()}
                  initiallyExpanded
                >
                  <ScreenBlock {...screenContainerProps} blocks={REVISION_BLOCKS.GENERAL} />
                </RegionPanel>
                <RegionPanel
                  heading={(screenLayout.fields?.[REVISION_BLOCKS.DETAILS.code]?.text || "Details").toUpperCase()}
                  initiallyExpanded
                >
                  <ScreenBlock {...screenContainerProps} blocks={REVISION_BLOCKS.DETAILS} />
                </RegionPanel>
                <RegionPanel
                  heading={(screenLayout.fields?.[REVISION_BLOCKS.USERDEFINEDFIELDSSECTION.code]?.text || "User Defined Fields").toUpperCase()}

                >
                  <ScreenBlock {...screenContainerProps} blocks={REVISION_BLOCKS.USERDEFINEDFIELDSSECTION} />
                </RegionPanel>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RegionPanel heading={(screenLayout.fields?.[REVISION_BLOCKS.CUSTOMFIELDSSECTION.code]?.text || "Custom Fields").toUpperCase()}>
                  <CustomFields
                    customFields={entity.USERDEFINEDAREA?.CUSTOMFIELD}
                    register={register}
                  />
                </RegionPanel>
              </Grid>
            </Grid>
          )}
        </BlockUi>
      </DialogContent>

      <DialogActions style={{ backgroundColor: "#fff", flexShrink: 0 }}>
        <div>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Close
          </Button>
          <Button
            onClick={saveHandler}
            color="primary"
            disabled={loading}
            autoFocus
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </>
  );
};

const EquipmentRevisionDialog = ({ open, onClose, equipmentCode, equipmentOrg }) => {
  const [revisionIdentifier, setRevisionIdentifier] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const organization = equipmentOrg ?? getOrg();

  useEffect(() => {
    if (!open || !equipmentCode) {
      setRevisionIdentifier(null);
      return;
    }

    setInitializing(true);
    getEquipmentRevisionsByEquipment(equipmentCode)
      .then(async (response) => {
        const revisions = response.body?.data ?? [];

        if (revisions.length === 1) {
          setRevisionIdentifier(`${revisions[0].equipmentrevisioncode}#*`);
          return;
        }

        const createResponse = await createEquipmentRevisionForEquipment(
          equipmentCode,
          organization,
        );
        const equipmentRevisionId =
          createResponse.body.Result.ResultData.EQUIPMENTREVISIONID;

        setRevisionIdentifier(
          `${equipmentRevisionId.STANDARDENTITYCODE}#${equipmentRevisionId.ORGANIZATIONID.ORGANIZATIONCODE}`,
        );
      })
      .catch(console.error)
      .finally(() => setInitializing(false));
  }, [open, equipmentCode, organization]);

  if (!open) {
    return null;
  }

  return (
    <LightDialog
      fullWidth
      maxWidth="md"
      id="equipmentRevisionDialog"
      open={open}
      onClose={onClose}
      aria-labelledby="equipment-revision-dialog-title"
      PaperProps={{
        style: {
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <BlockUi
        tag="div"
        blocking={initializing || !revisionIdentifier}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {revisionIdentifier && (
          <EquipmentRevisionDialogContent
            revisionIdentifier={revisionIdentifier}
            onClose={onClose}
          />
        )}
      </BlockUi>
    </LightDialog>
  );
};

export default EquipmentRevisionDialog;
