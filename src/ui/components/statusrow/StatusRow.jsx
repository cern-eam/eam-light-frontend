import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import LockIcon from "@mui/icons-material/Lock";
import ReportIcon from "@mui/icons-material/Report";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import {
  EISIcon,
  RadioactiveWarningIcon,
  HazardIcon
} from "eam-components/dist/ui/components/icons/index";
import { isCernMode } from "../CERNMode";
import GridWS from "eam-components/dist/ui/components/eamgrid/lib/GridWS";

async function doEquipmentGridRequest(equipmentCode, screenCode, tabName, organization) {
  if (equipmentCode && screenCode) {
    const gridRequest = {
      rowCount: 1,
      params: {
        //equipmentno: equipmentCode,
        "parameter.object": equipmentCode,
        "parameter.objorganization": organization ?? "*",
      },
      gridName: screenCode + "_" + tabName,
      userFunctionName: screenCode,
    };
    const gridData = await GridWS.getGridData(gridRequest);
    return gridData.body.data;
  }
}

const STATUS_KEYS = {
  OUT_OF_SERVICE: "OUT_OF_SERVICE",
  EIS: "EIS",
  RADIOACTIVE: "RADIOACTIVE",
  SAFETY_CONFORMITY: "SAFETY_CONFORMITY",
  LOCKED_OUT: "LOCKED_OUT",
  HAZARDOUS: "HAZARDOUS",
};

const iconStyle = {
  height: "25px",
  width: "25px",
};

const safetyConformity = {
  CONFORME: {
    icon: <CheckCircleIcon style={{ color: "green", ...iconStyle }} />,
    description: "Conform",
    tooltip: "Conform",
  },
  "CONFORME-RESERVES": {
    icon: <ReportProblemIcon style={{ color: "orange", ...iconStyle }} />,
    description: "Conform – Observations",
    tooltip: "Conform – Observations",
  },
  OBSERVATIONS: {
    icon: <ReportProblemIcon style={{ color: "orange", ...iconStyle }} />,
    description: "Conform – Observations",
    tooltip: "Conform – Observations",
  },
  "NON CONFORME": {
    icon: <ReportIcon style={{ color: "red", ...iconStyle }} />,
    description: "Non-conform",
    tooltip: "Non-conform",
  },
  "NON INSPECTE": {
    icon: <ErrorOutlinedIcon style={{ color: "orange", ...iconStyle }} />,
    description: "Not inspected",
    tooltip: "Not inspected",
  },
};

const getSafetyConformity = (entity) => {
  return safetyConformity[entity.userDefinedFields.udfchar30];
};

const STATUSES = [
  {
    key: STATUS_KEYS.OUT_OF_SERVICE,
    shouldRender: (entity, entityType) =>
      entity.outOfService === "true" || entity.outOfService === true,
    getIcon: () => <BlockIcon style={{ color: "red", ...iconStyle }} />,
    getDescription: () => "Out of Service",
    getTooltip: () => "Out of Service",
  },
  {
    key: STATUS_KEYS.EIS,
    shouldRender: (entity, entityType) =>
      isCernMode &&
      entityType === "equipment" &&
      entity.userDefinedFields.udfchkbox01 === "true",
    getIcon: () => <EISIcon style={{ color: "blue", ...iconStyle }} />,
    getDescription: () => "EIS",
    getTooltip: () => "Élément Important pour la Sécurité",
  },
  {
    key: STATUS_KEYS.RADIOACTIVE,
    shouldRender: (entity, entityType) =>
      isCernMode &&
      entityType === "equipment" &&
      entity.userDefinedFields.udfchar04 === "Radioactive",
    getIcon: () => <RadioactiveWarningIcon style={iconStyle} />,
    getDescription: () => "Radioactive",
    getTooltip: () => "Radioactive",
  },
  {
    key: STATUS_KEYS.HAZARDOUS,
    shouldRender: (entity, entityType, hasHazards) =>
      entityType === "equipment" && hasHazards,
    getIcon: () => <HazardIcon style={iconStyle} />,
    getDescription: () => "Hazardous",
    getTooltip: () => "Hazardous",
  },
  {
    key: STATUS_KEYS.SAFETY_CONFORMITY,
    shouldRender: (entity, entityType) =>
      isCernMode &&
      entityType === "equipment" &&
      getSafetyConformity(entity) !== undefined,
    getIcon: (entity) => getSafetyConformity(entity).icon,
    getDescription: (entity) => getSafetyConformity(entity).description,
    getTooltip: (entity) => getSafetyConformity(entity).tooltip,
  },
  {
    key: STATUS_KEYS.LOCKED_OUT,
    shouldRender: (entity, entityType) =>
      isCernMode &&
      entityType === "equipment" &&
      entity.userDefinedFields.udfchkbox08 === "true",
    getIcon: () => <LockIcon style={{ color: "green", ...iconStyle }} />,
    getDescription: () => "Equipment Locked-out",
    getTooltip: () => "Equipment Locked-out",
  },
];

const StatusRow = (props) => {
  const generateCells = (entity, entityType, screenCode) => {
    const [hasHazards, setHasHazards] = useState(false);
    useEffect(() => {
      const safetyData = doEquipmentGridRequest(entity.code, screenCode, "ESF", entity.organization);
      safetyData.then((data) => setHasHazards(data.records !== "0"));
    }, [entity.code]);

    return STATUSES.map((status) => {
      if (status.shouldRender(entity, entityType, hasHazards)) {
        return (
          <Tooltip key={status.key} title={status.getTooltip(entity)}>
            <div style={{ textAlign: "center", width: "80px" }}>
              {status.getIcon(entity)}
              <div style={{ fontSize: "0.75rem" }}>
                {status.getDescription(entity)}
              </div>
            </div>
          </Tooltip>
        );
      }
    });
  };

  const icons = generateCells(props.entity, props.entityType, props.screenCode);
  return (
    icons.length && (
      <div style={{ width: "100%", display: "flex", ...props.style }}>
        {icons}
      </div>
    )
  );
};

export default StatusRow;
