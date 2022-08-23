/**
 * TermsAndConditions API
 */
import API from "../../api";
import C from "../../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class TermsAndConditions extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.TERMSANDCONDITIONS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.termsAndConditions}`;
  }

  apiEndPoint() {
    return this.endpoint;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${
      this.token
    } expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  getBody() {}

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
    }
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
