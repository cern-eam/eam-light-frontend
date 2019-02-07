class CustomFieldsTools {

    isLookupCustomField(customField) {
        return (customField.lovType === 'C' || customField.lovType === 'E' || customField.lovType === 'P')
    }

}

export default new CustomFieldsTools()
