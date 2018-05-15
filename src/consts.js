global.TITEL_PREFIX='Eye On WHAT!';
global.CHARGE_CODE_URL="https://github.com/yynie/some/raw/master/QR.jpg";

/* cookie */
global.COOKIE_EXPIRED = 1;
global.COOKIE_EXPIRED_UNIT = 'day'; //minute hour day

/** url to vaddservice START **/
global.BASE_URL = "192.168.20.103:10088/vaddservice/";
global.SERVER = "http://" + BASE_URL;
global.URL_RETAIL_LOGIN = SERVER + "vcpapi/v1/accounts/retaillogin";
global.URL_VCPDATA = SERVER + "vcpapi/v1/accounts/boundvcpsub";
global.URL_VCPBALANCE = SERVER + "vcpapi/v1/accounts/allbalance";

global.WS_URL = "ws://" + BASE_URL + "verifycode"


/** url to vaddservice END **/


/** url to Ali vcpweb-query-backend START **/
global.QUERY_SERVER = "http://127.0.0.1:3000/qserver/"
global.URL_HISTORY = QUERY_SERVER + "vcpapi/v1/history"

/** url to Ali vcpweb-query-backend END **/