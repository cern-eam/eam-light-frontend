import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSParts {

    //
    // PARTS
    //

    initPart(config = {}) {
        return WS._get(`/parts/init`, config);
    }

    getPart(code, config = {}) {
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
    // ASSETS LIST
    //

    getAssetsList(partCode, config = {}) {
        partCode = encodeURIComponent(partCode);
        return WS._get('/partlists/assets/' + partCode, config)
    }

}

export default new WSParts();