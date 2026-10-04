// Standalone Mock Network Adapter for EAM Light backed by Dexie.js (IndexedDB)
import {
  mockUser,
  mockApplicationData,
  mockScreenLayoutWSJOBS,
  mockScreenLayoutOSOBJS,
  mockScreenLayoutOSOBJA,
  mockScreenLayoutOSOBJP,
  mockScreenLayoutSSPART,
  mockScreenLayoutSSLOT,
  mockScreenLayoutOSNCHD,
} from "./mockData";
import { db, extractCode, getNextSequence, seedInitialData } from "../db/eamDatabase";

// Ensure seed data is initialized
let seedPromise = null;
const ensureDbSeeded = () => {
  if (!seedPromise) {
    seedPromise = seedInitialData(false);
  }
  return seedPromise;
};

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

/**
 * Core async mock request handler
 */
export const mockAdapterHandler = async (cfg) => {
  await ensureDbSeeded();

  const method = (cfg.method || "get").toLowerCase();
  const url = cfg.url || "";
  let reqBody = cfg.data;

  if (typeof reqBody === "string") {
    try {
      reqBody = JSON.parse(reqBody);
    } catch (_e) {
      // ignore parsing error
    }
  }

  // 0. Database reset endpoint
  if (url.includes("/database/reset") || url.includes("/resetDatabase")) {
    await seedInitialData(true);
    return createResponse(cfg, {
      status: "SUCCESS",
      data: "Database reset and re-seeded successfully.",
    });
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
    } else if (url.includes("OSNCHD")) {
      layout = mockScreenLayoutOSNCHD;
    } else if (url.includes("OSJOBS")) {
      layout = mockScreenLayoutWSJOBS;
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

  // 4. WORK ORDERS SCHEMA FACTORY & CRUD
  // Schema Factory / Init: /proxy/workorderdefaults or /workorders/init
  if (
    url.includes("/workorders/init") ||
    (method === "post" && url.includes("/proxy/workorderdefaults"))
  ) {
    const nextCode = await getNextSequence("workorders");
    const now = new Date();
    return createResponse(cfg, {
      Result: {
        ResultData: {
          WorkOrder: {
            WORKORDERID: {
              JOBNUM: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "R", DESCRIPTION: "Released" },
            TYPE: { TYPECODE: "CORR", DESCRIPTION: "Corrective" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            PRIORITY: { PRIORITYCODE: "M", DESCRIPTION: "Medium" },
            EQUIPMENTID: {
              EQUIPMENTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            },
            SCHEDSTARTDATE: now.toISOString(),
            SCHEDENDDATE: new Date(Date.now() + 86400000).toISOString(),
            DATEREPORTED: now.toISOString(),
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // Additional costs for WO
  if (url.includes("/additionalcosts")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: {
        ResultData: [],
      },
    });
  }

  // GET single work order: /proxy/workorders/:id or /workorders/:id
  const woGetMatch = url.match(/(?:\/proxy)?\/workorders\/([^/?#]+)/);
  if (
    method === "get" &&
    woGetMatch &&
    !url.includes("/workordersmisc") &&
    !url.includes("/activities") &&
    !url.includes("/watchers") &&
    !url.includes("/booklabor") &&
    !url.includes("/additionalcosts")
  ) {
    const code = extractCode(woGetMatch[1]);
    const found = await db.workorders.get(code);
    if (found) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            WorkOrder: found.raw || found,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(
        cfg,
        { ErrorAlert: [{ Message: `Work Order ${code} not found` }] },
        404,
        "Not Found"
      ),
    });
  }

  // POST create work order: /proxy/workorders/ or /workorders/
  if (method === "post" && (url.endsWith("/workorders") || url.endsWith("/workorders/"))) {
    const payload = reqBody?.WorkOrder || reqBody || {};
    let jobNum = payload.WORKORDERID?.JOBNUM;
    if (!jobNum) {
      jobNum = await getNextSequence("workorders");
    }

    const eqCode = payload.EQUIPMENTID?.EQUIPMENTCODE || "";
    // Verify equipment and populate relational fields
    let dept = payload.DEPARTMENTID?.DEPARTMENTCODE || "*";
    let loc = payload.LOCATIONID?.LOCATIONCODE || "";
    if (eqCode) {
      const eqRecord = await db.equipment.get(eqCode);
      if (eqRecord) {
        if (!dept || dept === "*") dept = eqRecord.departmentCode || "*";
      }
    }

    const newWoRaw = {
      ...payload,
      WORKORDERID: {
        ...(payload.WORKORDERID || {}),
        JOBNUM: jobNum,
        ORGANIZATIONID: payload.WORKORDERID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      DEPARTMENTID: { DEPARTMENTCODE: dept },
      LOCATIONID: loc ? { LOCATIONCODE: loc } : payload.LOCATIONID,
    };

    const newWoRecord = {
      code: jobNum,
      description: newWoRaw.WORKORDERID?.DESCRIPTION || "",
      equipmentCode: eqCode,
      statusCode: newWoRaw.STATUS?.STATUSCODE || "R",
      statusDesc: newWoRaw.STATUS?.DESCRIPTION || "Released",
      department: dept,
      type: newWoRaw.TYPE?.TYPECODE || "CORR",
      typeDesc: newWoRaw.TYPE?.DESCRIPTION || "Corrective",
      priority: newWoRaw.PRIORITY?.PRIORITYCODE || "M",
      priorityDesc: newWoRaw.PRIORITY?.DESCRIPTION || "Medium",
      schedStartDate: newWoRaw.SCHEDSTARTDATE || new Date().toISOString(),
      schedEndDate: newWoRaw.SCHEDENDDATE || new Date().toISOString(),
      raw: newWoRaw,
    };

    await db.workorders.put(newWoRecord);

    // Auto-instantiate default Activity 10 if not present
    const existingActs = await db.activities.where("workorder").equals(jobNum).toArray();
    if (existingActs.length === 0) {
      const now = new Date();
      await db.activities.put({
        workorder: jobNum,
        activityCode: "10",
        activityNote: "Initial Inspection",
        peopleRequired: 1,
        estimatedHours: 2,
        hoursRemaining: 2,
        startDate: now.toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        tradeCode: "MECH",
        taskCode: "TSK-01",
        taskDesc: "Initial Inspection & Setup",
      });

      // Link default checklist inspection items
      await db.checklists.bulkPut([
        {
          workorder: jobNum,
          activityCode: "10",
          checklistCode: `${jobNum}-CHK-01`,
          checkListCode: `${jobNum}-CHK-01`,
          sequence: 1,
          desc: "Safety lockout applied?",
          type: "01",
          result: null,
          completed: false,
          notes: "",
          required: true,
          equipmentCode: eqCode,
          equipmentDesc: "",
          possibleFindings: [],
          finding: null,
          numericValue: null,
          freeText: null,
        },
        {
          workorder: jobNum,
          activityCode: "10",
          checklistCode: `${jobNum}-CHK-02`,
          checkListCode: `${jobNum}-CHK-02`,
          sequence: 2,
          desc: "Operating pressure (Bar)",
          type: "04",
          result: null,
          completed: false,
          notes: "",
          required: true,
          minimumValue: 2.0,
          maximumValue: 8.0,
          numericValue: 4.5,
          UOM: "Bar",
          equipmentCode: eqCode,
          equipmentDesc: "",
          possibleFindings: [],
          finding: null,
          freeText: null,
        },
      ]);
    }

    return createResponse(cfg, {
      Result: {
        ResultData: {
          JOBNUM: jobNum,
          WorkOrder: newWoRaw,
        },
        InfoAlert: { Message: `Work Order ${jobNum} created successfully.` },
      },
    });
  }

  // PUT update work order: /proxy/workorders/ or /workorders/
  if (method === "put" && (url.endsWith("/workorders") || url.endsWith("/workorders/"))) {
    const payload = reqBody?.WorkOrder || reqBody || {};
    const jobNum = payload.WORKORDERID?.JOBNUM;
    const eqCode = payload.EQUIPMENTID?.EQUIPMENTCODE || "";

    const updatedRecord = {
      code: jobNum,
      description: payload.WORKORDERID?.DESCRIPTION || "",
      equipmentCode: eqCode,
      statusCode: payload.STATUS?.STATUSCODE || "R",
      statusDesc: payload.STATUS?.DESCRIPTION || "Released",
      department: payload.DEPARTMENTID?.DEPARTMENTCODE || "*",
      type: payload.TYPE?.TYPECODE || "CORR",
      typeDesc: payload.TYPE?.DESCRIPTION || "Corrective",
      priority: payload.PRIORITY?.PRIORITYCODE || "M",
      priorityDesc: payload.PRIORITY?.DESCRIPTION || "Medium",
      schedStartDate: payload.SCHEDSTARTDATE,
      schedEndDate: payload.SCHEDENDDATE,
      raw: payload,
    };

    await db.workorders.put(updatedRecord);

    return createResponse(cfg, {
      Result: {
        ResultData: {
          JOBNUM: jobNum,
          WorkOrder: payload,
        },
        InfoAlert: { Message: `Work Order ${jobNum} updated successfully.` },
      },
    });
  }

  // DELETE work order: Cascade delete activities & checklists
  if (method === "delete" && woGetMatch) {
    const code = extractCode(woGetMatch[1]);
    await db.transaction("rw", [db.workorders, db.activities, db.checklists], async () => {
      await db.workorders.delete(code);
      await db.activities.where("workorder").equals(code).delete();
      await db.checklists.where("workorder").equals(code).delete();
    });
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

    const acts = await db.activities.where("workorder").equals(woCode).toArray();
    const chks = await db.checklists.where("workorder").equals(woCode).toArray();

    const activitiesWithChecklists = acts.map((act) => ({
      ...act,
      checklists: chks.filter((c) => String(c.activityCode) === String(act.activityCode)),
    }));

    const toEamDateObj = (iso) => {
      const d = iso ? new Date(iso) : new Date();
      return {
        YEAR: new Date(`${d.getFullYear()}-01-02T00:00:00`).getTime(),
        MONTH: d.getMonth() + 1,
        DAY: d.getDate(),
        HOUR: d.getHours(),
        MINUTE: d.getMinutes(),
        SECOND: d.getSeconds(),
        TIMEZONE: "Z",
      };
    };

    const dataRecords = activitiesWithChecklists.map((act) => ({
      ACTIVITYID: {
        ACTIVITYCODE: { value: act.activityCode },
        ACTIVITYNOTE: act.activityNote,
        WORKORDERID: { JOBNUM: act.workorder },
      },
      PERSONS: act.peopleRequired,
      ESTIMATEDHOURS: act.estimatedHours,
      HOURSREMAINING: act.hoursRemaining,
      ACTIVITYSTARTDATE: toEamDateObj(act.startDate),
      ACTIVITYENDDATE: toEamDateObj(act.endDate),
      TASKSID: {
        TASKCODE: act.taskCode,
        DESCRIPTION: act.taskDesc,
      },
      TRADEID: { TRADECODE: act.tradeCode },
    }));

    return createResponse(cfg, {
      status: "SUCCESS",
      data: activitiesWithChecklists,
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

    let query = db.checklists.where("workorder").equals(woCode);
    let items = await query.toArray();
    if (actCode) {
      items = items.filter((i) => String(i.activityCode) === String(actCode));
    }

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
    const urlObj = new URL(url, "http://localhost");
    const rawWo = item.workOrderCode || item.workorder || item.workOrderNumber || urlObj.searchParams.get("workorder") || "";
    const woCode = extractCode(rawWo) || "WO-1001";

    // Find and update item in db.checklists
    const existing = await db.checklists
      .where("workorder")
      .equals(woCode)
      .filter(
        (c) =>
          (c.checklistCode && c.checklistCode === (item.checklistCode || item.checkListCode)) ||
          (c.checkListCode && c.checkListCode === (item.checklistCode || item.checkListCode)) ||
          (c.sequence &&
            c.sequence === item.sequence &&
            String(c.activityCode) === String(item.activityCode))
      )
      .first();

    const updatedItem = {
      ...(existing || {}),
      ...item,
      workorder: woCode,
      checklistCode: item.checklistCode || item.checkListCode,
      checkListCode: item.checklistCode || item.checkListCode,
    };

    if (existing?.id) {
      updatedItem.id = existing.id;
    }

    await db.checklists.put(updatedItem);

    return createResponse(cfg, {
      status: "SUCCESS",
      data: updatedItem,
      Result: {
        ResultData: updatedItem,
        InfoAlert: { Message: "Checklist updated successfully." },
      },
    });
  }

  // 4c2. WORK ORDER ACTIVITY INIT / DEFAULTS
  if (method === "post" && url.includes("/workorders/activitydefaults")) {
    const woCode = extractCode(reqBody?.WORKORDERID?.JOBNUM || "WO-1001");
    const existingActs = await db.activities.where("workorder").equals(woCode).toArray();
    let nextActCode = 10;
    if (existingActs.length > 0) {
      const maxAct = Math.max(...existingActs.map((a) => parseInt(a.activityCode, 10) || 0));
      nextActCode = maxAct + 10;
    }
    const now = new Date();
    return createResponse(cfg, {
      Result: {
        ResultData: {
          ActivityDefault: {
            ACTIVITYID: {
              ACTIVITYCODE: { value: String(nextActCode) },
              ACTIVITYNOTE: "",
              WORKORDERID: {
                JOBNUM: woCode,
                ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              },
            },
            PERSONS: 1,
            ESTIMATEDHOURS: 1,
            HOURSREMAINING: 1,
            STARTDATE: now.toISOString(),
            ENDDATE: new Date(Date.now() + 86400000).toISOString(),
            TRADEID: { TRADECODE: "MECH" },
            TASKSID: { TASKCODE: "" },
          },
        },
      },
    });
  }

  // 4c3. WORK ORDER ACTIVITY CREATE / UPDATE / DELETE
  const actMatch = url.match(/(?:\/proxy)?\/workorders\/([^/?#]+)\/activities(?:\/([^/?#]+))?/);
  if (url.includes("/workorders/activities") || (actMatch && (method === "post" || method === "put" || method === "delete" || (method === "get" && actMatch[2])))) {
    if (method === "post") {
      const act = reqBody?.Activity || reqBody || {};
      const woCode = extractCode(act.WORKORDERID?.JOBNUM || act.workorder || actMatch?.[1] || "WO-1001");
      const actCode = String(act.ACTIVITYID?.ACTIVITYCODE?.value || act.activityCode || "10");
      const note = act.ACTIVITYID?.ACTIVITYNOTE || act.activityNote || "";
      const now = new Date();

      const newAct = {
        workorder: woCode,
        activityCode: actCode,
        activityNote: note,
        peopleRequired: Number(act.PERSONS || act.peopleRequired || 1),
        estimatedHours: Number(act.ESTIMATEDHOURS || act.estimatedHours || 1),
        hoursRemaining: Number(act.HOURSREMAINING || act.hoursRemaining || 1),
        startDate: act.STARTDATE || now.toISOString(),
        endDate: act.ENDDATE || new Date(Date.now() + 86400000).toISOString(),
        tradeCode: act.TRADEID?.TRADECODE || act.tradeCode || "MECH",
        taskCode: act.TASKSID?.TASKCODE || act.taskCode || "TSK-01",
        taskDesc: act.TASKSID?.DESCRIPTION || act.taskDesc || note,
      };

      await db.activities.put(newAct);

      // Instantiate default inspection checklist item for new activity
      await db.checklists.put({
        workorder: woCode,
        activityCode: actCode,
        checklistCode: `${woCode}-${actCode}-CHK-01`,
        checkListCode: `${woCode}-${actCode}-CHK-01`,
        sequence: 1,
        desc: `Inspection for Activity ${actCode}`,
        type: "01",
        result: null,
        completed: false,
        notes: "",
        required: true,
        equipmentCode: "",
        equipmentDesc: "",
        possibleFindings: [],
      });

      return createResponse(cfg, {
        Result: {
          ResultData: {
            JOBNUM: woCode,
            Activity: act,
          },
          InfoAlert: { Message: `Activity ${actCode} created successfully.` },
        },
      });
    }

    if (method === "put") {
      const act = reqBody?.Activity || reqBody || {};
      const woCode = extractCode(act.WORKORDERID?.JOBNUM || act.workorder || actMatch?.[1] || "WO-1001");
      const actCode = String(act.ACTIVITYID?.ACTIVITYCODE?.value || act.activityCode || "10");
      const existing = await db.activities.get([woCode, actCode]);

      const updated = {
        ...(existing || {}),
        workorder: woCode,
        activityCode: actCode,
        activityNote: act.ACTIVITYID?.ACTIVITYNOTE || act.activityNote || existing?.activityNote || "",
        peopleRequired: Number(act.PERSONS || act.peopleRequired || existing?.peopleRequired || 1),
        estimatedHours: Number(act.ESTIMATEDHOURS || act.estimatedHours || existing?.estimatedHours || 1),
        hoursRemaining: Number(act.HOURSREMAINING || act.hoursRemaining || existing?.hoursRemaining || 1),
        tradeCode: act.TRADEID?.TRADECODE || act.tradeCode || existing?.tradeCode || "MECH",
      };

      await db.activities.put(updated);

      return createResponse(cfg, {
        Result: {
          ResultData: {
            JOBNUM: woCode,
            Activity: act,
          },
          InfoAlert: { Message: `Activity ${actCode} updated successfully.` },
        },
      });
    }

    if (method === "delete") {
      let woCode = "";
      let actCode = "";
      if (actMatch) {
        woCode = extractCode(actMatch[1]);
        actCode = extractCode(actMatch[2] || "");
      }
      if (!actCode && url.includes("/activities/")) {
        const parts = url.split("/activities/")[1].split("?")[0].split("/");
        actCode = extractCode(parts[0]);
      }

      if (woCode && actCode) {
        await db.transaction("rw", [db.activities, db.checklists], async () => {
          await db.activities.delete([woCode, actCode]);
          // Cascade delete related checklist items
          const chks = await db.checklists.where("workorder").equals(woCode).toArray();
          const toDelete = chks.filter((c) => String(c.activityCode) === String(actCode));
          for (const item of toDelete) {
            if (item.id) await db.checklists.delete(item.id);
          }
        });
      }

      return createResponse(cfg, {
        Result: {
          InfoAlert: { Message: `Activity ${actCode} and checklists deleted successfully.` },
        },
      });
    }
  }

  // 4d. BOOKING LABOUR
  if (url.includes("/bookinglabour") || url.includes("/workorders/booklabor")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: {
        ResultData: [],
      },
    });
  }

  // 4e. WORK ORDERS MISC (Children WO, Other ID, Eqp Mec WO)
  if (url.includes("/workordersmisc/childrenwo") || url.includes("/workordersmisc/eqpmecwo")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: {
        ResultData: [],
      },
    });
  }

  if (url.includes("/workordersmisc/equipment")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: { ISWARRANTYACTIVE: "false" },
      Result: {
        ResultData: { ISWARRANTYACTIVE: "false" },
      },
    });
  }

  if (url.includes("/workordersmisc/otherid") || url.includes("/workordersmisc/gislink")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: {},
      Result: {
        ResultData: {},
      },
    });
  }

  // 4f. WATCHERS
  if (url.includes("/watchers")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: {
        ResultData: [],
      },
    });
  }

  // 4g. NCRs for equipment
  if (url.includes("/ncrs/equipment")) {
    const assetCode = extractCode(url.split("/ncrs/equipment/")[1] || "");
    let ncrs = [];
    if (assetCode) {
      ncrs = await db.nonconformities.where("equipmentCode").equals(assetCode).toArray();
    } else {
      ncrs = await db.nonconformities.toArray();
    }

    const formatted = ncrs.map((n) => ({
      nonconformity: n.code,
      description: n.description,
      status: n.statusCode,
      status_display: n.statusDesc || (n.statusCode === "O" ? "Open" : "Closed"),
      severity: n.severity,
      severity_display: n.severityDesc || (n.severity === "MAJ" ? "Major" : "Minor"),
    }));

    return createResponse(cfg, {
      status: "SUCCESS",
      data: formatted,
      Result: {
        ResultData: formatted,
      },
    });
  }

  // 5. ASSETS SCHEMA FACTORY & CRUD
  // Schema Factory / Init: /proxy/assetdefaults or /assets/init
  if (
    url.includes("/assets/init") ||
    (method === "post" && url.includes("/proxy/assetdefaults"))
  ) {
    const nextCode = await getNextSequence("assets");
    return createResponse(cfg, {
      Result: {
        ResultData: {
          AssetEquipment: {
            ASSETID: {
              EQUIPMENTCODE: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            AssetParentHierarchy: {},
            systemTypeCode: "A",
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
    const found = await db.equipment.get(code);
    if (found && found.type === "A") {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            AssetEquipment: {
              ...(found.raw || found),
              AssetParentHierarchy: {
                primarysystem: found.parentCode || "",
              },
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
    let code = payload.ASSETID?.EQUIPMENTCODE;
    if (!code) {
      code = await getNextSequence("assets");
    }

    const parentCode =
      payload.AssetParentHierarchy?.primarysystem ||
      payload.AssetParentHierarchy?.parentasset ||
      null;

    const newAst = {
      ...payload,
      ASSETID: {
        ...(payload.ASSETID || {}),
        EQUIPMENTCODE: code,
        ORGANIZATIONID: payload.ASSETID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "A",
    };

    await db.equipment.put({
      code,
      description: newAst.ASSETID?.DESCRIPTION || "",
      type: "A",
      parentCode: parentCode ? extractCode(parentCode) : null,
      departmentCode: newAst.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: newAst.STATUS?.STATUSCODE || "I",
      statusDesc: newAst.STATUS?.DESCRIPTION || "In Service",
      categoryCode: newAst.CATEGORYID?.CATEGORYCODE || "PUMP",
      classCode: newAst.CLASSID?.CLASSCODE || "STANDARD",
      criticalityCode: newAst.CRITICALITYID?.CRITICALITYCODE || "B",
      commissionDate: new Date().toISOString(),
      raw: newAst,
    });

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
    const parentCode =
      payload.AssetParentHierarchy?.primarysystem ||
      payload.AssetParentHierarchy?.parentasset ||
      null;

    await db.equipment.put({
      code,
      description: payload.ASSETID?.DESCRIPTION || "",
      type: "A",
      parentCode: parentCode ? extractCode(parentCode) : null,
      departmentCode: payload.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: payload.STATUS?.STATUSCODE || "I",
      statusDesc: payload.STATUS?.DESCRIPTION || "In Service",
      categoryCode: payload.CATEGORYID?.CATEGORYCODE || "PUMP",
      classCode: payload.CLASSID?.CLASSCODE || "STANDARD",
      criticalityCode: payload.CRITICALITYID?.CRITICALITYCODE || "B",
      raw: payload,
    });

    return createResponse(cfg, {
      Result: {
        ResultData: {
          ASSETID: { EQUIPMENTCODE: code },
          AssetEquipment: payload,
        },
        InfoAlert: { Message: `Asset ${code} updated successfully.` },
      },
    });
  }

  // DELETE asset
  if (method === "delete" && astGetMatch) {
    const code = extractCode(astGetMatch[1]);
    await db.equipment.delete(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Asset ${code} deleted successfully.` },
      },
    });
  }

  // 6. SYSTEMS SCHEMA FACTORY & CRUD
  // Schema Factory / Init: /proxy/systemdefaults or /systems/init
  if (
    url.includes("/systems/init") ||
    (method === "post" && url.includes("/proxy/systemdefaults"))
  ) {
    const nextCode = await getNextSequence("systems");
    return createResponse(cfg, {
      Result: {
        ResultData: {
          SystemEquipmentDefault: {
            SYSTEMID: {
              EQUIPMENTCODE: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
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
    const found = await db.equipment.get(code);
    if (found && found.type === "S") {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            SystemEquipment: {
              ...(found.raw || found),
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
    let eqCode = payload.SYSTEMID?.EQUIPMENTCODE;
    if (!eqCode) {
      eqCode = await getNextSequence("systems");
    }

    const newSys = {
      ...payload,
      SYSTEMID: {
        ...(payload.SYSTEMID || {}),
        EQUIPMENTCODE: eqCode,
        ORGANIZATIONID: payload.SYSTEMID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "S",
    };

    await db.equipment.put({
      code: eqCode,
      description: newSys.SYSTEMID?.DESCRIPTION || "",
      type: "S",
      parentCode: null,
      departmentCode: newSys.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: newSys.STATUS?.STATUSCODE || "I",
      statusDesc: newSys.STATUS?.DESCRIPTION || "In Service",
      categoryCode: newSys.CATEGORYID?.CATEGORYCODE || "HVAC",
      classCode: newSys.CLASSID?.CLASSCODE || "CRITICAL",
      criticalityCode: newSys.CRITICALITYID?.CRITICALITYCODE || "A",
      raw: newSys,
    });

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

    await db.equipment.put({
      code: eqCode,
      description: payload.SYSTEMID?.DESCRIPTION || "",
      type: "S",
      parentCode: null,
      departmentCode: payload.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: payload.STATUS?.STATUSCODE || "I",
      statusDesc: payload.STATUS?.DESCRIPTION || "In Service",
      categoryCode: payload.CATEGORYID?.CATEGORYCODE || "HVAC",
      classCode: payload.CLASSID?.CLASSCODE || "CRITICAL",
      criticalityCode: payload.CRITICALITYID?.CRITICALITYCODE || "A",
      raw: payload,
    });

    return createResponse(cfg, {
      Result: {
        ResultData: {
          SYSTEMID: { EQUIPMENTCODE: eqCode },
          SystemEquipment: payload,
        },
        InfoAlert: { Message: `System ${eqCode} updated successfully.` },
      },
    });
  }

  // DELETE system
  if (method === "delete" && sysGetMatch) {
    const code = extractCode(sysGetMatch[1]);
    await db.equipment.delete(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `System ${code} deleted successfully.` },
      },
    });
  }

  // 6b. POSITIONS SCHEMA FACTORY & CRUD
  if (
    url.includes("/positions/init") ||
    (method === "post" && url.includes("/proxy/positiondefaults"))
  ) {
    const nextCode = await getNextSequence("positions");
    return createResponse(cfg, {
      Result: {
        ResultData: {
          PositionEquipmentDefault: {
            POSITIONID: {
              EQUIPMENTCODE: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
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
    const found = await db.equipment.get(code);
    if (found && found.type === "P") {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            PositionEquipment: {
              ...(found.raw || found),
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
    let eqCode = payload.POSITIONID?.EQUIPMENTCODE;
    if (!eqCode) {
      eqCode = await getNextSequence("positions");
    }

    const newPos = {
      ...payload,
      POSITIONID: {
        ...(payload.POSITIONID || {}),
        EQUIPMENTCODE: eqCode,
        ORGANIZATIONID: payload.POSITIONID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
      systemTypeCode: "P",
    };

    await db.equipment.put({
      code: eqCode,
      description: newPos.POSITIONID?.DESCRIPTION || "",
      type: "P",
      parentCode: null,
      departmentCode: newPos.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: newPos.STATUS?.STATUSCODE || "I",
      statusDesc: newPos.STATUS?.DESCRIPTION || "In Service",
      categoryCode: newPos.CATEGORYID?.CATEGORYCODE || "POS",
      classCode: newPos.CLASSID?.CLASSCODE || "STANDARD",
      criticalityCode: newPos.CRITICALITYID?.CRITICALITYCODE || "M",
      raw: newPos,
    });

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

    await db.equipment.put({
      code: eqCode,
      description: payload.POSITIONID?.DESCRIPTION || "",
      type: "P",
      parentCode: null,
      departmentCode: payload.DEPARTMENTID?.DEPARTMENTCODE || "*",
      statusCode: payload.STATUS?.STATUSCODE || "I",
      statusDesc: payload.STATUS?.DESCRIPTION || "In Service",
      categoryCode: payload.CATEGORYID?.CATEGORYCODE || "POS",
      classCode: payload.CLASSID?.CLASSCODE || "STANDARD",
      criticalityCode: payload.CRITICALITYID?.CRITICALITYCODE || "M",
      raw: payload,
    });

    return createResponse(cfg, {
      Result: {
        ResultData: {
          POSITIONID: { EQUIPMENTCODE: eqCode },
          PositionEquipment: payload,
        },
        InfoAlert: { Message: `Position ${eqCode} updated successfully.` },
      },
    });
  }

  // DELETE position
  if (method === "delete" && posGetMatch) {
    const code = extractCode(posGetMatch[1]);
    await db.equipment.delete(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Position ${code} deleted successfully.` },
      },
    });
  }

  // 6c. EQUIPMENT TREE & CHILDREN
  // Intercept /eqstructure/tree, /equipment/tree, /equipment/children/:code
  if (url.includes("/eqstructure/tree") || url.includes("/equipment/tree") || url.includes("/equipment/children")) {
    let eqCode = "";
    const match = url.match(/\/equipment\/children\/([^/?#]+)/);
    if (match) {
      eqCode = extractCode(match[1]);
    } else {
      const urlObj = new URL(url, "http://localhost");
      eqCode = extractCode(urlObj.searchParams.get("eqid") || urlObj.searchParams.get("equipment") || "");
    }

    // Helper recursive function to construct hierarchical tree node
    const buildTreeNode = async (code) => {
      const eq = await db.equipment.get(code);
      if (!eq) return null;

      // Find children across any parent dimension
      const allEqs = await db.equipment.toArray();
      const directChildren = allEqs.filter(
        (e) =>
          e.code !== code &&
          (e.parentCode === code ||
            e.parentAssetCode === code ||
            e.parentPositionCode === code ||
            e.parentSystemCode === code)
      );

      const childrenNodes = [];
      for (const child of directChildren) {
        const childNode = await buildTreeNode(child.code);
        if (childNode) childrenNodes.push(childNode);
      }

      return {
        id: eq.code,
        name: eq.description,
        type: eq.type,
        idOrg: "*",
        parents: [eq.parentAssetCode, eq.parentPositionCode, eq.parentSystemCode, eq.parentCode].filter(Boolean),
        children: childrenNodes,
      };
    };

    // If requested via /eqstructure/tree (EAMTree), return the full tree hierarchy
    if (url.includes("/eqstructure/tree")) {
      const rootNode = (await buildTreeNode(eqCode)) || {
        id: eqCode,
        name: eqCode,
        type: "A",
        idOrg: "*",
        parents: [],
        children: [],
      };

      return createResponse(cfg, {
        status: "SUCCESS",
        data: [rootNode],
        Result: {
          ResultData: [rootNode],
        },
      });
    }

    // Otherwise return children array for /equipment/children/:code
    const allEqs = await db.equipment.toArray();
    const children = allEqs.filter(
      (e) =>
        e.code !== eqCode &&
        (e.parentCode === eqCode ||
          e.parentAssetCode === eqCode ||
          e.parentPositionCode === eqCode ||
          e.parentSystemCode === eqCode)
    );

    return createResponse(cfg, {
      status: "SUCCESS",
      data: children.map((c) => ({
        code: c.code,
        desc: c.description,
        type: c.type,
        parent: c.parentCode || c.parentAssetCode || c.parentPositionCode || c.parentSystemCode,
      })),
      Result: {
        ResultData: children,
      },
    });
  }

  // 7. PARTS & LOTS SCHEMA FACTORY & CRUD
  // Schema Factory / Init: /proxy/partdefaults or /parts/init
  if (
    url.includes("/parts/init") ||
    (method === "post" && url.includes("/proxy/partdefaults"))
  ) {
    const nextCode = await getNextSequence("parts");
    return createResponse(cfg, {
      Result: {
        ResultData: {
          Part: {
            PARTID: {
              PARTCODE: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
              DESCRIPTION: "",
            },
            UOM: "EA",
            TRACKINGBYASSET: false,
            TRACKINGTYPE: "LOT",
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
    const foundLot = await db.partLots.get([partCode, lotCode]);
    if (foundLot) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Lot: foundLot.raw || foundLot,
          },
        },
      });
    }
    return Promise.reject({
      response: createResponse(
        cfg,
        { ErrorAlert: [{ Message: `Lot ${lotCode} for part ${partCode} not found` }] },
        404,
        "Not Found"
      ),
    });
  }

  // Single lot route: /lots/:id
  const lotGetMatch = url.match(/(?:\/proxy)?\/lots\/([^/?#]+)/);
  if (method === "get" && lotGetMatch) {
    const code = extractCode(lotGetMatch[1]);
    const foundLot = await db.partLots.where("lotCode").equals(code).first();
    if (foundLot) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Lot: foundLot.raw || foundLot,
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
    let lotCode = payload.LOTID?.LOTCODE;
    if (!lotCode) lotCode = `LOT-${String(Date.now()).slice(-3)}`;
    const partCode = payload.LOTID?.PARTCODE || "";

    const newLot = {
      ...payload,
      LOTID: {
        ...(payload.LOTID || {}),
        LOTCODE: lotCode,
        ORGANIZATIONID: payload.LOTID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
    };

    await db.partLots.put({
      partCode,
      lotCode,
      description: newLot.LOTID?.DESCRIPTION || "",
      qty: newLot.QTY || 0,
      statusCode: newLot.STATUS?.STATUSCODE || "A",
      raw: newLot,
    });

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
    const partCode = payload.LOTID?.PARTCODE || "";

    await db.partLots.put({
      partCode,
      lotCode,
      description: payload.LOTID?.DESCRIPTION || "",
      qty: payload.QTY || 0,
      statusCode: payload.STATUS?.STATUSCODE || "A",
      raw: payload,
    });

    return createResponse(cfg, {
      Result: {
        ResultData: {
          LOTCODE: lotCode,
          Lot: payload,
        },
        InfoAlert: { Message: `Lot ${lotCode} updated successfully.` },
      },
    });
  }

  // Part Associated Create & Delete
  if (method === "post" && url.includes("/equipment/partsassociated")) {
    const assoc = reqBody || {};
    const eqCode = extractCode(assoc.equipmentCode || "");
    const partCode = extractCode(assoc.partCode || assoc.part || "");
    const quantity = Number(assoc.quantity || 1);
    const uom = assoc.uom || "EA";
    const desc = assoc.description || `Associated Part ${partCode}`;

    const newAssoc = {
      equipmentCode: eqCode,
      partCode,
      description: desc,
      quantity,
      uom,
      associationEntity: assoc.associationEntity || "A",
    };

    await db.partAssociations.put(newAssoc);

    return createResponse(cfg, {
      status: "SUCCESS",
      data: newAssoc,
      Result: {
        ResultData: newAssoc,
        InfoAlert: { Message: `Part ${partCode} associated with equipment ${eqCode} successfully.` },
      },
    });
  }

  const deleteAssocMatch = url.match(/(?:\/proxy)?\/assets\/([^/?#]+)\/partsassociated\/([^/?#]+)/);
  if (method === "delete" && deleteAssocMatch) {
    const eqCode = extractCode(deleteAssocMatch[1]);
    const pk = deleteAssocMatch[2];
    const partCode = extractCode(pk.includes("#") ? pk.split("#")[1] : pk);

    await db.partAssociations.delete([eqCode, partCode]);

    return createResponse(cfg, {
      status: "SUCCESS",
      data: true,
      Result: {
        InfoAlert: { Message: `Part association deleted successfully.` },
      },
    });
  }

  // DELETE lot
  if (method === "delete" && lotGetMatch) {
    const code = extractCode(lotGetMatch[1]);
    await db.partLots.where("lotCode").equals(code).delete();
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
    const foundPart = await db.parts.get(code);
    if (foundPart) {
      return createResponse(cfg, {
        Result: {
          ResultData: {
            Part: foundPart.raw || foundPart,
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
    let partCode = payload.PARTID?.PARTCODE;
    if (!partCode) {
      partCode = await getNextSequence("parts");
    }

    const newPart = {
      ...payload,
      PARTID: {
        ...(payload.PARTID || {}),
        PARTCODE: partCode,
        ORGANIZATIONID: payload.PARTID?.ORGANIZATIONID || { ORGANIZATIONCODE: "*" },
      },
    };

    await db.parts.put({
      code: partCode,
      description: newPart.PARTID?.DESCRIPTION || "",
      trackingType: newPart.TRACKINGTYPE || "LOT",
      uom: newPart.UOM || "EA",
      raw: newPart,
    });

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

    await db.parts.put({
      code: partCode,
      description: payload.PARTID?.DESCRIPTION || "",
      trackingType: payload.TRACKINGTYPE || "LOT",
      uom: payload.UOM || "EA",
      raw: payload,
    });

    return createResponse(cfg, {
      Result: {
        ResultData: {
          PARTCODE: partCode,
          Part: payload,
        },
        InfoAlert: { Message: `Part ${partCode} updated successfully.` },
      },
    });
  }

  // DELETE part
  if (method === "delete" && partGetMatch) {
    const code = extractCode(partGetMatch[1]);
    await db.parts.delete(code);
    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Part ${code} deleted successfully.` },
      },
    });
  }

  // 7b. NONCONFORMITIES (NCR) & OBSERVATIONS SCHEMA FACTORY & CRUD
  // Init NCR: POST /proxy/nonconformitydefaults or GET /nonconformities/init
  if (
    url.includes("/nonconformities/init") ||
    (method === "post" && url.includes("/nonconformitydefaults"))
  ) {
    const nextCode = await getNextSequence("NCR");
    const now = new Date();
    return createResponse(cfg, {
      Result: {
        ResultData: {
          Nonconformity: {
            NONCONFORMITYID: {
              STANDARDENTITYCODE: nextCode,
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            },
            DESCRIPTION: "",
            EQUIPMENTID: {
              EQUIPMENTCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            },
            STATUS: { STATUSCODE: "O", DESCRIPTION: "Open" },
            SEVERITY: { USERCODE: "MED", DESCRIPTION: "Medium" },
            IMPORTANCE: { USERCODE: "M", DESCRIPTION: "Medium" },
            LOCATIONID: { LOCATIONCODE: "" },
            DEPARTMENTID: { DEPARTMENTCODE: "*" },
            TYPE: { USERCODE: "MECH", DESCRIPTION: "Mechanical" },
            NOTE: "",
            USERDEFINEDAREA: { CUSTOMFIELD: [] },
          },
        },
      },
    });
  }

  // Init Observation: POST /proxy//nonconformities/observationdefaults or /observationdefaults
  if (method === "post" && url.includes("observationdefaults")) {
    return createResponse(cfg, {
      Result: {
        ResultData: {
          NonconformityObservationDefault: {
            NONCONFORMITYOBSERVATIONID: {
              NONCONFORMITYCODE: "",
              ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
            },
            STATUS: { STATUSCODE: "U", DESCRIPTION: "Unfinished" },
            SEVERITY: { USERCODE: "MED", DESCRIPTION: "Medium" },
            NOTE: "",
          },
        },
      },
    });
  }

  // Observations List: GET /ncrobservations/:code or GET /proxy/nonconformities/:code/observations
  const ncrObsMatch = url.match(/(?:\/ncrobservations|\/proxy\/nonconformities)\/([^/?#]+)(?:\/observations)?/);
  if (
    (method === "get" && url.includes("/ncrobservations/")) ||
    (method === "get" && url.includes("/observations") && url.includes("nonconformities"))
  ) {
    let ncrCode = "";
    if (url.includes("/ncrobservations/")) {
      ncrCode = extractCode(url.split("/ncrobservations/")[1].split("?")[0]);
    } else if (ncrObsMatch) {
      ncrCode = extractCode(ncrObsMatch[1]);
    }

    const obsList = await db.ncrObservations.where("ncrCode").equals(ncrCode).toArray();
    const formatted = obsList.map((o) => ({
      observation: String(o.id),
      note: o.note || "",
      importance_display: o.importanceDesc || (o.importance === "H" ? "High" : "Medium"),
      severity_display: o.severityDesc || (o.severity === "HIGH" ? "High" : "Medium"),
      daterecorded: o.observationDate ? new Date(o.observationDate).toLocaleDateString() : new Date().toLocaleDateString(),
      workordernum: o.workOrderNum || "",
      status_display: o.statusDesc || "Unfinished",
    }));

    return createResponse(cfg, {
      status: "SUCCESS",
      data: formatted,
      Result: {
        ResultData: formatted,
      },
    });
  }

  // Create Observation: POST /proxy/nonconformities/observations or POST /nonconformities/:code/observations
  if (method === "post" && (url.includes("/nonconformities/observations") || url.endsWith("/observations"))) {
    const obs = reqBody || {};
    const ncrCode = extractCode(
      obs.NONCONFORMITYOBSERVATIONID?.NONCONFORMITYCODE ||
      obs.ncrCode ||
      (ncrObsMatch ? ncrObsMatch[1] : "")
    );
    const workOrderNum =
      obs.OBTrackingDetails?.WORKORDERID?.JOBNUM ||
      obs.workOrderNum ||
      "";
    const note = obs.note || obs.NOTE || "";
    const severity = obs.severity || obs.SEVERITY?.USERCODE || "MED";
    const status = obs.OBSERVATIONSTATUS?.STATUSCODE || obs.status || "U";
    const now = new Date();

    const newId = await db.ncrObservations.add({
      ncrCode,
      observerCode: "TECH01",
      observationDate: now.toISOString(),
      note,
      importance: "M",
      importanceDesc: "Medium",
      severity,
      severityDesc: severity === "HIGH" ? "High" : "Medium",
      status,
      statusDesc: status === "U" ? "Unfinished" : "Completed",
      workOrderNum,
    });

    return createResponse(cfg, {
      status: "SUCCESS",
      data: { id: newId, ncrCode, workOrderNum },
      Result: {
        ResultData: { id: newId, ncrCode, workOrderNum },
        InfoAlert: { Message: "Observation recorded successfully." },
      },
    });
  }

  // READ NCR: GET /proxy/nonconformities/:code or GET /nonconformities/:code
  const ncrMatch = url.match(/(?:\/proxy)?\/nonconformities\/([^/?#]+)/);
  if (method === "get" && ncrMatch && !url.includes("observation") && !url.includes("init") && !url.includes("default")) {
    const code = extractCode(ncrMatch[1]);
    const ncr = await db.nonconformities.get(code);

    if (ncr) {
      // Join with equipment description and location if available
      const eq = ncr.equipmentCode ? await db.equipment.get(ncr.equipmentCode) : null;
      const responsePayload = {
        NONCONFORMITYID: {
          STANDARDENTITYCODE: ncr.code,
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        DESCRIPTION: ncr.description || "",
        EQUIPMENTID: {
          EQUIPMENTCODE: ncr.equipmentCode || "",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        equipmentDesc: eq?.description || ncr.equipmentDesc || "",
        STATUS: {
          STATUSCODE: ncr.statusCode || "O",
          DESCRIPTION: ncr.statusDesc || (ncr.statusCode === "O" ? "Open" : "Closed"),
        },
        SEVERITY: {
          USERCODE: ncr.severity || "MED",
          DESCRIPTION: ncr.severityDesc || (ncr.severity === "MAJ" ? "Major" : "Medium"),
        },
        IMPORTANCE: {
          USERCODE: ncr.importance || "M",
          DESCRIPTION: ncr.importanceDesc || "Medium",
        },
        LOCATIONID: {
          LOCATIONCODE: ncr.locationCode || eq?.locationCode || "",
        },
        DEPARTMENTID: {
          DEPARTMENTCODE: ncr.departmentCode || eq?.departmentCode || "*",
        },
        TYPE: {
          USERCODE: ncr.type || "MECH",
          DESCRIPTION: ncr.type || "Mechanical",
        },
        NOTE: ncr.note || "",
        USERDEFINEDAREA: ncr.raw?.USERDEFINEDAREA || { CUSTOMFIELD: [] },
        ...(ncr.raw || {}),
      };

      return createResponse(cfg, {
        Result: {
          ResultData: {
            Nonconformity: responsePayload,
          },
        },
      });
    }

    return createResponse(cfg, { status: "FAIL", message: "NCR not found" }, 404);
  }

  // CREATE NCR: POST /proxy/nonconformities/ or POST /nonconformities/
  if (method === "post" && (url.endsWith("/nonconformities/") || url.endsWith("/nonconformities"))) {
    const payload = reqBody?.Nonconformity || reqBody || {};
    let ncrCode = payload.NONCONFORMITYID?.STANDARDENTITYCODE || payload.code;
    if (!ncrCode || ncrCode.startsWith("@")) {
      ncrCode = await getNextSequence("NCR");
    }

    const eqCode = extractCode(payload.EQUIPMENTID?.EQUIPMENTCODE || payload.equipmentCode || "");
    const eq = eqCode ? await db.equipment.get(eqCode) : null;
    const now = new Date();

    const record = {
      code: ncrCode,
      description: payload.DESCRIPTION || payload.description || "",
      equipmentCode: eqCode,
      equipmentDesc: eq?.description || "",
      workOrderCode: payload.workOrderCode || "",
      locationCode: payload.LOCATIONID?.LOCATIONCODE || eq?.locationCode || "",
      departmentCode: payload.DEPARTMENTID?.DEPARTMENTCODE || eq?.departmentCode || "*",
      statusCode: payload.STATUS?.STATUSCODE || payload.statusCode || "O",
      statusDesc: payload.STATUS?.DESCRIPTION || (payload.statusCode === "O" ? "Open" : "Closed"),
      severity: payload.SEVERITY?.USERCODE || payload.severity || "MED",
      severityDesc: payload.SEVERITY?.DESCRIPTION || (payload.severity === "MAJ" ? "Major" : "Medium"),
      importance: payload.IMPORTANCE?.USERCODE || payload.importance || "M",
      importanceDesc: payload.IMPORTANCE?.DESCRIPTION || "Medium",
      type: payload.TYPE?.USERCODE || payload.type || "MECH",
      note: payload.NOTE || payload.note || "",
      creationDate: now.toISOString(),
      raw: payload,
    };

    await db.nonconformities.put(record);

    return createResponse(cfg, {
      Result: {
        ResultData: {
          NONCONFORMITYID: { STANDARDENTITYCODE: ncrCode },
          Nonconformity: payload,
        },
        InfoAlert: { Message: `Nonconformity ${ncrCode} created successfully.` },
      },
    });
  }

  // UPDATE NCR: PUT /proxy/nonconformities/ or PUT /nonconformities/
  if (method === "put" && (url.endsWith("/nonconformities/") || url.endsWith("/nonconformities"))) {
    const payload = reqBody?.Nonconformity || reqBody || {};
    const ncrCode = extractCode(payload.NONCONFORMITYID?.STANDARDENTITYCODE || payload.code || "");
    const existing = await db.nonconformities.get(ncrCode);

    const eqCode = extractCode(payload.EQUIPMENTID?.EQUIPMENTCODE || existing?.equipmentCode || "");
    const eq = eqCode ? await db.equipment.get(eqCode) : null;

    const updated = {
      ...(existing || {}),
      code: ncrCode,
      description: payload.DESCRIPTION ?? existing?.description ?? "",
      equipmentCode: eqCode,
      equipmentDesc: eq?.description || existing?.equipmentDesc || "",
      locationCode: payload.LOCATIONID?.LOCATIONCODE ?? existing?.locationCode ?? "",
      departmentCode: payload.DEPARTMENTID?.DEPARTMENTCODE ?? existing?.departmentCode ?? "*",
      statusCode: payload.STATUS?.STATUSCODE ?? existing?.statusCode ?? "O",
      statusDesc: payload.STATUS?.DESCRIPTION ?? existing?.statusDesc ?? "Open",
      severity: payload.SEVERITY?.USERCODE ?? existing?.severity ?? "MED",
      severityDesc: payload.SEVERITY?.DESCRIPTION ?? existing?.severityDesc ?? "Medium",
      importance: payload.IMPORTANCE?.USERCODE ?? existing?.importance ?? "M",
      importanceDesc: payload.IMPORTANCE?.DESCRIPTION ?? existing?.importanceDesc ?? "Medium",
      type: payload.TYPE?.USERCODE ?? existing?.type ?? "MECH",
      note: payload.NOTE ?? existing?.note ?? "",
      raw: payload,
    };

    await db.nonconformities.put(updated);

    return createResponse(cfg, {
      Result: {
        ResultData: {
          NONCONFORMITYID: { STANDARDENTITYCODE: ncrCode },
          Nonconformity: payload,
        },
        InfoAlert: { Message: `Nonconformity ${ncrCode} updated successfully.` },
      },
    });
  }

  // DELETE NCR: DELETE /proxy/nonconformities/:code (Cascade delete observations & comments)
  if (method === "delete" && ncrMatch && !url.includes("observation")) {
    const code = extractCode(ncrMatch[1]);
    await db.transaction("rw", [db.nonconformities, db.ncrObservations, db.comments], async () => {
      await db.nonconformities.delete(code);
      // Cascade delete observations
      await db.ncrObservations.where("ncrCode").equals(code).delete();
      // Cascade delete comments
      const ncrComments = await db.comments.where("entityCode").equals(code).toArray();
      for (const c of ncrComments) {
        if (c.entityType === "NOCF" || c.entityType === "NCNC") {
          await db.comments.delete(c.id);
        }
      }
    });

    return createResponse(cfg, {
      Result: {
        InfoAlert: { Message: `Nonconformity ${code} deleted successfully.` },
      },
    });
  }

  // 8. FULL DYNAMIC SEARCH GRIDS WITH INDEXEDDB QUERYING
  if (
    url.includes("/grids") ||
    url.includes("/proxy/grids") ||
    url.includes("/grids/data")
  ) {
    const gridName = reqBody?.gridName || reqBody?.gridID || "";
    const filterList = reqBody?.filter || reqBody?.gridFilter || [];

    // Helper: evaluate item against filters
    const matchesFilters = (item, getterMap) => {
      if (!Array.isArray(filterList) || filterList.length === 0) return true;
      for (const f of filterList) {
        const fieldName = (f.fieldName || f.name || "").toLowerCase();
        const fieldValue = String(f.fieldValue ?? f.value ?? "").toLowerCase();
        const operator = (f.operator || "=").toUpperCase();
        if (!fieldValue) continue;

        const valGetter = getterMap[fieldName];
        const actualVal = valGetter ? String(valGetter(item) ?? "").toLowerCase() : "";

        if (operator === "BEGINS") {
          if (!actualVal.startsWith(fieldValue)) return false;
        } else if (operator === "CONTAINS") {
          if (!actualVal.includes(fieldValue)) return false;
        } else if (operator === "NOTCONTAINS") {
          if (actualVal.includes(fieldValue)) return false;
        } else if (operator === "=") {
          if (actualVal !== fieldValue) return false;
        }
      }
      return true;
    };

    // A. Work Orders Search Table
    if (gridName === "WSJOBS") {
      let items = await db.workorders.toArray();

      const woGetterMap = {
        workordernum: (w) => w.code,
        workorder: (w) => w.code,
        description: (w) => w.description,
        equipment: (w) => w.equipmentCode,
        workorderstatus_display: (w) => w.statusDesc,
        status: (w) => w.statusDesc,
        workordertype_display: (w) => w.typeDesc,
        type: (w) => w.typeDesc,
        department: (w) => w.department,
        priority_display: (w) => w.priorityDesc,
      };

      items = items.filter((w) => matchesFilters(w, woGetterMap));

      // Relational equipment joining: fetch equipment description
      const equipmentMap = {};
      const allEq = await db.equipment.toArray();
      allEq.forEach((eq) => {
        equipmentMap[eq.code] = eq.description;
      });

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
        id: wo.code,
        cell: [
          { t: "workordernum", val: wo.code, value: wo.code, order: 1 },
          { t: "description", val: wo.description, value: wo.description, order: 2 },
          { t: "equipment", val: wo.equipmentCode, value: wo.equipmentCode, order: 3 },
          { t: "workorderstatus_display", val: wo.statusDesc || "Released", value: wo.statusDesc || "Released", order: 4 },
          { t: "workordertype_display", val: wo.typeDesc || "Corrective", value: wo.typeDesc || "Corrective", order: 5 },
          { t: "department", val: wo.department || "*", value: wo.department || "*", order: 6 },
          { t: "priority_display", val: wo.priorityDesc || "Medium", value: wo.priorityDesc || "Medium", order: 7 },
          { t: "schedstartdate", val: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", value: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", order: 8 },
          { t: "datecreated", val: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", value: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", order: 9 },
          { t: "schedenddate", val: wo.schedEndDate ? wo.schedEndDate.slice(0, 10) : "", value: wo.schedEndDate ? wo.schedEndDate.slice(0, 10) : "", order: 10 },
          { t: "organization", val: "*", value: "*", order: 11 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("WSJOBS", rows, fields));
    }

    // A2. Work Order Part Usage Grid (WSJOBS_PAR)
    if (gridName === "WSJOBS_PAR") {
      const rows = [];
      return createResponse(cfg, buildGridPayload("WSJOBS_PAR", rows, [
        { name: "partcode", label: "Part", order: 1, width: 120, dataType: "VARCHAR" },
        { name: "partdescription", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
        { name: "plannedqty", label: "Planned", order: 3, width: 80, dataType: "VARCHAR" },
        { name: "usedqty", label: "Used", order: 4, width: 80, dataType: "VARCHAR" },
        { name: "activity_display", label: "Activity", order: 5, width: 120, dataType: "VARCHAR" },
        { name: "storecode", label: "Store", order: 6, width: 100, dataType: "VARCHAR" },
        { name: "partuom", label: "UOM", order: 7, width: 60, dataType: "VARCHAR" },
      ]));
    }

    // B. Assets Search Table
    if (gridName === "OSOBJA") {
      let items = await db.equipment.where("type").equals("A").toArray();

      const astGetterMap = {
        equipmentno: (a) => a.code,
        equipment: (a) => a.code,
        equipmentdesc: (a) => a.description,
        department: (a) => a.departmentCode,
        assetstatus: (a) => a.statusDesc,
      };

      items = items.filter((a) => matchesFilters(a, astGetterMap));

      const fields = [
        { name: "equipmentno", label: "Equipment", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "assetstatus", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "organization", label: "Organization", order: 5, width: 100, dataType: "VARCHAR" },
      ];

      const rows = items.map((ast) => ({
        id: ast.code,
        cell: [
          { t: "equipmentno", val: ast.code, value: ast.code, order: 1 },
          { t: "equipmentdesc", val: ast.description, value: ast.description, order: 2 },
          { t: "department", val: ast.departmentCode || "*", value: ast.departmentCode || "*", order: 3 },
          { t: "assetstatus", val: ast.statusDesc || "In Service", value: ast.statusDesc || "In Service", order: 4 },
          { t: "organization", val: "*", value: "*", order: 5 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSOBJA", rows, fields));
    }

    // C. Systems Search Table
    if (gridName === "OSOBJS" || (gridName.includes("SYS") && !gridName.includes("BSUCOD"))) {
      let items = await db.equipment.where("type").equals("S").toArray();

      const fields = [
        { name: "equipmentno", label: "System", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "assetstatus", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "organization", label: "Organization", order: 5, width: 100, dataType: "VARCHAR" },
      ];

      const rows = items.map((sys) => ({
        id: sys.code,
        cell: [
          { t: "equipmentno", val: sys.code, value: sys.code, order: 1 },
          { t: "equipmentdesc", val: sys.description, value: sys.description, order: 2 },
          { t: "department", val: sys.departmentCode || "*", value: sys.departmentCode || "*", order: 3 },
          { t: "assetstatus", val: sys.statusDesc || "In Service", value: sys.statusDesc || "In Service", order: 4 },
          { t: "organization", val: "*", value: "*", order: 5 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSOBJS", rows, fields));
    }

    // C2. Positions Search Table (OSOBJP)
    if (gridName === "OSOBJP") {
      let items = await db.equipment.where("type").equals("P").toArray();

      const fields = [
        { name: "equipmentno", label: "Position", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "department", label: "Department", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "assetstatus", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "organization", label: "Organization", order: 5, width: 100, dataType: "VARCHAR" },
      ];

      const rows = items.map((pos) => ({
        id: pos.code,
        cell: [
          { t: "equipmentno", val: pos.code, value: pos.code, order: 1 },
          { t: "equipmentdesc", val: pos.description, value: pos.description, order: 2 },
          { t: "department", val: pos.departmentCode || "*", value: pos.departmentCode || "*", order: 3 },
          { t: "assetstatus", val: pos.statusDesc || "In Service", value: pos.statusDesc || "In Service", order: 4 },
          { t: "organization", val: "*", value: "*", order: 5 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSOBJP", rows, fields));
    }

    // C3. Parts Search Table (SSPART)
    if (gridName === "SSPART") {
      let items = await db.parts.toArray();

      const fields = [
        { name: "partcode", label: "Part", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "uom", label: "UOM", order: 3, width: 80, dataType: "VARCHAR" },
        { name: "trackingtype", label: "Tracking Type", order: 4, width: 120, dataType: "VARCHAR" },
      ];

      const rows = items.map((prt) => ({
        id: prt.code,
        cell: [
          { t: "partcode", val: prt.code, value: prt.code, order: 1 },
          { t: "description", val: prt.description, value: prt.description, order: 2 },
          { t: "uom", val: prt.uom || "EA", value: prt.uom || "EA", order: 3 },
          { t: "trackingtype", val: prt.trackingType || "LOT", value: prt.trackingType || "LOT", order: 4 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("SSPART", rows, fields));
    }

    // D. Statuses LOV (BSAUTH_HDR)
    if (gridName === "BSAUTH_HDR") {
      const statusOptions = [
        { tostatus: "R", tostatusdesc: "Released", fromstatusdesc: "Released" },
        { tostatus: "C", tostatusdesc: "Closed", fromstatusdesc: "Closed" },
        { tostatus: "I", tostatusdesc: "In Service", fromstatusdesc: "In Service" },
        { tostatus: "O", tostatusdesc: "Open", fromstatusdesc: "Open" },
        { tostatus: "U", tostatusdesc: "Unfinished", fromstatusdesc: "Unfinished" },
      ];
      const rows = statusOptions.map((s, idx) => ({
        id: `ST_${idx}`,
        cell: [
          { t: "tostatus", val: s.tostatus, value: s.tostatus, order: 1 },
          { t: "code", val: s.tostatus, value: s.tostatus, order: 1 },
          { t: "tostatusdesc", val: s.tostatusdesc, value: s.tostatusdesc, order: 2 },
          { t: "description", val: s.tostatusdesc, value: s.tostatusdesc, order: 2 },
          { t: "fromstatusdesc", val: s.fromstatusdesc, value: s.fromstatusdesc, order: 3 },
        ],
      }));
      return createResponse(cfg, buildGridPayload("BSAUTH_HDR", rows, [
        { name: "tostatus", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "tostatusdesc", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
      ]));
    }

    // E. User Codes LOV (BSUCOD_HDR / LVALLCODES / LVCRIT) - types, priorities, criticality, severity, importance
    if (gridName === "BSUCOD_HDR" || gridName === "LVALLCODES" || gridName === "LVCRIT") {
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
        { usercode: "MAJ", systemcode: "MAJ", usercodedescription: "Major" },
        { usercode: "MED", systemcode: "MED", usercodedescription: "Medium" },
        { usercode: "MIN", systemcode: "MIN", usercodedescription: "Minor" },
        { usercode: "HIGH", systemcode: "HIGH", usercodedescription: "High" },
        { usercode: "CRIT", systemcode: "CRIT", usercodedescription: "Critical" },
      ];
      const rows = userCodes.map((c, idx) => ({
        id: `UC_${idx}`,
        cell: [
          { t: "usercode", val: c.usercode, value: c.usercode, order: 1 },
          { t: "code", val: c.usercode, value: c.usercode, order: 1 },
          { t: "systemcode", val: c.systemcode, value: c.systemcode, order: 2 },
          { t: "usercodedescription", val: c.usercodedescription, value: c.usercodedescription, order: 3 },
          { t: "description", val: c.usercodedescription, value: c.usercodedescription, order: 3 },
        ],
      }));
      return createResponse(cfg, buildGridPayload(gridName, rows, [
        { name: "usercode", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "code", label: "Code", order: 1, width: 100, dataType: "VARCHAR" },
        { name: "usercodedescription", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
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

    // G. Equipment History (EUMLWH)
    if (gridName === "EUMLWH") {
      const eqFilter = filterList?.find((f) => f.fieldName === "woobject");
      const eqCode = eqFilter ? extractCode(eqFilter.fieldValue) : "";
      const wos = eqCode
        ? await db.workorders.where("equipmentCode").equals(eqCode).toArray()
        : await db.workorders.toArray();

      const fields = [
        { name: "wocode", label: "Work Order", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "wotypedescription", label: "Type", order: 2, width: 150, dataType: "VARCHAR" },
        { name: "woobject", label: "Equipment", order: 3, width: 140, dataType: "VARCHAR" },
        { name: "wocompleted", label: "Completed", order: 4, width: 140, dataType: "DATE" },
      ];

      const rows = wos.map((wo) => ({
        id: wo.code,
        cell: [
          { t: "wocode", val: wo.code, value: wo.code, order: 1 },
          { t: "wotypedescription", val: wo.typeDesc, value: wo.typeDesc, order: 2 },
          { t: "woobject", val: wo.equipmentCode, value: wo.equipmentCode, order: 3 },
          { t: "wocompleted", val: wo.schedEndDate?.slice(0, 10), value: wo.schedEndDate?.slice(0, 10), order: 4 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("EUMLWH", rows, fields));
    }

    // G2. Equipment Events / Work Orders (OSVEVT)
    if (gridName === "OSVEVT") {
      const eqParam = reqBody?.gridParam?.["parameter.object"] || reqBody?.["parameter.object"];
      const eqFilter = filterList?.find((f) => f.fieldName === "equipment");
      const eqCode = extractCode(eqParam || eqFilter?.fieldValue || "");
      const wos = eqCode
        ? await db.workorders.where("equipmentCode").equals(eqCode).toArray()
        : await db.workorders.toArray();

      const fields = [
        { name: "eventno", label: "Work Order", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "equipment", label: "Equipment", order: 2, width: 140, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 3, width: 250, dataType: "VARCHAR" },
        { name: "statusdisplay", label: "Status", order: 4, width: 120, dataType: "VARCHAR" },
        { name: "datecreated", label: "Relevant Date", order: 5, width: 140, dataType: "DATE" },
        { name: "wotype", label: "Type", order: 6, width: 100, dataType: "VARCHAR" },
        { name: "organization", label: "Org", order: 7, width: 100, dataType: "VARCHAR" },
      ];

      const rows = wos.map((wo) => ({
        id: wo.code,
        cell: [
          { t: "eventno", val: wo.code, value: wo.code, order: 1 },
          { t: "equipment", val: wo.equipmentCode, value: wo.equipmentCode, order: 2 },
          { t: "description", val: wo.description, value: wo.description, order: 3 },
          { t: "statusdisplay", val: wo.statusDesc || "Released", value: wo.statusDesc || "Released", order: 4 },
          { t: "datecreated", val: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", value: wo.schedStartDate ? wo.schedStartDate.slice(0, 10) : "", order: 5 },
          { t: "wotype", val: wo.type || "CORR", value: wo.type || "CORR", order: 6 },
          { t: "organization", val: "*", value: "*", order: 7 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("OSVEVT", rows, fields));
    }

    // G3. Equipment Meters (OSMETE)
    if (gridName === "OSMETE") {
      return createResponse(cfg, buildGridPayload("OSMETE", [], [
        { name: "equipment", label: "Equipment", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "metercode", label: "Meter", order: 2, width: 140, dataType: "VARCHAR" },
        { name: "organization", label: "Org", order: 3, width: 100, dataType: "VARCHAR" },
      ]));
    }

    // G4. Equipment Types LOV (OCOBJC)
    if (gridName === "OCOBJC") {
      const codeFilter = filterList?.find((f) => f.fieldName === "obj_code");
      const eqCode = codeFilter ? extractCode(codeFilter.fieldValue) : "";
      let eqType = "A";
      if (eqCode) {
        const found = await db.equipment.get(eqCode);
        if (found) eqType = found.type;
      }
      const rows = [
        {
          id: eqCode || "AST-01",
          cell: [
            { t: "obj_code", val: eqCode, value: eqCode, order: 1 },
            { t: "obj_obrtype", val: eqType, value: eqType, order: 2 },
          ],
        },
      ];
      return createResponse(cfg, buildGridPayload("OCOBJC", rows, [
        { name: "obj_code", label: "Code", order: 1, width: 140, dataType: "VARCHAR" },
        { name: "obj_obrtype", label: "Type", order: 2, width: 100, dataType: "VARCHAR" },
      ]));
    }

    // G5. Parts Associated Grid (BSPARA)
    if (gridName === "BSPARA") {
      const eqParam = reqBody?.gridParam?.["param.valuecode"] || reqBody?.["param.valuecode"];
      const eqFilter = filterList?.find((f) => f.fieldName === "papartcode" || f.fieldName === "equipmentcode");
      const eqCode = extractCode(eqParam || eqFilter?.fieldValue || "");

      let associations = [];
      if (eqCode) {
        associations = await db.partAssociations.where("equipmentCode").equals(eqCode).toArray();
      } else {
        associations = await db.partAssociations.toArray();
      }

      const rows = associations.map((pa, idx) => ({
        id: `${pa.equipmentCode}_${pa.partCode}`,
        cell: [
          { t: "papartcode", val: pa.partCode, value: pa.partCode, order: 1 },
          { t: "description", val: pa.description, value: pa.description, order: 2 },
          { t: "quantity", val: String(pa.quantity), value: String(pa.quantity), order: 3 },
          { t: "partuom", val: pa.uom || "EA", value: pa.uom || "EA", order: 4 },
          { t: "valuecode", val: pa.equipmentCode, value: pa.equipmentCode, order: 5 },
          { t: "partassociatedpk", val: `${pa.equipmentCode}#${pa.partCode}`, value: `${pa.equipmentCode}#${pa.partCode}`, order: 6 },
        ],
      }));

      return createResponse(cfg, buildGridPayload("BSPARA", rows, [
        { name: "papartcode", label: "Part", order: 1, width: 120, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 2, width: 200, dataType: "VARCHAR" },
        { name: "quantity", label: "Quantity", order: 3, width: 80, dataType: "VARCHAR" },
        { name: "partuom", label: "UOM", order: 4, width: 60, dataType: "VARCHAR" },
        { name: "valuecode", label: "Equipment", order: 5, width: 100, dataType: "VARCHAR" },
        { name: "partassociatedpk", label: "PK", order: 6, width: 100, dataType: "VARCHAR" },
      ]));
    }

    // H. Nonconformities (NCR) Search Grid (OSNCHD / LVNCNC)
    if (gridName === "OSNCHD" || gridName === "LVNCNC" || gridName.includes("NCNC") || gridName.includes("NCHD")) {
      const allNcrs = await db.nonconformities.toArray();
      const getterMap = {
        nonconformity: (n) => n.code,
        equipment: (n) => n.equipmentCode,
        description: (n) => n.description,
        status_display: (n) => n.statusDesc || (n.statusCode === "O" ? "Open" : "Closed"),
        severity_display: (n) => n.severityDesc || (n.severity === "MAJ" ? "Major" : "Medium"),
        location: (n) => n.locationCode,
      };

      const filtered = allNcrs.filter((n) => matchesFilters(n, getterMap));
      const rows = filtered.map((n) => ({
        id: n.code,
        cell: [
          { t: "nonconformity", val: n.code, value: n.code, order: 1 },
          { t: "description", val: n.description, value: n.description, order: 2 },
          { t: "equipment", val: n.equipmentCode, value: n.equipmentCode, order: 3 },
          { t: "equipmentdesc", val: n.equipmentDesc || "", value: n.equipmentDesc || "", order: 4 },
          { t: "status_display", val: n.statusDesc || (n.statusCode === "O" ? "Open" : "Closed"), value: n.statusDesc || (n.statusCode === "O" ? "Open" : "Closed"), order: 5 },
          { t: "severity_display", val: n.severityDesc || (n.severity === "MAJ" ? "Major" : "Medium"), value: n.severityDesc || (n.severity === "MAJ" ? "Major" : "Medium"), order: 6 },
          { t: "location", val: n.locationCode || "", value: n.locationCode || "", order: 7 },
          { t: "organization", val: "*", value: "*", order: 8 },
        ],
      }));

      return createResponse(cfg, buildGridPayload(gridName, rows, [
        { name: "nonconformity", label: "NCR", order: 1, width: 110, dataType: "VARCHAR" },
        { name: "description", label: "Description", order: 2, width: 250, dataType: "VARCHAR" },
        { name: "equipment", label: "Equipment", order: 3, width: 120, dataType: "VARCHAR" },
        { name: "equipmentdesc", label: "Equipment Description", order: 4, width: 180, dataType: "VARCHAR" },
        { name: "status_display", label: "Status", order: 5, width: 100, dataType: "VARCHAR" },
        { name: "severity_display", label: "Severity", order: 6, width: 100, dataType: "VARCHAR" },
        { name: "location", label: "Location", order: 7, width: 100, dataType: "VARCHAR" },
      ]));
    }

    // I. Generic / Fallback Grid LOV
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
  if (url.includes("/autocomplete") && url.includes("/users")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [{ code: "TECH01", desc: "Technician 01", usercode: "TECH01", description: "Technician 01" }, { code: "ADMIN", desc: "Administrator", usercode: "ADMIN", description: "Administrator" }],
    });
  }

  if (url.includes("/autocomplete/eqp")) {
    const allEq = await db.equipment.toArray();
    return createResponse(cfg, {
      status: "SUCCESS",
      data: allEq.map((e) => ({
        code: e.code,
        desc: e.description,
        org: "*",
      })),
    });
  }

  // 9b. Meters Endpoints
  if (url.includes("/meters/read") || url.includes("/physicalmeters")) {
    return createResponse(cfg, {
      status: "SUCCESS",
      data: [],
      Result: {
        ResultData: {
          PhysicalMeter: {},
        },
      },
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
    const wos = await db.workorders.toArray();
    const eqs = await db.equipment.toArray();
    const prts = await db.parts.toArray();
    const lots = await db.partLots.toArray();

    const results = [
      ...wos.map((wo) => ({
        code: wo.code,
        description: wo.description,
        type: "WORKORDER",
        link: `/workorder/${wo.code}`,
      })),
      ...eqs.map((e) => ({
        code: e.code,
        description: e.description,
        type: e.type === "A" ? "ASSET" : e.type === "S" ? "SYSTEM" : "POSITION",
        link: e.type === "A" ? `/asset/${e.code}` : e.type === "S" ? `/system/${e.code}` : `/position/${e.code}`,
      })),
      ...prts.map((p) => ({
        code: p.code,
        description: p.description,
        type: "PART",
        link: `/part/${p.code}`,
      })),
      ...lots.map((l) => ({
        code: l.lotCode,
        description: l.description,
        type: "LOT",
        link: `/lot/${l.lotCode}`,
      })),
    ];

    return createResponse(cfg, {
      status: "SUCCESS",
      data: results,
    });
  }

  // 11. Extra Equipment endpoints
  if (url.includes("/equipment/type")) {
    const code = extractCode(url.split("/").pop());
    const eq = await db.equipment.get(code);
    const eqType = eq ? eq.type : "A";
    return createResponse(cfg, {
      status: "SUCCESS",
      data: eqType,
    });
  }

  // 12. UNIFIED COMMENTS & DOCUMENTS TABLE (Polymorphic join: entityCode, entityType)
  // GET /comments?entityCode=:code&entityKeyCode=:key (or entityType)
  if (method === "get" && url.includes("/comments")) {
    const urlObj = new URL(url, "http://localhost");
    const requestedType = urlObj.searchParams.get("entityCode") || urlObj.searchParams.get("entityType") || "EVNT";
    const entityCode = extractCode(urlObj.searchParams.get("entityKeyCode") || "");

    let comments = await db.comments
      .where({ entityCode, entityType: requestedType })
      .reverse()
      .sortBy("creationDate");

    // If requested is NOCF or NCNC, check either code in case comments were saved with either tag
    if (comments.length === 0 && (requestedType === "NOCF" || requestedType === "NCNC")) {
      const alternateType = requestedType === "NOCF" ? "NCNC" : "NOCF";
      comments = await db.comments
        .where({ entityCode, entityType: alternateType })
        .reverse()
        .sortBy("creationDate");
    }

    const formattedComments = comments.map((c, idx) => ({
      ...c,
      pk: String(c.id || idx),
      creationDate: c.creationDate || new Date().toISOString(),
      userDate: c.creationDate || c.userDate || new Date().toISOString(),
      userDesc: c.userDesc || c.userCode || "TECH01",
      creationUserDesc: c.creationUserDesc || c.creationUserCode || "TECH01",
    }));

    return createResponse(cfg, {
      status: "SUCCESS",
      data: formattedComments,
      Result: {
        ResultData: formattedComments,
      },
    });
  }

  // POST create comment: /comments/ or /comments
  if (method === "post" && (url.includes("/comments/") || url.endsWith("/comments"))) {
    const comment = reqBody || {};
    const entityType = comment.entityCode || comment.entityType || "EVNT";
    const entityCode = extractCode(comment.entityKeyCode || comment.entityKey || "");
    const now = new Date();
    const userCode = comment.userCode || "TECH01";

    const newComment = {
      entityCode,
      entityType,
      text: comment.text || "",
      creationDate: now.toISOString(),
      userDate: now.toLocaleString(),
      userCode,
      userDesc: userCode,
      creationUserCode: userCode,
      creationUserDesc: userCode,
    };

    const id = await db.comments.put(newComment);
    newComment.id = id;
    newComment.pk = String(id);

    return createResponse(cfg, {
      status: "SUCCESS",
      data: newComment,
      Result: {
        ResultData: newComment,
        InfoAlert: { Message: "Comment created successfully." },
      },
    });
  }

  // PUT update comment: /comments/ or /comments
  if (method === "put" && (url.includes("/comments/") || url.endsWith("/comments"))) {
    const comment = reqBody || {};
    const id = comment.id ? Number(comment.id) : undefined;
    if (id) {
      await db.comments.update(id, { text: comment.text });
    }
    return createResponse(cfg, {
      status: "SUCCESS",
      data: comment,
      Result: {
        ResultData: comment,
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
