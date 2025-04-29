class CustomFieldsTools {

    isLookupCustomField(customField) {
        return ['C', 'E', 'P'].includes(customField.LOVSETTINGS.LOV_TYPE);
    }

    isCategoryValue(customField) {
        return customField?.VALUESOURCE?.CATVALUE === '+'
    }

}

export default new CustomFieldsTools()
