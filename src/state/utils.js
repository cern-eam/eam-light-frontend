export const isLocalAdministrator = (userData) =>  
    userData &&
    userData.eamAccount &&
    userData.eamAccount.userDefinedFields &&
    userData.eamAccount.userDefinedFields.udfchkbox01;
