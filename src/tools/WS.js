import ajax from "eam-components/dist/tools/ajax";

/**
 * Handles all calls to REST Api
 */
class WS {
  //
  // GENERAL
  //
  getUserData(currentScreen, screenCode, config = {}) {
    return this._get(
      `/users?currentScreen=${currentScreen ? currentScreen : ""}&screenCode=${
        screenCode ? screenCode : ""
      }`,
      config
    );
  }

  getUserDataToImpersonate(userId, mode, config = {}) {
    return this._get(
      `/users/impersonate?userId=${userId}&mode=${mode}`,
      config
    );
  }
  getApplicationData(config = {}) {
    return this._get("/application/applicationdata", config);
  }

  refreshCache(config = {}) {
    return this._get("/application/refreshCache", config);
  }

  getLov = (genericLov, config = {}) => {
    return this._post("/application/lov", genericLov, config);
  }

  getCodeLov = (code, config = {}) => {
    return this._get(`/application/codelov/${code}`, config);
  }

  getScreenLayout(
    userGroup,
    entity,
    systemFunction,
    userFunction,
    tabs,
    config = { timeout: 60000 }
  ) {
    if (tabs) tabs = "tabname=" + tabs.join("&tabname=");
    return this._get(
      `/users/screenlayout/${userGroup}/${entity}/${systemFunction}/${userFunction}?${tabs}`,
      config
    );
  }

  getGISLink(workorderNumber, locationCode, config = {}) {
    return this._get(
      "/workordersmisc/gislink?workorder=" +
        workorderNumber +
        "&location=" +
        locationCode,
      config
    );
  }

  login(username, password, organization, tenant, config = {}) {
    return this._get("/login", {
      headers: {
        INFOR_USER: username,
        INFOR_PASSWORD: password,
        INFOR_ORGANIZATION: organization,
        INFOR_TENANT: tenant,
      },
    });
  }

  getOrganizations = (userFunctionName, config = {}) => {
    return this._get(`/users/organizations/${userFunctionName}`, config);
  };

  //
  //
  //
  getMyOpenWorkOrders(config = {}) {
    return this._get("/myworkorders/my", config);
  }

  getMyTeamWorkOrders(config = {}) {
    return this._get("/myworkorders/myteam", config);
  }

  getSearchData(keyword, entityTypes, config = {}) {
    keyword = encodeURIComponent(keyword);
    return ajax.get(
      import.meta.env.VITE_BACKEND +
        `/index?s=${keyword}&entityTypes=${entityTypes}`,
      config
    );
  }

  getSearchSingleResult(keyword, config = {}) {
    return ajax.get(
      import.meta.env.VITE_BACKEND + "/index/singleresult?s=" + keyword,
      config
    );
  }


  autocompleteUsers = ({filter}, config = {}) => {
    return this._get(`/autocomplete/users/${filter}`, config);
  };



  autocompleteEquipment = ({filter, handlerParams: [hideLocations]}, config = { timeout: 0 }
  ) => {
    filter = encodeURIComponent(filter);
    return this._get(
      `/autocomplete/eqp?s=${filter.toUpperCase()}&filterL=${hideLocations}`,
      config
    );
  };


  //
  //
  //
  _get(url, config = {}) {
    return ajax.get(import.meta.env.VITE_BACKEND + url, config);
  }

  _post(url, data, config = {}) {
    return ajax.post(import.meta.env.VITE_BACKEND + url, data, config);
  }

  _put(url, data, config = {}) {
    return ajax.put(import.meta.env.VITE_BACKEND + url, data, config);
  }

  _delete(url, config = {}) {
    return ajax.delete(import.meta.env.VITE_BACKEND + url, config);
  }
}

export default new WS();
