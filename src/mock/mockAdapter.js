// Standalone Mock Network Adapter for EAM Light
import {
  mockUser,
  mockApplicationData,
  mockScreenLayoutWSJOBS,
  mockScreenLayoutOSOBJS,
  mockScreenLayoutOSOBJA,
  mockScreenLayoutOSOBJP,
  mockScreenLayoutSSPART,
  mockScreenLayoutSSLOT,
} from "./mockData";
import { mockDb, extractCode } from "./mockDb";

const createResponse = (config, data, status = 200, statusText = "OK") => ({
  data,
  status,
  statusText,
  headers: { "content-type": "application/json" },
  config,
});

/**
 * Builds standard EAM grid response supporting both EAMGrid and native transformNativeResponse
 */
const buildGridPayload = (gridName, rows, fields, dataSpyList = null) => {
  const rowCount = rows.length;
  const dataspies = dataSpyList || [{ code: "ALL", description: "All Records" }];

  return {
    status: "SUCCESS",
    data: {
      gridCode: gridName,
      gridName: gridName,
      dataSpyId: "ALL",
      records: String(rowCount),
      moreRowsPresent: "FALSE",
      cursorPosition: 1,
      gridDataspy: dataspies,
      gridField: fields,
      gridHeader: fields,
      row: rows,
      rows: rows,
    },
    Result: {
      ResultData: {
        METADATA: {
          TOTALRECORDS: rowCount,
          DATAENTITYNAME: gridName,
          CURRENTCURSORPOSITION: 1,
          NEXTCURSORPOSITION: 1,
        },
        DATARECORD: rows.map((r) => ({
          DATAFIELD: r.cell.map((c) => ({
            FIELDNAME: c.t || c.target,
            FIELDVALUE: String(c.value ?? c.val ?? c.content ?? ""),
            DATATYPE: c.dataType || "VARCHAR",
          })),
        })),
      },
    },
  };
};

