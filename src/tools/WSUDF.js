import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSUDF {

    //
    //USER DEFINED FIELDS Support
    //

    autocompleteUserDefinedField = (entity, filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/userdefinedfields/complete/${entity}/${filter}`, config);
    };

    getUDFCodeValues(entity, fieldId, config = {}) {
        return WS._get(`/userdefinedfields/code/${entity}/${fieldId}`, config);
    }

    getUDFCodeDescValues(entity, fieldId, config = {}) {
        return WS._get(`/userdefinedfields/codedesc/${entity}/${fieldId}`, config);
    }

}

export default new WSUDF();