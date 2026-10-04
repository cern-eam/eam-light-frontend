// LocalStorage Database & Seed Data for Standalone EAM Light

const WO_STORAGE_KEY = "eamlight_mock_workorders";
const AST_STORAGE_KEY = "eamlight_mock_assets";
const POS_STORAGE_KEY = "eamlight_mock_positions";
const SYS_STORAGE_KEY = "eamlight_mock_systems";
const PRT_STORAGE_KEY = "eamlight_mock_parts";
const LOT_STORAGE_KEY = "eamlight_mock_lots";
const ACT_STORAGE_KEY = "eamlight_mock_activities";
const CHK_STORAGE_KEY = "eamlight_mock_checklists";
const CMT_STORAGE_KEY = "eamlight_mock_comments";

const initialWorkOrders = [
  {
    WORKORDERID: {
      JOBNUM: "WO-1001",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Inspect Cooling Pump 01",
    },
    STATUS: { STATUSCODE: "R", DESCRIPTION: "Released" },
    TYPE: { TYPECODE: "CORR", DESCRIPTION: "Corrective" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    EQUIPMENTID: {
      EQUIPMENTCODE: "SYS-01",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
    },
    LOCATIONID: { LOCATIONCODE: "LOC-BLD1" },
    PRIORITY: { PRIORITYCODE: "M", DESCRIPTION: "Medium" },
    ASSIGNEDTO: { PERSONCODE: "TECH01" },
    SCHEDSTARTDATE: new Date().toISOString(),
    SCHEDENDDATE: new Date(Date.now() + 86400000).toISOString(),
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
  {
    WORKORDERID: {
      JOBNUM: "WO-1002",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Calibrate Pressure Sensors",
    },
    STATUS: { STATUSCODE: "R", DESCRIPTION: "Released" },
    TYPE: { TYPECODE: "PREV", DESCRIPTION: "Preventive" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    EQUIPMENTID: {
      EQUIPMENTCODE: "AST-001",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
    },
    LOCATIONID: { LOCATIONCODE: "LOC-BLD2" },
    PRIORITY: { PRIORITYCODE: "H", DESCRIPTION: "High" },
    ASSIGNEDTO: { PERSONCODE: "TECH01" },
    SCHEDSTARTDATE: new Date().toISOString(),
    SCHEDENDDATE: new Date(Date.now() + 172800000).toISOString(),
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

const initialAssets = [
  {
    ASSETID: {
      EQUIPMENTCODE: "AST-001",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Chilled Water Primary Pump",
    },
    STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    CATEGORYID: { CATEGORYCODE: "PUMP" },
    CLASSID: { CLASSCODE: "CRITICAL" },
    CRITICALITYID: { CRITICALITYCODE: "A" },
    COMMISSIONDATE: new Date().toISOString(),
    systemTypeCode: "A",
    AssetParentHierarchy: {},
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
  {
    ASSETID: {
      EQUIPMENTCODE: "AST-002",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Backup Air Compressor",
    },
    STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    CATEGORYID: { CATEGORYCODE: "COMP" },
    CLASSID: { CLASSCODE: "STANDARD" },
    CRITICALITYID: { CRITICALITYCODE: "B" },
    COMMISSIONDATE: new Date().toISOString(),
    systemTypeCode: "A",
    AssetParentHierarchy: {},
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

const initialPositions = [
  {
    POSITIONID: {
      EQUIPMENTCODE: "POS-01",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Cooling Circuit Pos 01",
    },
    STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    CATEGORYID: { CATEGORYCODE: "POS" },
    CLASSID: { CLASSCODE: "STANDARD" },
    CRITICALITYID: { CRITICALITYCODE: "M" },
    COMMISSIONDATE: new Date().toISOString(),
    systemTypeCode: "P",
    PositionParentHierarchy: {},
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

const initialSystems = [
  {
    SYSTEMID: {
      EQUIPMENTCODE: "SYS-01",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Main Plant Ventilation & Cooling System",
    },
    STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
    DEPARTMENTID: { DEPARTMENTCODE: "*" },
    CATEGORYID: { CATEGORYCODE: "HVAC" },
    CLASSID: { CLASSCODE: "CRITICAL" },
    CRITICALITYID: { CRITICALITYCODE: "A" },
    COMMISSIONDATE: new Date().toISOString(),
    systemTypeCode: "S",
    SystemParentHierarchy: {},
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

const initialParts = [
  {
    PARTID: {
      PARTCODE: "PRT-100",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Pump Mechanical Seal Ring",
    },
    UOM: "EA",
    TRACKINGBYASSET: false,
    COMMODITYCODE: "MECH",
    TRACKINGTYPE: "LOT",
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

const initialLots = [
  {
    LOTID: {
      LOTCODE: "LOT-A",
      PARTCODE: "PRT-100",
      ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
      DESCRIPTION: "Batch A - High Precision Seals",
    },
    QTY: 50,
    STATUS: { STATUSCODE: "A", DESCRIPTION: "Available" },
    USERDEFINEDAREA: { CUSTOMFIELD: [] },
  },
];

// Initial Activities for WO-1001 & WO-1002
const initialActivities = {
  "WO-1001": [
    {
      activityCode: "10",
      activityNote: "Safety Inspection",
      workOrderNumber: "WO-1001",
      peopleRequired: 1,
      estimatedHours: 2,
      hoursRemaining: 2,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "MECH",
      taskCode: "TSK-01",
      taskDesc: "Safety Check & Calibration",
      checklists: [],
    },
    {
      activityCode: "20",
      activityNote: "Component Replacement",
      workOrderNumber: "WO-1001",
      peopleRequired: 2,
      estimatedHours: 4,
      hoursRemaining: 4,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "MECH",
      taskCode: "TSK-02",
      taskDesc: "Mechanical Component Swap",
      checklists: [],
    },
  ],
  "WO-1002": [
    {
      activityCode: "10",
      activityNote: "Calibration",
      workOrderNumber: "WO-1002",
      peopleRequired: 1,
      estimatedHours: 1.5,
      hoursRemaining: 1.5,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "ELECT",
      taskCode: "TSK-03",
      taskDesc: "Sensor Calibration",
      checklists: [],
    },
  ],
};

// Initial Checklists
const initialChecklists = {
  "WO-1001": [
    {
      checklistCode: "CHK-01",
      checkListCode: "CHK-01",
      workOrderCode: "WO-1001",
      activityCode: "10",
      sequence: 1,
      desc: "Safety lockout applied?",
      type: "01", // Yes / No Checkbox (Completed)
      result: null, // "COMPLETED" or null
      completed: false,
      notes: "",
      required: true,
      equipmentCode: "SYS-01",
      equipmentDesc: "Main Plant Ventilation & Cooling System",
      possibleFindings: [],
      finding: null,
      numericValue: null,
      freeText: null,
      performedBy: null,
    },
    {
      checklistCode: "CHK-02",
      checkListCode: "CHK-02",
      workOrderCode: "WO-1001",
      activityCode: "10",
      sequence: 2,
      desc: "Operating pressure (Bar)",
      type: "04", // Quantitative / Numeric with min/max
      result: null,
      completed: false,
      notes: "",
      required: true,
      minimumValue: 2.0,
      maximumValue: 8.0,
      numericValue: 4.5,
      UOM: "Bar",
      equipmentCode: "SYS-01",
      equipmentDesc: "Main Plant Ventilation & Cooling System",
      possibleFindings: [],
      finding: null,
      freeText: null,
      performedBy: null,
    },
    {
      checklistCode: "CHK-03",
      checkListCode: "CHK-03",
      workOrderCode: "WO-1001",
      activityCode: "10",
      sequence: 3,
      desc: "Visual inspection notes",
      type: "03", // Qualitative / Finding
      result: null,
      completed: false,
      notes: "",
      required: false,
      finding: null,
      possibleFindings: [
        { code: "NORMAL", desc: "Normal - No wear detected" },
        { code: "MINOR_WEAR", desc: "Minor surface wear noted" },
        { code: "ACTION_REQ", desc: "Immediate action required" },
      ],
      numericValue: null,
      freeText: null,
      equipmentCode: "SYS-01",
      equipmentDesc: "Main Plant Ventilation & Cooling System",
      performedBy: null,
    },
  ],
};

// Initial Comments
const initialComments = {
  "EVNT_WO-1001": [
    {
      pk: "1",
      entityCode: "EVNT",
      entityKeyCode: "WO-1001",
      text: "Initial inspection scheduled for cooling circuit pump.",
      creationDate: new Date(Date.now() - 3600000).toISOString(),
      userDate: new Date(Date.now() - 3600000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
  ],
  "OBJ_AST-001": [
    {
      pk: "2",
      entityCode: "OBJ",
      entityKeyCode: "AST-001",
      text: "Asset installed and passed vibration tests.",
      creationDate: new Date(Date.now() - 86400000).toISOString(),
      userDate: new Date(Date.now() - 86400000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
  ],
};

const getStored = (key, fallback) => {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`[mockDb] Failed reading key "${key}":`, e);
  }
  setStored(key, fallback);
  return fallback;
};

const setStored = (key, data) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn(`[mockDb] Failed writing key "${key}":`, e);
  }
};

export const extractCode = (raw) => {
  if (!raw) return "";
  const decoded = decodeURIComponent(String(raw));
  return decoded.split("#")[0].trim();
};

export const mockDb = {
  // WORK ORDERS
  getWorkOrders() {
    return getStored(WO_STORAGE_KEY, initialWorkOrders);
  },
  getWorkOrder(id) {
    const code = extractCode(id);
    return this.getWorkOrders().find((w) => w.WORKORDERID?.JOBNUM === code) || null;
  },
  saveWorkOrder(workOrder) {
    const items = this.getWorkOrders();
    const code = workOrder.WORKORDERID?.JOBNUM;
    const index = items.findIndex((w) => w.WORKORDERID?.JOBNUM === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...workOrder };
    } else {
      items.unshift(workOrder);
    }
    setStored(WO_STORAGE_KEY, items);
    return workOrder;
  },
  deleteWorkOrder(id) {
    const code = extractCode(id);
    const filtered = this.getWorkOrders().filter((w) => w.WORKORDERID?.JOBNUM !== code);
    setStored(WO_STORAGE_KEY, filtered);
    return true;
  },

  // ASSETS
  getAssets() {
    return getStored(AST_STORAGE_KEY, initialAssets);
  },
  getAsset(id) {
    const code = extractCode(id);
    return this.getAssets().find((a) => a.ASSETID?.EQUIPMENTCODE === code) || null;
  },
  saveAsset(asset) {
    const items = this.getAssets();
    const code = asset.ASSETID?.EQUIPMENTCODE;
    const index = items.findIndex((a) => a.ASSETID?.EQUIPMENTCODE === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...asset };
    } else {
      items.unshift(asset);
    }
    setStored(AST_STORAGE_KEY, items);
    return asset;
  },
  deleteAsset(id) {
    const code = extractCode(id);
    const filtered = this.getAssets().filter((a) => a.ASSETID?.EQUIPMENTCODE !== code);
    setStored(AST_STORAGE_KEY, filtered);
    return true;
  },

  // POSITIONS
  getPositions() {
    return getStored(POS_STORAGE_KEY, initialPositions);
  },
  getPosition(id) {
    const code = extractCode(id);
    return this.getPositions().find((p) => p.POSITIONID?.EQUIPMENTCODE === code) || null;
  },
  savePosition(position) {
    const items = this.getPositions();
    const code = position.POSITIONID?.EQUIPMENTCODE;
    const index = items.findIndex((p) => p.POSITIONID?.EQUIPMENTCODE === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...position };
    } else {
      items.unshift(position);
    }
    setStored(POS_STORAGE_KEY, items);
    return position;
  },
  deletePosition(id) {
    const code = extractCode(id);
    const filtered = this.getPositions().filter((p) => p.POSITIONID?.EQUIPMENTCODE !== code);
    setStored(POS_STORAGE_KEY, filtered);
    return true;
  },

  // SYSTEMS
  getSystems() {
    return getStored(SYS_STORAGE_KEY, initialSystems);
  },
  getSystem(id) {
    const code = extractCode(id);
    return this.getSystems().find((s) => s.SYSTEMID?.EQUIPMENTCODE === code) || null;
  },
  saveSystem(system) {
    const items = this.getSystems();
    const code = system.SYSTEMID?.EQUIPMENTCODE;
    const index = items.findIndex((s) => s.SYSTEMID?.EQUIPMENTCODE === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...system };
    } else {
      items.unshift(system);
    }
    setStored(SYS_STORAGE_KEY, items);
    return system;
  },
  deleteSystem(id) {
    const code = extractCode(id);
    const filtered = this.getSystems().filter((s) => s.SYSTEMID?.EQUIPMENTCODE !== code);
    setStored(SYS_STORAGE_KEY, filtered);
    return true;
  },

  // PARTS
  getParts() {
    return getStored(PRT_STORAGE_KEY, initialParts);
  },
  getPart(id) {
    const code = extractCode(id);
    return this.getParts().find((p) => p.PARTID?.PARTCODE === code) || null;
  },
  savePart(part) {
    const items = this.getParts();
    const code = part.PARTID?.PARTCODE;
    const index = items.findIndex((p) => p.PARTID?.PARTCODE === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...part };
    } else {
      items.unshift(part);
    }
    setStored(PRT_STORAGE_KEY, items);
    return part;
  },
  deletePart(id) {
    const code = extractCode(id);
    const filtered = this.getParts().filter((p) => p.PARTID?.PARTCODE !== code);
    setStored(PRT_STORAGE_KEY, filtered);
    return true;
  },

  // LOTS
  getLots() {
    return getStored(LOT_STORAGE_KEY, initialLots);
  },
  getLot(id) {
    const code = extractCode(id);
    return this.getLots().find((l) => l.LOTID?.LOTCODE === code) || null;
  },
  getPartLot(partCode, lotCode) {
    const pCode = extractCode(partCode);
    const lCode = extractCode(lotCode);
    return (
      this.getLots().find(
        (l) => l.LOTID?.LOTCODE === lCode && (!pCode || l.LOTID?.PARTCODE === pCode)
      ) || null
    );
  },
  saveLot(lot) {
    const items = this.getLots();
    const code = lot.LOTID?.LOTCODE;
    const index = items.findIndex((l) => l.LOTID?.LOTCODE === code);
    if (index >= 0) {
      items[index] = { ...items[index], ...lot };
    } else {
      items.unshift(lot);
    }
    setStored(LOT_STORAGE_KEY, items);
    return lot;
  },
  deleteLot(id) {
    const code = extractCode(id);
    const filtered = this.getLots().filter((l) => l.LOTID?.LOTCODE !== code);
    setStored(LOT_STORAGE_KEY, filtered);
    return true;
  },

  // ACTIVITIES
  getWorkOrderActivities(woCode) {
    const code = extractCode(woCode);
    const store = getStored(ACT_STORAGE_KEY, initialActivities);
    const activities = store[code] || [
      {
        activityCode: "10",
        activityNote: "General Maintenance",
        workOrderNumber: code,
        peopleRequired: 1,
        estimatedHours: 2,
        hoursRemaining: 2,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        tradeCode: "MECH",
        taskCode: "TSK-01",
        taskDesc: "Maintenance Task",
        checklists: [],
      },
    ];

    // Attach current checklists to activities
    const allWoChecklists = this.getWorkOrderChecklists(code);
    return activities.map((act) => {
      const actChecklists = allWoChecklists.filter(
        (c) => String(c.activityCode) === String(act.activityCode)
      );
      return {
        ...act,
        checklists: actChecklists,
      };
    });
  },

  // CHECKLISTS
  getWorkOrderChecklists(woCode, actCode = null) {
    const code = extractCode(woCode);
    const store = getStored(CHK_STORAGE_KEY, initialChecklists);
    let items = store[code] || [];
    if (actCode) {
      items = items.filter((i) => String(i.activityCode) === String(actCode));
    }
    return items;
  },
  saveChecklistItem(item) {
    const woCode = extractCode(item.workOrderCode || item.workOrderNumber || "WO-1001");
    const store = getStored(CHK_STORAGE_KEY, initialChecklists);
    if (!store[woCode]) {
      store[woCode] = [];
    }

    const items = store[woCode];
    const index = items.findIndex(
      (c) =>
        (c.checklistCode && c.checklistCode === item.checklistCode) ||
        (c.checkListCode && c.checkListCode === item.checkListCode) ||
        (c.sequence && c.sequence === item.sequence && String(c.activityCode) === String(item.activityCode))
    );

    const updatedItem = {
      ...(index >= 0 ? items[index] : {}),
      ...item,
      checklistCode: item.checklistCode || item.checkListCode,
      checkListCode: item.checklistCode || item.checkListCode,
    };

    if (index >= 0) {
      items[index] = updatedItem;
    } else {
      items.push(updatedItem);
    }

    store[woCode] = items;
    setStored(CHK_STORAGE_KEY, store);
    return updatedItem;
  },

  // COMMENTS
  getComments(entityCode, entityKeyCode) {
    const eCode = String(entityCode || "").trim();
    const kCode = extractCode(entityKeyCode);
    const key = `${eCode}_${kCode}`;
    const store = getStored(CMT_STORAGE_KEY, initialComments);
    return store[key] || [];
  },
  saveComment(comment) {
    const eCode = String(comment.entityCode || "").trim();
    const kCode = extractCode(comment.entityKeyCode || comment.entityKey);
    const key = `${eCode}_${kCode}`;
    const store = getStored(CMT_STORAGE_KEY, initialComments);
    if (!store[key]) {
      store[key] = [];
    }

    const now = new Date();
    const userCode = comment.userCode || "TECH01";
    const newComment = {
      ...comment,
      pk: String(Date.now()),
      creationDate: now.toISOString(),
      userDate: now.toLocaleString(),
      userCode: userCode,
      userDesc: userCode,
      creationUserCode: userCode,
      creationUserDesc: userCode,
    };

    store[key].unshift(newComment);
    setStored(CMT_STORAGE_KEY, store);
    return newComment;
  },

  resetAll() {
    setStored(WO_STORAGE_KEY, initialWorkOrders);
    setStored(AST_STORAGE_KEY, initialAssets);
    setStored(POS_STORAGE_KEY, initialPositions);
    setStored(SYS_STORAGE_KEY, initialSystems);
    setStored(PRT_STORAGE_KEY, initialParts);
    setStored(LOT_STORAGE_KEY, initialLots);
    setStored(ACT_STORAGE_KEY, initialActivities);
    setStored(CHK_STORAGE_KEY, initialChecklists);
    setStored(CMT_STORAGE_KEY, initialComments);
  },
};
