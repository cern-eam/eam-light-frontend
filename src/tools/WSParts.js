import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSParts {

    //
    // PARTS
    //

    initPart(entity, params, config = {}) {
        return WS._get(`/parts/init/${entity}${params}`, config);
    }

    getPart(code, config = {}) {
        code = encodeURIComponent(code);
        return WS._get('/parts/' + code, config);
    }

    createPart(part, config = {}) {
        return WS._post('/parts/', part, config);
    }

    updatePart(part, config = {}) {
        return WS._put('/parts/', part, config);
    }

    deletePart(code, config = {}) {
        return WS._delete('/parts/' + code, config);
    }

    //
    // AUTOCOMPLETE PARTS
    //
    autocompletePartCategory = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/category/' + filter, config);
    };

    autocompletePartCommodity = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/commodity/' + filter, config);
    };

    autocompletePartUOM = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/uom/' + filter, config);
    };

    //
    // DROPDOWNS PARTS
    //

    getPartTrackingMethods(config = {}) {
        return WS._get('/partlists/trackMethods', config);
    }

    //
    //WHERE USED PARTS
    //

    getPartWhereUsed(partCode, config = {}) {
        partCode = encodeURIComponent(partCode);
        return WS._get('/partlists/partsassociated/' + partCode, config);
    }

    //
    // PART STOCK
    //

    getPartStock(partCode, config = {}) {
        partCode = encodeURIComponent(partCode);
        return WS._get('/parts/partstock/' + partCode);
    }

    //
    // PRINT BARCODE
    //

    printBarcode(barcodeInput, config = {}) {
        return WS._put('/barcode/printBarcode/', barcodeInput, config);
    }

}

export default new WSParts();