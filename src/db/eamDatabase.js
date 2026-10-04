import Dexie from "dexie";

export class EamDatabase extends Dexie {
  constructor() {
    super("EamLightDatabase");
    this.version(1).stores({
      workorders: "code, equipmentCode, statusCode, department, type",
      activities: "[workorder+activityCode], workorder",
      checklists: "++id, [workorder+activityCode], workorder",
      equipment: "code, type, parentCode, parentAssetCode, parentPositionCode, parentSystemCode, locationCode, departmentCode, statusCode",
      parts: "code, trackingType, uom",
      partLots: "[partCode+lotCode], partCode",
      partAssociations: "[equipmentCode+partCode], equipmentCode, partCode",
      comments: "++id, [entityCode+entityType], entityCode, entityType, creationDate",
      sequences: "entityType",
    });

    this.version(2).stores({
      workorders: "code, equipmentCode, statusCode, department, type",
      activities: "[workorder+activityCode], workorder",
      checklists: "++id, [workorder+activityCode], workorder",
      equipment: "code, type, parentCode, parentAssetCode, parentPositionCode, parentSystemCode, locationCode, departmentCode, statusCode",
      parts: "code, trackingType, uom",
      partLots: "[partCode+lotCode], partCode",
      partAssociations: "[equipmentCode+partCode], equipmentCode, partCode",
      nonconformities: "code, equipmentCode, workOrderCode, locationCode, statusCode, severity",
      ncrObservations: "++id, ncrCode, observerCode, observationDate",
      comments: "++id, [entityCode+entityType], entityCode, entityType, creationDate",
      sequences: "entityType",
    });
  }
}

export const db = new EamDatabase();

export const extractCode = (raw) => {
  if (!raw) return "";
  const decoded = decodeURIComponent(String(raw));
  return decoded.split("#")[0].trim();
};

/**
 * Auto-Increment Sequence Engine
 */
export async function getNextSequence(entityType) {
  return await db.transaction("rw", db.sequences, async () => {
    let seq = await db.sequences.get(entityType);
    let nextVal = 1001;
    if (seq) {
      nextVal = seq.currentValue + 1;
      await db.sequences.put({ entityType, currentValue: nextVal });
    } else {
      await db.sequences.put({ entityType, currentValue: nextVal });
    }

    switch (entityType) {
      case "workorders":
      case "EVNT":
        return `WO-${nextVal}`;
      case "assets":
      case "A":
        return `AST-${nextVal}`;
      case "positions":
      case "P":
        return `POS-${nextVal}`;
      case "systems":
      case "S":
        return `SYS-${nextVal}`;
      case "parts":
      case "PART":
        return `PRT-${nextVal}`;
      case "lots":
      case "LOT":
        return `LOT-${nextVal}`;
      case "nonconformities":
      case "ncrs":
      case "NCR":
      case "NOCF":
      case "NCNC":
        return `NCR-${nextVal}`;
      default:
        return `${entityType.toUpperCase()}-${nextVal}`;
    }
  });
}

/**
 * Seed initial data (First launch only)
 */
