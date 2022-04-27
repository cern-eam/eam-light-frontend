import WS from './WS'

/**
 * Handles all calls to REST Api
 */
class WSGrid {
    getGridData = (gridRequest, config = {}) => WS._post('/grids/data/', gridRequest, config);
    
    exportDataToCSV = (gridRequest, config = {}) => WS._post('/grids/export/', gridRequest, config);
}

export default new WSGrid();