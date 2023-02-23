import API from "../../api";
import C from "../../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchMyContributionListAPI extends API {
  constructor(timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.MY_CONTRIBUTION_LIST;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.search}`;
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
    const { token, user } = JSON.parse(localStorage.getItem("userInfo"));

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
        "x-user-id": user.userId,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
