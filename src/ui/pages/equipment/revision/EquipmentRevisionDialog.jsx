import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import LightDialog from "@/ui/components/LightDialog";
import useEntity from "@/hooks/useEntity";
import ScreenContainers from "../../../layout/ScreenContainers.jsx";
import CustomFields from "../../../components/customfields/CustomFields.jsx";
import Panel from "../../../components/panel/Panel";
import { equipmentRevisionLayoutPropertiesMap } from "./EquipmentRevisionTools";
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

  return (
    <>
      <DialogTitle id="equipment-revision-dialog-title">
        Equipment Revision
      </DialogTitle>

      <DialogContent id="content">
        <BlockUi tag="div" blocking={loading}>
          {entity && screenLayout && (
            <>
              <ScreenContainers
                register={register}
                screenLayout={screenLayout}
                layoutPropertiesMap={equipmentRevisionLayoutPropertiesMap}
                containers={["cont_4", "cont_19", "cont_20"]}
              />
              <CustomFields
                customFields={entity.USERDEFINEDAREA?.CUSTOMFIELD}
                register={register}
              />
            </>
          )}
        </BlockUi>
      </DialogContent>

      <DialogActions>
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
      id="equipmentRevisionDialog"
      open={open}
      onClose={onClose}
      aria-labelledby="equipment-revision-dialog-title"
    >
      <BlockUi tag="div" blocking={initializing || !revisionIdentifier}>
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
