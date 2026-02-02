import React from "react";
import { GridTypes } from "../../../../tools/entities/GridRequest";
import { autocompleteDepartment, readStatuses, readUserCodes } from "../../../../tools/WSGrids";
import { isMultiOrg } from "../../EntityTools";
import AddManufacturerButton from "../../part/manufacturer/AddManufacturerButton";

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

  manufacturer: {
    noOrgDescProps: true,
    alias: "manufacturercode",
    extraProps: {
      //endAdornment: React.createElement(AddManufacturerButton)
    }
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
      alias: "statuscode",
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
  GENERAL: {
    code: "block_1",
    containers: ['cont_1', 'cont_1.1', 'cont_1.2', 'cont_2']
  },
  EQUIPMENTDETAILS: {
    code: "block_2",
    containers: ['cont_3', 'cont_4']
  },
  TRACKINGDETAILS: {
    code: "block_3",
    containers: ['cont_5', 'cont_6']
  },
  PARTASSOCIATION: {
    code: "block_4",
    containers: ['cont_7', 'cont_8']
  },
  HIERARCHY: {
    code: "block_5",
    containers: []
  },
  CUSTOMFIELDS: {
    code: "block_6",
    containers: []
  },
  VARIABLES: {
    code: "block_7",
    containers: ['cont_9', 'cont_10']
  },
  GISDETAILS: {
    code: "block_8",
    containers: []
  },
  LINEARREFERENCEDETAILS: {
    code: "block_9",
    containers: []
  },
  CONTRACTANDRENTALDETAILS: {
    code: "block_10",
    containers: []
  },
  CALLCENTERDETAILS: {
    code: "block_11",
    containers: []
  },
  USERDEFINEDFIELDSSECTION: {
    code: "block_12",
    containers: ['cont_15', 'cont_16']
  },
  FACILITYDETAILS: {
    code: "block_13",
    containers: []
  },
  BLOCK_14: {
    code: "block_14",
    containers: []
  },
  RELIABILITYRANKDETAILSSECTION: {
    code: "block_15",
    containers: []
  },
  ENERGYPERFORMANCESECTION: {
    code: "block_16",
    containers: []
  },
  RCMDETAILSSECTION: {
    code: "block_17",
    containers: []
  },
  COMPLIANCEASSOCIATIONSECTION: {
    code: "block_19",
    containers: []
  },
  FINANCIALANDDISPOSITIONDETAILSSECTION: {
    code: "block_20",
    containers: []
  },
  PERFORMANCEDETAILSSECTION: {
    code: "block_21",
    containers: []
  }
};

export const POSITION_BLOCKS = {
  GENERAL: {
    code: "block_1",
    containers: ['cont_1', 'cont_1.1', 'cont_1.2', 'cont_2']
  },
  EQUIPMENTDETAILS: {
    code: "block_2",
    containers: ['cont_3', 'cont_4']
  },
  HIERARCHY: {
    code: "block_3",
    containers: []
  },
  CUSTOMFIELDS: {
    code: "block_4",
    containers: []
  },
  GISDETAILS: {
    code: "block_5",
    containers: []
  },
  LINEARREFERENCEDETAILS: {
    code: "block_6",
    containers: []
  },
  TRACKINGDETAILS: {
    code: "block_7",
    containers: ['cont_4.1', 'cont_4.2']
  },
  VARIABLES: {
    code: "block_8",
    containers: ['cont_4.3', 'cont_4.4']
  },
  CALLCENTERDETAILS: {
    code: "block_9",
    containers: []
  },
  USERDEFINEDFIELDSSECTION: {
    code: "block_10",
    containers: ['cont_6.4', 'cont_6.5', 'cont_6.6']
  },
  FACILITYDETAILS: {
    code: "block_11",
    containers: []
  },
  BLOCK_12: {
    code: "block_12",
    containers: []
  },
  RELIABILITYRANKDETAILSSECTION: {
    code: "block_13",
    containers: []
  },
  CONTRACTANDRENTALDETAILSSECTION: {
    code: "block_14",
    containers: []
  },
  ENERGYPERFORMANCESECTION: {
    code: "block_15",
    containers: []
  },
  RCMDETAILSSECTION: {
    code: "block_16",
    containers: []
  },
  COMPLIANCEASSOCIATIONSECTION: {
    code: "block_18",
    containers: []
  },
  FINANCIALANDDISPOSITIONDETAILSSECTION: {
    code: "block_19",
    containers: []
  },
  PERFORMANCEDETAILSSECTION: {
    code: "block_20",
    containers: []
  }
};

export const SYSTEM_BLOCKS = {
  GENERAL: {
    code: "block_1",
    containers: ['cont_1', 'cont_1.1', 'cont_1.2', 'cont_2']
  },
  EQUIPMENTDETAILS: {
    code: "block_2",
    containers: ['cont_3', 'cont_4']
  },
  HIERARCHY: {
    code: "block_3",
    containers: []
  },
  CUSTOMFIELDS: {
    code: "block_4",
    containers: []
  },
  GISDETAILS: {
    code: "block_5",
    containers: []
  },
  LINEARREFERENCEDETAILS: {
    code: "block_6",
    containers: []
  },
  CALLCENTERDETAILS: {
    code: "block_7",
    containers: []
  },
  TRACKINGDETAILS: {
    code: "block_8",
    containers: ['cont_4.1', 'cont_4.2']
  },
  VARIABLES: {
    code: "block_9",
    containers: ['cont_4.3', 'cont_4.4']
  },
  USERDEFINEDFIELDSSECTION: {
    code: "block_10",
    containers: ['cont_5.4', 'cont_5.5', 'cont_5.6']
  },
  FACILITYDETAILS: {
    code: "block_11",
    containers: []
  },
  BLOCK_12: {
    code: "block_12",
    containers: []
  },
  RELIABILITYRANKDETAILSSECTION: {
    code: "block_13",
    containers: []
  },
  CONTRACTANDRENTALDETAILSSECTION: {
    code: "block_14",
    containers: []
  },
  RCMDETAILSSECTION: {
    code: "block_15",
    containers: []
  },
  COMPLIANCEASSOCIATIONSECTION: {
    code: "block_17",
    containers: []
  },
  FINANCIALANDDISPOSITIONDETAILSSECTION: {
    code: "block_18",
    containers: []
  },
  PERFORMANCEDETAILSSECTION: {
    code: "block_19",
    containers: []
  }
};


