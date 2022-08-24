/**
 * AcceptTermsAndConditions API
 */
import API from "../../api";
import C from "../../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class AcceptTermsAndConditions extends API {
  constructor(termsAndConditions, permission, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.ACCEPT_TERMS_AND_CONDITIONS;
    this.termsAndConditions = termsAndConditions;
    this.permission = permission;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.acceptTermsAndConditions
    }`;
    this.userDetails = JSON.parse(localStorage.getItem("userInfo"));
  }

  apiEndPoint() {
    return this.endpoint;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${
      this.token
    } expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  getBody() {
    const { termsAndConditions, permission } = this;
    return {
      termsAndConditions,
      permission,
    };
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
    }
  }

  getHeaders() {
    const { token } = this.userDetails;
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
