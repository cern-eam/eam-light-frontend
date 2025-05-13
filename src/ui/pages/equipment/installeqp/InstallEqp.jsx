import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import BlockUi from "react-block-ui";
import { createOnChangeHandler } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { IconButton } from "@mui/material";
import { FileTree } from "mdi-material-ui";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Stack from "@mui/material/Stack";
import Panel from "@/ui/components/panel/Panel";
import useEquipmentTreeStore from "../../../../state/useEquipmentTreeStore";
import useSnackbarStore from "@/state/useSnackbarStore";
import Dependency from "../components/Dependency";

export default function InstallEqp(props) {
  const [parentEq, setParentEq] = useState("");
  const [childEq, setChildEq] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [dependent, setDependent] = useState(false)
  const {equipmentTreeData: {currentRoot}, updateEquipmentTreeData} = useEquipmentTreeStore();
  const {showNotification, handleError, showError} = useSnackbarStore();
  const idPrefix = "EAMID_InstallEqp_";

  useEffect(() => {
    updateEquipmentTreeData({eqpTreeMenu: [
      {
        desc: "Use as Parent",
        icon: <KeyboardArrowUpIcon />,
        handler: (rowInfo) => {
          setParentEq(rowInfo.node.id);
        },
      },
      {
        desc: "Use as Child",
        icon: <KeyboardArrowDownIcon />,
        handler: (rowInfo) => {
          setChildEq(rowInfo.node.id);
        },
      },
    ]});
    return () => {
      updateEquipmentTreeData({eqpTreeMenu: null});
    };
  }, []);

  const createInstallEquipmentStructure = (newParent, child, dependent) => {
    return {
      newParentCode: newParent,
      childCode: child,
      dependent,
      costRollUp: true,
    };
  };

  const createDetachEquipmentStructure = (parentCode, childCode) => {
    return {
      parentCode,
      childCode,
    };
  };

  const installEqpHandler = (code) => {
    if (!parentEq || !childEq) {
      showError("Please provide the Child and Parent Equipment.");
      return;
    }

    setBlocking(true);
    if (code) {
      WSEquipment.installEquipment(code)
        .then((response) => {
          showNotification(
            `${childEq} was successfully attached to ${parentEq}`
          );
          setChildEq("");
          setDependent(false)
          updateEquipmentTreeData({equipment: currentRoot});
          setBlocking(false);
        })
        .catch((error) => {
          handleError(error);
          setBlocking(false);
        });
    }
  };

  const detachEqpHandler = (code) => {
    if (!parentEq || !childEq) {
      showError("Please provide the Child and Parent Equipment.");
      return;
    }

    setBlocking(true);
    if (code) {
      WSEquipment.detachEquipment(code)
        .then((response) => {
          showNotification(
            `${childEq} was successfully detached from ${parentEq}`
          );
          setChildEq("");
          updateEquipmentTreeData({equipment: currentRoot});
          setBlocking(false);
        })
        .catch((error) => {
          handleError(error);
          setBlocking(false);
        });
    }
  };

  const treeButtonClickHandler = (code) => {
    updateEquipmentTreeData({
      equipment: { code }, 
      showEqpTree: true });
  };

  return (
    <div id="entityContainer" style={{ height: "100%" }}>
      <BlockUi
        tag="div"
        blocking={blocking}
        style={{ height: "100%", width: "100%" }}
      >
        <div id="entityContent" style={{ height: "100%" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Panel heading="INSTALL / DETACH EQUIPMENT">
                <div style={{ width: "100%", marginTop: 0 }}>
                  <EAMAutocomplete
                    required
                    label={"Parent"}
                    value={parentEq}
                    onChange={createOnChangeHandler(
                      null,
                      null,
                      null,
                      null,
                      setParentEq
                    )}
                    autocompleteHandler={WS.autocompleteEquipment}
                    autocompleteHandlerParams={[true]}
                    barcodeScanner
                    id={`${idPrefix}PARENT`}
                    endAdornment={
                      <IconButton
                        size="small"
                        onClick={() => treeButtonClickHandler(parentEq)}
                        disabled={!parentEq}
                      >
                        <FileTree />
                      </IconButton>
                    }
                  />

                  <EAMAutocomplete
                    required
                    label={"Child"}
                    value={childEq}
                    onChange={createOnChangeHandler(
                      null,
                      null,
                      null,
                      null,
                      setChildEq
                    )}
                    autocompleteHandler={WS.autocompleteEquipment}
                    autocompleteHandlerParams={[true]}
                    renderDependencies={[dependent]}
                    barcodeScanner
                    id={`${idPrefix}CHILD`}
                    endAdornment={
                      <React.Fragment>
                        <Dependency
                          onChangeHandler={() => setDependent(!dependent)}
                          value={dependent}
                          disabled={!childEq}
                        />
                      <IconButton
                        size="small"
                        onClick={() => treeButtonClickHandler(childEq)}
                        disabled={!childEq}
                      >
                        <FileTree />
                      </IconButton>
                      </React.Fragment>
                    }
                  />

                  <Stack direction="row" spacing={2}>
                    <Button
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        installEqpHandler(
                          createInstallEquipmentStructure(parentEq, childEq, dependent)
                        )
                      }
                      variant="outlined"
                    >
                      INSTALL EQUIPMENT
                    </Button>

                    <Button
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        detachEqpHandler(
                          createDetachEquipmentStructure(parentEq, childEq)
                        )
                      }
                      variant="outlined"
                    >
                      DETACH EQUIPMENT
                    </Button>
                  </Stack>
                </div>
              </Panel>
            </Grid>
          </Grid>
        </div>
      </BlockUi>
    </div>
  );
}
