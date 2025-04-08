class CustomFieldsTools {

    isLookupCustomField(customField) {
        return ['C', 'E', 'P'].includes(customField.LOVSETTINGS.LOV_TYPE);
    }

}

export default new CustomFieldsTools()