export const mockAdapterHandler = async (cfg) => {
  const url = cfg.url || "";
  const method = (cfg.method || "get").toLowerCase();

  let reqBody = cfg.data;
  if (typeof reqBody === "string") {
    try {
      reqBody = JSON.parse(reqBody);
    } catch (_e) {
      // ignore parsing error
    }
  }

  // 1. GET /users (Session verification & user profile)
  if (
    method === "get" &&
    url.includes("/users") &&
    !url.includes("/users/screenlayout") &&
    !url.includes("/autocomplete/users") &&
    !url.includes("/users/impersonate")
  ) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: mockUser,
    });
  }

  // 2. GET /application/applicationdata
  if (method === "get" && url.includes("/application/applicationdata")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: mockApplicationData,
    });
  }

  // GET /application/refreshCache
  if (method === "get" && url.includes("/application/refreshCache")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: "Cache refreshed successfully (Mock)",
    });
  }

  // 3. Screen Layout Engine: GET /users/screenlayout/:userGroup/:entity/:systemFunction/:userFunction
  if (method === "get" && url.includes("/users/screenlayout/")) {
    const isCLO = url.includes("tabname=CLO");
    let layout = mockScreenLayoutWSJOBS;

    if (url.includes("OSOBJS")) {
      layout = mockScreenLayoutOSOBJS;
    } else if (url.includes("OSOBJA")) {
      layout = mockScreenLayoutOSOBJA;
    } else if (url.includes("OSOBJP")) {
      layout = mockScreenLayoutOSOBJP;
    } else if (url.includes("SSPART")) {
      layout = mockScreenLayoutSSPART;
    } else if (url.includes("SSLOT")) {
      layout = mockScreenLayoutSSLOT;
    } else {
      // WSJOBS (Work orders)
      layout = {
        ...mockScreenLayoutWSJOBS,
        fields: {
          ...mockScreenLayoutWSJOBS.fields,
          block_1: { attribute: "O", text: "General" },
          block_2: { attribute: "O", text: "Work Order Details" },
          block_4: { attribute: "O", text: "Scheduling" },
          block_9: { attribute: "O", text: "Production Details" },
        },
        tabs: {
          ...mockScreenLayoutWSJOBS.tabs,
          CLO: {
            tabAvailable: true,
            alwaysDisplayed: true,
            tabDescription: "Closing Codes",
            fields: {
              block_2: { attribute: "O", text: "Closing Codes" },
              clo_block_2: { attribute: "O", text: "Closing Codes" },
            },
          },
        },
      };

      if (isCLO) {
        layout.tabs.CLO.fields = {
          block_2: { attribute: "O", text: "Closing Codes" },
          clo_block_2: { attribute: "O", text: "Closing Codes" },
        };
      }
    }

    return createResponse(cfg, {
      status: "SUCCESS",
      data: layout,
    });
  }

  // 4. WORK ORDERS CRUD & DEFAULTS
  // Defaults
  if (method === "post" && url.includes("/proxy/workorderdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          WorkOrder: {
            WORKORDERID: {
              JOBNUM: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "R" },
            TYPE: { TYPECODE: "CORR" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            PRIORITY: { PRIORITYCODE: "M" },
            EQUIPMENTID: {
              EQUIPMENTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            },
            SCHEDSTARTDATE: new Date().toISOString(),
            SCHEDENDDATE: new Date(Date.now() + 86400000).toISOString(),
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // GET single work order: /proxy/workorders/:id or /workorders/:id
  const woGetMatch = url.match(/(?:\/proxy)?\/workorders\/([^/?#]+)/);
  if (method === "get" && woGetMatch) {
    const code = extractCode(woGetMatch[1]);
    const found = mockDb.getWorkOrder(code);
    if (found) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            WorkOrder: found,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Work Order ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create work order: /proxy/workorders/ or /workorders/
  if (method === "post" && (url.endsWith("/workorders") || url.endsWith("/workorders/"))) {
    const payload = reqBody?.WorkOrder || reqBody || {};
    const jobNum = payload.WORKORDERID?.JOBNUM || `WO-${String(Date.now()).slice(-4)}`;
    const newWo = {
      ...payload,
      WORKORDERID: {
        ...(payload.WORKORDERID || {}),
        JOBNUM: jobNum,
        ORGANIZATIONID: payload.WORKORDERID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
    };
    mockDb.saveWorkOrder(newWo);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          JOBNUM: jobNum,
          WorkOrder: newWo,
        },
        InfoAlert: { Message: `Work Order ${jobNum} created successfully.` },
      },
    });
  }

  // PUT update work order: /proxy/workorders/ or /workorders/
  if (method === "put" && (url.endsWith("/workorders") || url.endsWith("/workorders/"))) {
    const payload = reqBody?.WorkOrder || reqBody || {};
    const jobNum = payload.WORKORDERID?.JOBNUM;
    const updated = mockDb.saveWorkOrder(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          JOBNUM: jobNum,
          WorkOrder: updated,
        },
        InfoAlert: { Message: `Work Order ${jobNum} updated successfully.` },
      },
    });
  }

  // DELETE work order: /proxy/workorders/:id or /workorders/:id
  if (method === "delete" && woGetMatch) {
    const code = extractCode(woGetMatch[1]);
    mockDb.deleteWorkOrder(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Work Order ${code} deleted successfully.` },
      },
    });
  }

  // 4b. WORK ORDER ACTIVITIES
  if (
    url.includes("/activities/read") ||
    (method === "get" && url.match(/(?:\/proxy)?\/workorders\/([^/?#]+)\/activities(?:\/|$)/))
  ) {
    let woCode = "";
    const match = url.match(/(?:\/proxy)?\/workorders\/([^/?#]+)\/activities/);
    if (match) {
      woCode = extractCode(match[1]);
    } else {
      const urlObj = new URL(url, "http://localhost");
      woCode = extractCode(urlObj.searchParams.get("workorder") || "WO-1001");
    }

    const activities = mockDb.getWorkOrderActivities(woCode);
    const dataRecords = activities.map((act) => ({
      ACTIVITYID: {
        ACTIVITYCODE: { value: act.activityCode },
        ACTIVITYNOTE: act.activityNote,
        WORKORDERID: { JOBNUM: act.workOrderNumber },
      },
      PERSONS: act.peopleRequired,
      ESTIMATEDHOURS: act.estimatedHours,
      HOURSREMAINING: act.hoursRemaining,
      ACTIVITYSTARTDATE: act.startDate,
      ACTIVITYENDDATE: act.endDate,
      TASKSID: {
        TASKCODE: act.taskCode,
        DESCRIPTION: act.taskDesc,
      },
      TRADEID: { TRADECODE: act.tradeCode },
    }));

    return createResponse(cfg, {
      status: "SUCCESS",
      data: activities,
      Result: {
        ResultData: {
          DATARECORD: dataRecords,
        },
      },
    });
  }

  // 4c. INTERACTIVE CHECKLISTS
  // GET /checklists?workorder=:woCode&activity=:act
  if (method === "get" && url.includes("/checklists") && !url.includes("/definition")) {
    const urlObj = new URL(url, "http://localhost");
    const woCode = extractCode(urlObj.searchParams.get("workorder") || "WO-1001");
    const actCode = urlObj.searchParams.get("activity");
    const items = mockDb.getWorkOrderChecklists(woCode, actCode);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: items,
      Result: {
        ResultData: items,
      },
    });
  }

  // PUT /checklists/ or /checklists?taskPlanCode=...
  if (method === "put" && url.includes("/checklists")) {
    const item = reqBody || {};
    const updatedItem = mockDb.saveChecklistItem(item);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: updatedItem,
      Result: {
        ResultData: updatedItem,
        InfoAlert: { Message: "Checklist updated successfully." },
      },
    });
  }

  // 5. ASSETS CRUD & DEFAULTS
  // Defaults
  if (method === "post" && url.includes("/proxy/assetdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          AssetEquipment: {
            ASSETID: {
              EQUIPMENTCODE: null,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            AssetParentHierarchy: {},
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // Hierarchy
  if (method === "post" && url.includes("/proxy/assetparenthierarchy")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          AssetParentHierarchy: {},
        },
      },
    });
  }

  // GET single asset: /proxy/assets/:id or /assets/:id
  const astGetMatch = url.match(/(?:\/proxy)?\/assets\/([^/?#]+)/);
  if (method === "get" && astGetMatch) {
    const code = extractCode(astGetMatch[1]);
    const found = mockDb.getAsset(code);
    if (found) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            AssetEquipment: {
              ...found,
              AssetParentHierarchy: {},
            },
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Asset ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create asset
  if (method === "post" && (url.endsWith("/assets") || url.endsWith("/assets/"))) {
    const payload = reqBody?.AssetEquipment || reqBody || {};
    const code = payload.ASSETID?.EQUIPMENTCODE || `AST-${String(Date.now()).slice(-3)}`;
    const newAst = {
      ...payload,
      ASSETID: {
        ...(payload.ASSETID || {}),
        EQUIPMENTCODE: code,
        ORGANIZATIONID: payload.ASSETID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "A",
    };
    mockDb.saveAsset(newAst);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          ASSETID: { EQUIPMENTCODE: code },
          AssetEquipment: newAst,
        },
        InfoAlert: { Message: `Asset ${code} created successfully.` },
      },
    });
  }

  // PUT update asset
  if (method === "put" && (url.endsWith("/assets") || url.endsWith("/assets/"))) {
    const payload = reqBody?.AssetEquipment || reqBody || {};
    const code = payload.ASSETID?.EQUIPMENTCODE;
    const updated = mockDb.saveAsset(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          ASSETID: { EQUIPMENTCODE: code },
          AssetEquipment: updated,
        },
        InfoAlert: { Message: `Asset ${code} updated successfully.` },
      },
    });
  }

  // DELETE asset
  if (method === "delete" && astGetMatch) {
    const code = extractCode(astGetMatch[1]);
    mockDb.deleteAsset(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Asset ${code} deleted successfully.` },
      },
    });
  }

  // 6. SYSTEMS CRUD & DEFAULTS
  // Defaults
  if (method === "post" && url.includes("/proxy/systemdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          SystemEquipmentDefault: {
            SYSTEMID: {
              EQUIPMENTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            systemTypeCode: "S",
            SystemParentHierarchy: {},
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // Hierarchy
  if (method === "post" && url.includes("/proxy/systemparenthierarchy")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          SystemParentHierarchy: {},
        },
      },
    });
  }

  // GET single system
  const sysGetMatch = url.match(/(?:\/proxy)?\/systems\/([^/?#]+)/);
  if (method === "get" && sysGetMatch) {
    const code = extractCode(sysGetMatch[1]);
    const found = mockDb.getSystem(code);
    if (found) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            SystemEquipment: {
              ...found,
              SystemParentHierarchy: {},
            },
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `System ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create system
  if (method === "post" && (url.endsWith("/systems") || url.endsWith("/systems/"))) {
    const payload = reqBody?.SystemEquipment || reqBody || {};
    const eqCode = payload.SYSTEMID?.EQUIPMENTCODE || `SYS-${String(Date.now()).slice(-2)}`;
    const newSys = {
      ...payload,
      SYSTEMID: {
        ...(payload.SYSTEMID || {}),
        EQUIPMENTCODE: eqCode,
        ORGANIZATIONID: payload.SYSTEMID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "S",
    };
    mockDb.saveSystem(newSys);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          SYSTEMID: { EQUIPMENTCODE: eqCode },
          SystemEquipment: newSys,
        },
        InfoAlert: { Message: `System ${eqCode} created successfully.` },
      },
    });
  }

  // PUT update system
  if (method === "put" && (url.endsWith("/systems") || url.endsWith("/systems/"))) {
    const payload = reqBody?.SystemEquipment || reqBody || {};
    const eqCode = payload.SYSTEMID?.EQUIPMENTCODE;
    const updated = mockDb.saveSystem(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          SYSTEMID: { EQUIPMENTCODE: eqCode },
          SystemEquipment: updated,
        },
        InfoAlert: { Message: `System ${eqCode} updated successfully.` },
      },
    });
  }

  // DELETE system
  if (method === "delete" && sysGetMatch) {
    const code = extractCode(sysGetMatch[1]);
    mockDb.deleteSystem(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `System ${code} deleted successfully.` },
      },
    });
  }

  // 6b. POSITIONS CRUD & DEFAULTS
  if (method === "post" && url.includes("/proxy/positiondefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          PositionEquipmentDefault: {
            POSITIONID: {
              EQUIPMENTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            TYPE: { TYPECODE: "P" },
            systemTypeCode: "P",
            PositionParentHierarchy: {},
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  if (url.includes("/proxy/positionparenthierarchy")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          PositionParentHierarchy: {},
        },
      },
    });
  }

  // GET single position
  const posGetMatch = url.match(/(?:\/proxy)?\/positions\/([^/?#]+)/);
  if (method === "get" && posGetMatch) {
    const code = extractCode(posGetMatch[1]);
    const found = mockDb.getPosition(code);
    if (found) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            PositionEquipment: {
              ...found,
              PositionParentHierarchy: {},
            },
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Position ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create position
  if (method === "post" && (url.endsWith("/positions") || url.endsWith("/positions/"))) {
    const payload = reqBody?.PositionEquipment || reqBody || {};
    const eqCode = payload.POSITIONID?.EQUIPMENTCODE || `POS-${String(Date.now()).slice(-2)}`;
    const newPos = {
      ...payload,
      POSITIONID: {
        ...(payload.POSITIONID || {}),
        EQUIPMENTCODE: eqCode,
        ORGANIZATIONID: payload.POSITIONID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "P",
    };
    mockDb.savePosition(newPos);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          POSITIONID: { EQUIPMENTCODE: eqCode },
          PositionEquipment: newPos,
        },
        InfoAlert: { Message: `Position ${eqCode} created successfully.` },
      },
    });
  }

  // PUT update position
  if (method === "put" && (url.endsWith("/positions") || url.endsWith("/positions/"))) {
    const payload = reqBody?.PositionEquipment || reqBody || {};
    const eqCode = payload.POSITIONID?.EQUIPMENTCODE;
    const updated = mockDb.savePosition(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          POSITIONID: { EQUIPMENTCODE: eqCode },
          PositionEquipment: updated,
        },
        InfoAlert: { Message: `Position ${eqCode} updated successfully.` },
      },
    });
  }

  // DELETE position
  if (method === "delete" && posGetMatch) {
    const code = extractCode(posGetMatch[1]);
    mockDb.deletePosition(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Position ${code} deleted successfully.` },
      },
    });
  }

  // 7. PARTS & LOTS (Parent & Child routes)
  // Defaults
  if (method === "post" && url.includes("/proxy/partdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          Part: {
            PARTID: {
              PARTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            UOM: "EA",
            TRACKINGBYASSET: false,
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  if (method === "post" && url.includes("/proxy/lotdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          LotDefault: {
            LOTID: {
              LOTCODE: "",
              PARTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            QTY: 0,
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // Child route: /parts/:part/lots/:lot
  const partLotMatch = url.match(/(?:\/proxy)?\/parts\/([^/?#]+)\/lots\/([^/?#]+)/);
  if (method === "get" && partLotMatch) {
    const partCode = extractCode(partLotMatch[1]);
    const lotCode = extractCode(partLotMatch[2]);
    const foundLot = mockDb.getPartLot(partCode, lotCode);
    if (foundLot) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Lot: foundLot,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Lot ${lotCode} for part ${partCode} not found` }] }, 404, "Not Found"),
    });
  }

  // Single lot route: /lots/:id
  const lotGetMatch = url.match(/(?:\/proxy)?\/lots\/([^/?#]+)/);
  if (method === "get" && lotGetMatch) {
    const code = extractCode(lotGetMatch[1]);
    const foundLot = mockDb.getLot(code);
    if (foundLot) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Lot: foundLot,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Lot ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create lot
  if (method === "post" && (url.endsWith("/lots") || url.endsWith("/lots/"))) {
    const payload = reqBody?.Lot || reqBody || {};
    const lotCode = payload.LOTID?.LOTCODE || `LOT-${String(Date.now()).slice(-3)}`;
    const newLot = {
      ...payload,
      LOTID: {
        ...(payload.LOTID || {}),
        LOTCODE: lotCode,
        ORGANIZATIONID: payload.LOTID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
    };
    mockDb.saveLot(newLot);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          LOTCODE: lotCode,
          Lot: newLot,
        },
        InfoAlert: { Message: `Lot ${lotCode} created successfully.` },
      },
    });
  }

  // PUT update lot
  if (method === "put" && (url.endsWith("/lots") || url.endsWith("/lots/"))) {
    const payload = reqBody?.Lot || reqBody || {};
    const lotCode = payload.LOTID?.LOTCODE;
    const updated = mockDb.saveLot(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          LOTCODE: lotCode,
          Lot: updated,
        },
        InfoAlert: { Message: `Lot ${lotCode} updated successfully.` },
      },
    });
  }

  // DELETE lot
  if (method === "delete" && lotGetMatch) {
    const code = extractCode(lotGetMatch[1]);
    mockDb.deleteLot(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Lot ${code} deleted successfully.` },
      },
    });
  }

  // GET single part
  const partGetMatch = url.match(/(?:\/proxy)?\/parts\/([^/?#]+)/);
  if (method === "get" && partGetMatch && !url.includes("/lots/")) {
    const code = extractCode(partGetMatch[1]);
    const foundPart = mockDb.getPart(code);
    if (foundPart) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Part: foundPart,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(cfg, { ErrorAlert: [{ Message: `Part ${code} not found` }] }, 404, "Not Found"),
    });
  }

  // POST create part
  if (method === "post" && (url.endsWith("/parts") || url.endsWith("/parts/"))) {
    const payload = reqBody?.Part || reqBody || {};
    const partCode = payload.PARTID?.PARTCODE || `PRT-${String(Date.now()).slice(-3)}`;
    const newPart = {
      ...payload,
      PARTID: {
        ...(payload.PARTID || {}),
        PARTCODE: partCode,
        ORGANIZATIONID: payload.PARTID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
    };
    mockDb.savePart(newPart);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          PARTCODE: partCode,
          Part: newPart,
        },
        InfoAlert: { Message: `Part ${partCode} created successfully.` },
      },
    });
  }

  // PUT update part
  if (method === "put" && (url.endsWith("/parts") || url.endsWith("/parts/"))) {
    const payload = reqBody?.Part || reqBody || {};
    const partCode = payload.PARTID?.PARTCODE;
    const updated = mockDb.savePart(payload);
    return createResponse(cfg, {
      Result: {
        ResultData: {
          PARTCODE: partCode,
          Part: updated,
        },
        InfoAlert: { Message: `Part ${partCode} updated successfully.` },
      },
    });
  }

  // DELETE part
  if (method === "delete" && partGetMatch) {
    const code = extractCode(partGetMatch[1]);
    mockDb.deletePart(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Part ${code} deleted successfully.` },
      },
    });
  }

  // 8. GRIDS & AUTOCOMPLETE LOVs (GET & POST)
  if (
    url.includes("/grids") ||
    url.includes("/proxy/grids") ||
    url.includes("/grids/data")
  ) {
    const gridName = reqBody?.gridName || reqBody?.gridID || "";

    // A. Work Orders Search Table
    if (gridName === "WSJOBS") {
      const items = mockDb.getWorkOrders();
      const fields = [
        { name: "workordernum", label: "Work Order", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "equipment", label: "Equipment", order: 3, width: 140, dataType: "VARCHAR" },
        { name: "workorderstatus_display", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "workordertype_display", label: "Type", order: 5, width: 120, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 6, width: 100, dataType: "VARCHAR" },
        { name: "priority_display", label: "Priority", order: 7, width: 100, dataType: "VARCHAR" },
        { name: "schedstartdate", label: "Sched. Start", order: 8, width: 140, dataType: "DATE" },
      ];

      const rows = items.map((wo) => ({
        id: wo.WORKORDERID?.JOBNUM,
        cell: [
          { t: "workordernum", val: wo.WORKORDERID?.JOBNUM, value: wo.WORKORDERID?.JOBNUM, order: 1 },
          { t: "description", val: wo.WORKORDERID?.DESCRIPTION, value: wo.WORKORDERID?.DESCRIPTION, order: 2 },
          { t: "equipment", val: wo.EQUIPMENTID?.EQUIPMENTCODE, value: wo.EQUIPMENTID?.EQUIPMENTCODE, order: 3 },
          { t: "workorderstatus_display", val: wo.STATUS?.DESCRIPTION || "Released", value: wo.STATUS?.DESCRIPTION || "Released", order: 4 },
          { t: "workordertype_display", val: wo.TYPE?.DESCRIPTION || "Corrective", value: wo.TYPE?.DESCRIPTION || "Corrective", order: 5 },
          { t: "department", val: wo.DEPARTMENTID?.DEPARTMENTCODE || "*", value: wo.DEPARTMENTID?.DEPARTMENTCODE || "*", order: 6 },
          { t: "priority_display", val: wo.PRIORITY?.DESCRIPTION || "Medium", value: wo.PRIORITY?.DESCRIPTION || "Medium", order: 7 },
          { t: "schedstartdate", val: wo.SCHEDSTARTDATE ? wo.SCHEDSTARTDATE.slice(0, 10) : "", value: wo.SCHEDSTARTDATE ? wo.SCHEDSTARTDATE.slice(0, 10) : "", order: 8 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("WSJOBS", rows, fields));
    }

    // B. Assets Search Table
    if (gridName === "OSOBJA") {
      const items = mockDb.getAssets();
      const fields = [
        { name: "equipmentno", label: "Equipment", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "assetstatus", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "organization", label: "Organization", order: 5, width: 100, dataType: "VARCHAR" },
      ];

      const rows = items.map((ast) => ({
        id: ast.ASSETID?.EQUIPMENTCODE,
        cell: [
          { t: "equipmentno", val: ast.ASSETID?.EQUIPMENTCODE, value: ast.ASSETID?.EQUIPMENTCODE, order: 1 },
          { t: "equipmentdesc", val: ast.ASSETID?.DESCRIPTION, value: ast.ASSETID?.DESCRIPTION, order: 2 },
          { t: "department", val: ast.DEPARTMENTID?.DEPARTMENTCODE || "*", value: ast.DEPARTMENTID?.DEPARTMENTCODE || "*", order: 3 },
          { t: "assetstatus", val: ast.STATUS?.DESCRIPTION || "In Service", value: ast.STATUS?.DESCRIPTION || "In Service", order: 4 },
          { t: "organization", val: ast.ASSETID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*", value: ast.ASSETID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*", order: 5 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSOBJA", rows, fields));
    }

    // C. Systems Search Table
    if (gridName === "OSOBJS" || gridName.includes("SYS")) {
      const items = mockDb.getSystems();
      const fields = [
        { name: "equipmentno", label: "System", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "assetstatus", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "organization", label: "Organization", order: 5, width: 100, dataType: "VARCHAR" },
      ];

      const rows = items.map((sys) => ({
        id: sys.SYSTEMID?.EQUIPMENTCODE,
        cell: [
          { t: "equipmentno", val: sys.SYSTEMID?.EQUIPMENTCODE, value: sys.SYSTEMID?.EQUIPMENTCODE, order: 1 },
          { t: "equipmentdesc", val: sys.SYSTEMID?.DESCRIPTION, value: sys.SYSTEMID?.DESCRIPTION, order: 2 },
          { t: "department", val: sys.DEPARTMENTID?.DEPARTMENTCODE || "*", value: sys.DEPARTMENTID?.DEPARTMENTCODE || "*", order: 3 },
          { t: "assetstatus", val: sys.STATUS?.DESCRIPTION || "In Service", value: sys.STATUS?.DESCRIPTION || "In Service", order: 4 },
          { t: "organization", val: sys.SYSTEMID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*", value: sys.SYSTEMID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*", order: 5 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSOBJS", rows, fields));
    }

    // D. Statuses LOV (BSAUTH_HDR)
    if (gridName === "BSAUTH_HDR") {
      const statusOptions = [
        { tostatus: "R", tostatusdesc: "Released", fromstatusdesc: "Released" },
        { tostatus: "C", tostatusdesc: "Completed", fromstatusdesc: "Released" },
        { tostatus: "I", tostatusdesc: "In Service", fromstatusdesc: "In Service" },
        { tostatus: "O", tostatusdesc: "Out of Service", fromstatusdesc: "In Service" },
      ];
      const rows = statusOptions.map((s, idx) => ({
        id: `ST_${idx}`,
        cell: [
          { t: "tostatus", val: s.tostatus, value: s.tostatus, order: 1 },
          { t: "tostatusdesc", val: s.tostatusdesc, value: s.tostatusdesc, order: 2 },
          { t: "fromstatusdesc", val: s.fromstatusdesc, value: s.fromstatusdesc, order: 3 },
        ],
      }));
      return createResponse(cfg, buildGridPayload("BSAUTH_HDR", rows, [
        { name: "tostatus", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "tostatusdesc", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
      ]));
    }

    // E. User Codes LOV (BSUCOD_HDR) - types, priorities, criticality
    if (gridName === "BSUCOD_HDR" || gridName === "LVCRIT") {
      const userCodes = [
        { usercode: "CORR", systemcode: "CORR", usercodedescription: "Corrective" },
        { usercode: "PREV", systemcode: "PREV", usercodedescription: "Preventive" },
        { usercode: "MODIF", systemcode: "MODIF", usercodedescription: "Modification" },
        { usercode: "H", systemcode: "H", usercodedescription: "High" },
        { usercode: "M", systemcode: "M", usercodedescription: "Medium" },
        { usercode: "L", systemcode: "L", usercodedescription: "Low" },
        { usercode: "A", systemcode: "A", usercodedescription: "Critical A" },
        { usercode: "B", systemcode: "B", usercodedescription: "Medium B" },
        { usercode: "C", systemcode: "C", usercodedescription: "Low C" },
      ];
      const rows = userCodes.map((c, idx) => ({
        id: `UC_${idx}`,
        cell: [
          { t: "usercode", val: c.usercode, value: c.usercode, order: 1 },
          { t: "systemcode", val: c.systemcode, value: c.systemcode, order: 2 },
          { t: "usercodedescription", val: c.usercodedescription, value: c.usercodedescription, order: 3 },
        ],
      }));
      return createResponse(cfg, buildGridPayload("BSUCOD_HDR", rows, [
        { name: "usercode", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "usercodedescription", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
      ]));
    }

    // F. Departments LOV (LVMRCS)
    if (gridName === "LVMRCS" || gridName === "LVMORCS") {
      const depts = [
        { department: "*", des_text: "General Department" },
        { department: "ELECT", des_text: "Electrical Engineering" },
        { department: "MECH", des_text: "Mechanical Engineering" },
        { department: "HVAC", des_text: "Ventilation & Cooling" },
      ];
      const rows = depts.map((d, idx) => ({
        id: `DEP_${idx}`,
        cell: [
          { t: "department", val: d.department, value: d.department, order: 1 },
          { t: "des_text", val: d.des_text, value: d.des_text, order: 2 },
        ],
      }));
      return createResponse(cfg, buildGridPayload("LVMRCS", rows, [
        { name: "department", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "des_text", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
      ]));
    }

    // G. Generic / Fallback Grid LOV
    const defaultFallbackCells = [
      { t: "code", val: "MOCK1", value: "MOCK1", order: 1 },
      { t: "description", val: "Option 1", value: "Option 1", order: 2 },
      { t: "trackingtype", val: "LOT", value: "LOT", order: 3 },
      { t: "bot_fld1", val: "DTSAVE", value: "DTSAVE", order: 4 },
      { t: "bot_text", val: "Save", value: "Save", order: 5 },
    ];
    const fallbackRows = [{ id: "FB_1", cell: defaultFallbackCells }];
    return createResponse(cfg, buildGridPayload(gridName || "GENERIC", fallbackRows, [
      { name: "code", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
      { name: "description", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
    ]));
  }

  // 9. Autocomplete endpoints
  if (url.includes("/autocomplete/users")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [{ code: "ADMIN", desc: "Administrator" }],
    });
  }

  if (url.includes("/autocomplete/eqp")) {
    const systems = mockDb.getSystems().map((s) => ({
      code: s.SYSTEMID?.EQUIPMENTCODE,
      desc: s.SYSTEMID?.DESCRIPTION,
      org: s.SYSTEMID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*",
    }));
    const assets = mockDb.getAssets().map((a) => ({
      code: a.ASSETID?.EQUIPMENTCODE,
      desc: a.ASSETID?.DESCRIPTION,
      org: a.ASSETID?.ORGANIZATIONID?.ORGANIZATIONCODE || "*",
    }));
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [...systems, ...assets],
    });
  }

  // 10. Global Search endpoints (/index, /index/singleresult)
  if (url.includes("/index/singleresult")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: null,
    });
  }

  if (url.includes("/index")) {
    const results = [
      ...mockDb.getWorkOrders().map((wo) => ({
        code: wo.WORKORDERID?.JOBNUM,
        description: wo.WORKORDERID?.DESCRIPTION,
        type: "WORKORDER",
        link: `/workorder/${wo.WORKORDERID?.JOBNUM}`,
      })),
      ...mockDb.getAssets().map((ast) => ({
        code: ast.ASSETID?.EQUIPMENTCODE,
        description: ast.ASSETID?.DESCRIPTION,
        type: "ASSET",
        link: `/asset/${ast.ASSETID?.EQUIPMENTCODE}`,
      })),
      ...mockDb.getSystems().map((sys) => ({
        code: sys.SYSTEMID?.EQUIPMENTCODE,
        description: sys.SYSTEMID?.DESCRIPTION,
        type: "SYSTEM",
        link: `/system/${sys.SYSTEMID?.EQUIPMENTCODE}`,
      })),
      ...mockDb.getParts().map((prt) => ({
        code: prt.PARTID?.PARTCODE,
        description: prt.PARTID?.DESCRIPTION,
        type: "PART",
        link: `/part/${prt.PARTID?.PARTCODE}`,
      })),
      ...mockDb.getLots().map((lot) => ({
        code: lot.LOTID?.LOTCODE,
        description: lot.LOTID?.DESCRIPTION,
        type: "LOT",
        link: `/lot/${lot.LOTID?.LOTCODE}`,
      })),
    ];

    return createResponse(cfg, {
      status: "SUCCESS",
      data: results,
    });
  }

  // 11. Miscellaneous equipment / work orders info
  if (url.includes("/equipment/") || url.includes("/workordersmisc/")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: { ResultData: {} },
    });
  }

  // 12. Comments & Documents
  // GET /comments?entityCode=:code&entityKeyCode=:key (or entityType)
  if (method === "get" && url.includes("/comments")) {
    const urlObj = new URL(url, "http://localhost");
    const entityCode = urlObj.searchParams.get("entityCode") || urlObj.searchParams.get("entityType") || "EVNT";
    const entityKeyCode = urlObj.searchParams.get("entityKeyCode") || urlObj.searchParams.get("entityCode") || "";
    const comments = mockDb.getComments(entityCode, entityKeyCode);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: comments,
      Result: {
        ResultData: comments,
      },
    });
  }

  // POST create comment: /comments/ or /comments
  if (method === "post" && (url.includes("/comments/") || url.endsWith("/comments"))) {
    const comment = reqBody || {};
    const created = mockDb.saveComment(comment);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: created,
      Result: {
        ResultData: created,
        InfoAlert: { Message: "Comment created successfully." },
      },
    });
  }

  // PUT update comment: /comments/ or /comments
  if (method === "put" && (url.includes("/comments/") || url.endsWith("/comments"))) {
    const comment = reqBody || {};
    const updated = mockDb.saveComment(comment);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: updated,
      Result: {
        ResultData: updated,
        InfoAlert: { Message: "Comment updated successfully." },
      },
    });
  }

  if (url.includes("/documents")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: { ResultData: [] },
    });
  }

  // Default fallback
  console.warn(`[MockAdapter] Fallback response for: ${method.toUpperCase()} ${url}`);
  return createResponse(cfg, {
    status: "SUCCESS",
    data: [],
    Result: { ResultData: {} },
  });
};

/**
 * Installs the mock adapter on the given Axios instance.
 */
export const setupMockAdapter = (axiosInstance) => {
  if (!axiosInstance) return;

  if (import.meta.env.VITE_MOCK_MODE === "true") {
    axiosInstance.defaults.adapter = mockAdapterHandler;
  }

  axiosInstance.interceptors.request.use((config) => {
    if (import.meta.env.VITE_MOCK_MODE === "true") {
      config.adapter = mockAdapterHandler;
    }
    return config;
  });
};

