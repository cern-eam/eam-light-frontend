import { GridTypes } from "../../../../tools/entities/GridRequest";
import { autocompleteDepartment, readStatuses, readUserCodes } from "../../../../tools/WSGrids";
import { isMultiOrg } from "../../EntityTools";

export const equipmentLayoutPropertiesMap = {

  equipmentno: {
    noOrgDescProps: true,
    alias: 'code',
    extraProps: (ctx) => ({
        hidden: !ctx.newEntity
    })
  },

  organization: {
    extraProps: {
        hidden: !isMultiOrg
    }
  },

  equipmentdesc: {
    alias: "description"
  },

  department: {
    alias: "departmentcode",
    autocompleteHandlerData: {
      handler: autocompleteDepartment
    }
  },

  assetstatus: {
    alias: "statuscode"
  },

  manufacturer: {
    noOrgDescProps: true,
    alias: "manufacturercode"
  },

  serialnumber: {
    noOrgDescProps: true
  },

  model: {
    noOrgDescProps: true
  },

  commissiondate: {
    alias: "comissiondate" // backwards compatible because of the typo we had on our end 
  }, 

  category: {
    autocompleteHandlerData: {
        resultMap: {
            code: "category",
            desc: "categorydesc",
            class: "categoryclass",
            manufacturer: "manufacturer"
        }
    },
    alias: 'categorycode'
  },

  class: {
    alias: "classcode"
  },

  location: {
    autocompleteHandlerData: {
        resultMap: {
            code: "equipmentcode",
            desc: "description_obj",
            org: "equiporganization"
        },
        gridType: GridTypes.LIST
    }
  },

  criticality: {
    extraProps: {
            autocompleteHandler: readUserCodes,
            autocompleteHandlerParams: ["OBCR"]
        }
  },

  alias: {
    extraProps: {
        barcodeScanner: true
    }
  },

    assignedto: {
        autocompleteHandlerData: {
            searchKeys: ['personcode', 'description'],
        }
    },

    assetstatus: {
    extraProps: (ctx) => (
        {
            autocompleteHandler: readStatuses,
            autocompleteHandlerParams: ["OBJ", ctx.newEntity, ctx.equipment.STATUS.STATUSCODE],
            renderDependencies: [ctx.newEntity, ctx.equipment.STATUS.STATUSCODE]
        }
    )
  },
};

//
//
//

export const assetLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,

  costcode: {
    autocompleteHandlerData: {
        resultMap: {
            code: "costcode",
            desc: "costcodedescription",
            organization: "costcodeorg"
        }
    }
    },

  part: {
    link: "/part/",
    clear: 'PartAssociation.STORELOCATION'
  },

  state: {
    extraProps: {
            autocompleteHandler: readUserCodes,
            autocompleteHandlerParams: ["OBSA"]
        }
  },

  store: {
    extraProps: {
        disabled: true
    }
  },

    bin: {
    extraProps: {
        disabled: true
    }
  },

  lot: {
    extraProps: {
        disabled: true
    }
  }

};

export const positionLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
};

export const systemLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
};

export const locationLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap
};

export const ASSET_BLOCKS = {
  GENERAL: "block_1",
  EQUIPMENTDETAILS: "block_2",
  TRACKINGDETAILS: "block_3",
  PARTASSOCIATION: "block_4",
  HIERARCHY: "block_5",
  CUSTOMFIELDS: "block_6",
  VARIABLES: "block_7",
  GISDETAILS: "block_8",
  LINEARREFERENCEDETAILS: "block_9",
  CONTRACTANDRENTALDETAILS: "block_10",
  CALLCENTERDETAILS: "block_11",
  USERDEFINEDFIELDSSECTION: "block_12",
  FACILITYDETAILS: "block_13",
  BLOCK_14: "block_14",
  RELIABILITYRANKDETAILSSECTION: "block_15",
  ENERGYPERFORMANCESECTION: "block_16",
  RCMDETAILSSECTION: "block_17",
  COMPLIANCEASSOCIATIONSECTION: "block_19",
  FINANCIALANDDISPOSITIONDETAILSSECTION: "block_20",
  PERFORMANCEDETAILSSECTION: "block_21"
};

export const POSITION_BLOCKS = {
  GENERAL: "block_1",
  EQUIPMENTDETAILS: "block_2",
  HIERARCHY: "block_3",
  CUSTOMFIELDS: "block_4",
  GISDETAILS: "block_5",
  LINEARREFERENCEDETAILS: "block_6",
  TRACKINGDETAILS: "block_7",
  VARIABLES: "block_8",
  CALLCENTERDETAILS: "block_9",
  USERDEFINEDFIELDSSECTION: "block_10",
  FACILITYDETAILS: "block_11",
  BLOCK_12: "block_12",
  RELIABILITYRANKDETAILSSECTION: "block_13",
  CONTRACTANDRENTALDETAILSSECTION: "block_14",
  ENERGYPERFORMANCESECTION: "block_15",
  RCMDETAILSSECTION: "block_16",
  COMPLIANCEASSOCIATIONSECTION: "block_18",
  FINANCIALANDDISPOSITIONDETAILSSECTION: "block_19",
  PERFORMANCEDETAILSSECTION: "block_20"
};

export const SYSTEM_BLOCKS = {
  GENERAL: "block_1",
  EQUIPMENTDETAILS: "block_2",
  HIERARCHY: "block_3",
  CUSTOMFIELDS: "block_4",
  GISDETAILS: "block_5",
  LINEARREFERENCEDETAILS: "block_6",
  CALLCENTERDETAILS: "block_7",
  TRACKINGDETAILS: "block_8",
  VARIABLES: "block_9",
  USERDEFINEDFIELDSSECTION: "block_10",
  FACILITYDETAILS: "block_11",
  BLOCK_12: "block_12",
  RELIABILITYRANKDETAILSSECTION: "block_13",
  CONTRACTANDRENTALDETAILSSECTION: "block_14",
  RCMDETAILSSECTION: "block_15",
  COMPLIANCEASSOCIATIONSECTION: "block_17",
  FINANCIALANDDISPOSITIONDETAILSSECTION: "block_18",
  PERFORMANCEDETAILSSECTION: "block_19"
};


