import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSCustomFields {

    //
    //CUSTOM FIELDS SUPPORT
    //

    getCustomFieldsLookupValues(entity, inforClass, config = {}) {
        return WS._get('/customfields/lookupvalues?entity=' + entity + '&inforClass=' + inforClass, config);
    }

    autocompleteCustomFieldRENT = (rentity, cfcode, filter, config = {}) => {
        return WS._get('/customfields/autocomplete/' + rentity + '/' + cfcode + '/' + filter, config);
    };

    getCustomFields(entity, classCode, config = {}) {
        return WS._get(`/customfields/data?entity=${entity}&inforClass=${classCode}`, config);
    }
}

export default new WSCustomFields();