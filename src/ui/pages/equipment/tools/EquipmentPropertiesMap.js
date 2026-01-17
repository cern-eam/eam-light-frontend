import { GridTypes } from "../../../../tools/entities/GridRequest";
import { autocompleteDepartment, readStatuses, readUserCodes } from "../../../../tools/WSGrids";

export const equipmentLayoutPropertiesMap = {

  equipmentno: {
    noOrgDescProps: true,
    alias: 'code',
    extraProps: (ctx) => ({
        hidden: !ctx.newEntity
    })
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

  assetstatus: {
    extraProps: (ctx) => (
        {
            autocompleteHandler: readStatuses,
            autocompleteHandlerParams: ["OBJ", ctx.newEntity, ctx.equipment.STATUS.STATUSCODE],
            renderDependencies: [ctx.newEntity, ctx.equipment.STATUS.STATUSCODE]
        }
    )
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