export async function seedInitialData(force = false) {
  const count = await db.equipment.count();
  const ncrCount = await db.nonconformities.count();
  if (count > 0 && ncrCount > 0 && !force) {
    return;
  }

  if (force) {
    await db.transaction(
      "rw",
      [
        db.workorders,
        db.activities,
        db.checklists,
        db.equipment,
        db.parts,
        db.partLots,
        db.partAssociations,
        db.nonconformities,
        db.ncrObservations,
        db.comments,
        db.sequences,
      ],
      async () => {
        await db.workorders.clear();
        await db.activities.clear();
        await db.checklists.clear();
        await db.equipment.clear();
        await db.parts.clear();
        await db.partLots.clear();
        await db.partAssociations.clear();
        await db.nonconformities.clear();
        await db.ncrObservations.clear();
        await db.comments.clear();
        await db.sequences.clear();
      }
    );
  }

  const now = new Date();

  // 1. Sequences
  await db.sequences.bulkPut([
    { entityType: "workorders", currentValue: 1002 },
    { entityType: "assets", currentValue: 1002 },
    { entityType: "systems", currentValue: 1001 },
    { entityType: "positions", currentValue: 1001 },
    { entityType: "parts", currentValue: 1001 },
  ]);

  // 2. Equipment
  // 1 System: SYS-01 ("HVAC Primary Loop")
  // Equipment seed:
  // SYS-01: Root system
  // POS-01: Position parented to SYS-01
  // AST-01: Asset parented to POS-01 (position) and SYS-01 (system)
  // AST-02: Child asset parented to AST-01 (parentAssetCode), POS-01 (position), SYS-01 (system)
  await db.equipment.bulkPut([
    {
      code: "SYS-01",
      description: "HVAC Primary Loop",
      type: "S",
      parentCode: null,
      parentAssetCode: null,
      parentPositionCode: null,
      parentSystemCode: null,
      locationCode: "LOC-01",
      costRollUp: true,
      departmentCode: "*",
      statusCode: "I",
      statusDesc: "In Service",
      categoryCode: "HVAC",
      classCode: "CRITICAL",
      criticalityCode: "A",
      commissionDate: now.toISOString(),
      raw: {
        SYSTEMID: {
          EQUIPMENTCODE: "SYS-01",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
          DESCRIPTION: "HVAC Primary Loop",
        },
        STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        CATEGORYID: { CATEGORYCODE: "HVAC" },
        CLASSID: { CLASSCODE: "CRITICAL" },
        CRITICALITYID: { CRITICALITYCODE: "A" },
        COMMISSIONDATE: now.toISOString(),
        systemTypeCode: "S",
        SystemParentHierarchy: {},
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
    {
      code: "POS-01",
      description: "Cooling Circuit Pos 01",
      type: "P",
      parentCode: "SYS-01",
      parentAssetCode: null,
      parentPositionCode: null,
      parentSystemCode: "SYS-01",
      locationCode: "LOC-01",
      costRollUp: true,
      departmentCode: "*",
      statusCode: "I",
      statusDesc: "In Service",
      categoryCode: "POS",
      classCode: "STANDARD",
      criticalityCode: "M",
      commissionDate: now.toISOString(),
      raw: {
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
        COMMISSIONDATE: now.toISOString(),
        systemTypeCode: "P",
        PositionParentHierarchy: {
          primarysystem: "SYS-01",
        },
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
    {
      code: "AST-01",
      description: "Chiller Pump A",
      type: "A",
      parentCode: "POS-01",
      parentAssetCode: null,
      parentPositionCode: "POS-01",
      parentSystemCode: "SYS-01",
      locationCode: "LOC-01",
      costRollUp: true,
      departmentCode: "*",
      statusCode: "I",
      statusDesc: "In Service",
      categoryCode: "PUMP",
      classCode: "CRITICAL",
      criticalityCode: "A",
      commissionDate: now.toISOString(),
      raw: {
        ASSETID: {
          EQUIPMENTCODE: "AST-01",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
          DESCRIPTION: "Chiller Pump A",
        },
        STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        CATEGORYID: { CATEGORYCODE: "PUMP" },
        CLASSID: { CLASSCODE: "CRITICAL" },
        CRITICALITYID: { CRITICALITYCODE: "A" },
        COMMISSIONDATE: now.toISOString(),
        systemTypeCode: "A",
        AssetParentHierarchy: {
          position: "POS-01",
          primarysystem: "SYS-01",
        },
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
    {
      code: "AST-02",
      description: "Air Handler Unit 1",
      type: "A",
      parentCode: "AST-01",
      parentAssetCode: "AST-01",
      parentPositionCode: "POS-01",
      parentSystemCode: "SYS-01",
      locationCode: "LOC-01",
      costRollUp: true,
      departmentCode: "*",
      statusCode: "I",
      statusDesc: "In Service",
      categoryCode: "COMP",
      classCode: "STANDARD",
      criticalityCode: "B",
      commissionDate: now.toISOString(),
      raw: {
        ASSETID: {
          EQUIPMENTCODE: "AST-02",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
          DESCRIPTION: "Air Handler Unit 1",
        },
        STATUS: { STATUSCODE: "I", DESCRIPTION: "In Service" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        CATEGORYID: { CATEGORYCODE: "COMP" },
        CLASSID: { CLASSCODE: "STANDARD" },
        CRITICALITYID: { CRITICALITYCODE: "B" },
        COMMISSIONDATE: now.toISOString(),
        systemTypeCode: "A",
        AssetParentHierarchy: {
          parentasset: "AST-01",
          position: "POS-01",
          primarysystem: "SYS-01",
        },
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
  ]);

  // 3. Work Orders
  // 2 Work Orders (WO-1001, WO-1002) assigned to AST-01 and AST-02
  await db.workorders.bulkPut([
    {
      code: "WO-1001",
      description: "Inspect Cooling Pump 01",
      equipmentCode: "AST-01",
      statusCode: "R",
      statusDesc: "Released",
      department: "*",
      type: "CORR",
      typeDesc: "Corrective",
      priority: "M",
      priorityDesc: "Medium",
      schedStartDate: now.toISOString(),
      schedEndDate: new Date(Date.now() + 86400000).toISOString(),
      raw: {
        WORKORDERID: {
          JOBNUM: "WO-1001",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
          DESCRIPTION: "Inspect Cooling Pump 01",
        },
        STATUS: { STATUSCODE: "R", DESCRIPTION: "Released" },
        TYPE: { TYPECODE: "CORR", DESCRIPTION: "Corrective" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        EQUIPMENTID: {
          EQUIPMENTCODE: "AST-01",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        LOCATIONID: { LOCATIONCODE: "LOC-BLD1" },
        PRIORITY: { PRIORITYCODE: "M", DESCRIPTION: "Medium" },
        ASSIGNEDTO: { PERSONCODE: "TECH01" },
        SCHEDSTARTDATE: now.toISOString(),
        SCHEDENDDATE: new Date(Date.now() + 86400000).toISOString(),
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
    {
      code: "WO-1002",
      description: "Calibrate Pressure Sensors",
      equipmentCode: "AST-02",
      statusCode: "R",
      statusDesc: "Released",
      department: "*",
      type: "PREV",
      typeDesc: "Preventive",
      priority: "H",
      priorityDesc: "High",
      schedStartDate: now.toISOString(),
      schedEndDate: new Date(Date.now() + 172800000).toISOString(),
      raw: {
        WORKORDERID: {
          JOBNUM: "WO-1002",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
          DESCRIPTION: "Calibrate Pressure Sensors",
        },
        STATUS: { STATUSCODE: "R", DESCRIPTION: "Released" },
        TYPE: { TYPECODE: "PREV", DESCRIPTION: "Preventive" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        EQUIPMENTID: {
          EQUIPMENTCODE: "AST-02",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        LOCATIONID: { LOCATIONCODE: "LOC-BLD2" },
        PRIORITY: { PRIORITYCODE: "H", DESCRIPTION: "High" },
        ASSIGNEDTO: { PERSONCODE: "TECH01" },
        SCHEDSTARTDATE: now.toISOString(),
        SCHEDENDDATE: new Date(Date.now() + 172800000).toISOString(),
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
  ]);

  // 4. Activities
  await db.activities.bulkPut([
    {
      workorder: "WO-1001",
      activityCode: "10",
      activityNote: "Safety Inspection",
      peopleRequired: 1,
      estimatedHours: 2,
      hoursRemaining: 2,
      startDate: now.toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "MECH",
      taskCode: "TSK-01",
      taskDesc: "Safety Check & Calibration",
    },
    {
      workorder: "WO-1001",
      activityCode: "20",
      activityNote: "Component Replacement",
      peopleRequired: 2,
      estimatedHours: 4,
      hoursRemaining: 4,
      startDate: now.toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "MECH",
      taskCode: "TSK-02",
      taskDesc: "Mechanical Component Swap",
    },
    {
      workorder: "WO-1002",
      activityCode: "10",
      activityNote: "Calibration",
      peopleRequired: 1,
      estimatedHours: 1.5,
      hoursRemaining: 1.5,
      startDate: now.toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      tradeCode: "ELECT",
      taskCode: "TSK-03",
      taskDesc: "Sensor Calibration",
    },
  ]);

  // 5. Checklists
  await db.checklists.bulkPut([
    {
      workorder: "WO-1001",
      activityCode: "10",
      checklistCode: "CHK-01",
      checkListCode: "CHK-01",
      sequence: 1,
      desc: "Safety lockout applied?",
      type: "01",
      result: null,
      completed: false,
      notes: "",
      required: true,
      equipmentCode: "AST-01",
      equipmentDesc: "Chiller Pump A",
      possibleFindings: [],
      finding: null,
      numericValue: null,
      freeText: null,
    },
    {
      workorder: "WO-1001",
      activityCode: "10",
      checklistCode: "CHK-02",
      checkListCode: "CHK-02",
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
      equipmentCode: "AST-01",
      equipmentDesc: "Chiller Pump A",
      possibleFindings: [],
      finding: null,
      freeText: null,
    },
    {
      workorder: "WO-1001",
      activityCode: "10",
      checklistCode: "CHK-03",
      checkListCode: "CHK-03",
      sequence: 3,
      desc: "Visual inspection notes",
      type: "03",
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
      equipmentCode: "AST-01",
      equipmentDesc: "Chiller Pump A",
    },
  ]);

  // 6. Parts & Lots
  await db.parts.bulkPut([
    {
      code: "PRT-100",
      description: "Pump Mechanical Seal Ring",
      trackingType: "LOT",
      uom: "EA",
      raw: {
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
    },
  ]);

  await db.partLots.bulkPut([
    {
      partCode: "PRT-100",
      lotCode: "LOT-A",
      description: "Batch A - High Precision Seals",
      qty: 50,
      statusCode: "A",
      raw: {
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
    },
  ]);

  // 6b. Part Associations (Equipment <-> Part)
  await db.partAssociations.bulkPut([
    {
      equipmentCode: "AST-01",
      partCode: "PRT-100",
      description: "Pump Mechanical Seal Ring",
      quantity: 2,
      uom: "EA",
      associationEntity: "A",
    },
    {
      equipmentCode: "AST-02",
      partCode: "PRT-100",
      description: "Pump Mechanical Seal Ring",
      quantity: 1,
      uom: "EA",
      associationEntity: "A",
    },
  ]);

  // 7. Comments (Polymorphic: EVNT, OBJ, PART)
  await db.comments.bulkPut([
    {
      entityCode: "WO-1001",
      entityType: "EVNT",
      text: "Initial inspection scheduled for cooling circuit pump.",
      creationDate: new Date(Date.now() - 3600000).toISOString(),
      userDate: new Date(Date.now() - 3600000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
    {
      entityCode: "AST-01",
      entityType: "OBJ",
      text: "Asset installed and passed vibration tests.",
      creationDate: new Date(Date.now() - 86400000).toISOString(),
      userDate: new Date(Date.now() - 86400000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
    {
      entityCode: "PRT-100",
      entityType: "PART",
      text: "OEM mechanical seals certified for high pressure operation up to 10 Bar.",
      creationDate: new Date(Date.now() - 172800000).toISOString(),
      userDate: new Date(Date.now() - 172800000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
    {
      entityCode: "NCR-1001",
      entityType: "NOCF",
      text: "Vibration measurements confirmed exceedance of ISO 10816-3 Category II limits. Work order dispatched.",
      creationDate: new Date(Date.now() - 7200000).toISOString(),
      userDate: new Date(Date.now() - 7200000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
    {
      entityCode: "NCR-1001",
      entityType: "NCNC",
      text: "Vibration measurements confirmed exceedance of ISO 10816-3 Category II limits. Work order dispatched.",
      creationDate: new Date(Date.now() - 7200000).toISOString(),
      userDate: new Date(Date.now() - 7200000).toLocaleString(),
      userCode: "TECH01",
      userDesc: "TECH01",
      creationUserCode: "TECH01",
      creationUserDesc: "TECH01",
    },
  ]);

  // 8. Nonconformities (NCRs)
  await db.nonconformities.bulkPut([
    {
      code: "NCR-1001",
      description: "Excessive vibration and oil leak on Primary Pump",
      equipmentCode: "AST-01",
      equipmentDesc: "Chiller Pump A",
      workOrderCode: "WO-1001",
      locationCode: "LOC-01",
      departmentCode: "*",
      statusCode: "O",
      statusDesc: "Open",
      severity: "MAJ",
      severityDesc: "Major",
      importance: "H",
      importanceDesc: "High",
      type: "MECH",
      note: "Observed elevated vibration levels exceeding safety threshold during peak load.",
      creationDate: new Date(Date.now() - 172800000).toISOString(),
      raw: {
        NONCONFORMITYID: {
          STANDARDENTITYCODE: "NCR-1001",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        DESCRIPTION: "Excessive vibration and oil leak on Primary Pump",
        EQUIPMENTID: {
          EQUIPMENTCODE: "AST-01",
          ORGANIZATIONID: { ORGANIZATIONCODE: "*" },
        },
        STATUS: { STATUSCODE: "O", DESCRIPTION: "Open" },
        SEVERITY: { USERCODE: "MAJ", DESCRIPTION: "Major" },
        IMPORTANCE: { USERCODE: "H", DESCRIPTION: "High" },
        LOCATIONID: { LOCATIONCODE: "LOC-01" },
        DEPARTMENTID: { DEPARTMENTCODE: "*" },
        TYPE: { USERCODE: "MECH", DESCRIPTION: "Mechanical" },
        NOTE: "Observed elevated vibration levels exceeding safety threshold during peak load.",
        USERDEFINEDAREA: { CUSTOMFIELD: [] },
      },
    },
  ]);

  // 9. NCR Observations
  await db.ncrObservations.bulkPut([
    {
      id: 1,
      ncrCode: "NCR-1001",
      observerCode: "TECH01",
      observationDate: new Date(Date.now() - 86400000).toISOString(),
      note: "Bearing temperature 85°C",
      importance: "H",
      importanceDesc: "High",
      severity: "HIGH",
      severityDesc: "High",
      status: "U",
      statusDesc: "Unfinished",
      workOrderNum: "WO-1001",
    },
    {
      id: 2,
      ncrCode: "NCR-1001",
      observerCode: "TECH01",
      observationDate: new Date(Date.now() - 43200000).toISOString(),
      note: "Vibration analysis scheduled",
      importance: "M",
      importanceDesc: "Medium",
      severity: "MED",
      severityDesc: "Medium",
      status: "U",
      statusDesc: "Unfinished",
      workOrderNum: "WO-1001",
    },
  ]);
}
