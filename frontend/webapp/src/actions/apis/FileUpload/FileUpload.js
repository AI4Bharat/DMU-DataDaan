/**
 * FileUpload API
 */
import API from "../../api";
import C from "../../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class LoginAPI extends API {
  constructor(metadataFile, zipFile, permission, termsAndConditions, additionalDetails, acceptance, userData, timeout = 2000) {
    super("POST", timeout, false, "MULTIPART");
    this.type = C.FILEUPLOAD;
    this.metadataFile = metadataFile;
    this.zipFile = zipFile;
    this.permission = permission;
    this.termsAndConditions = termsAndConditions;
    this.additionalDetails = additionalDetails;
    this.acceptance = acceptance;
    this.userData= userData;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.upload}`;
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

  getFormData() {
    const obj = {
      permission: this.permission,
      termsAndConditions: this.termsAndConditions,
      additionalDetails: this.additionalDetails,
      acceptance: this.acceptance,
    };

    const json = JSON.stringify(obj);
    
    const submitterInfo = JSON.stringify(this.userData);

    const formData = new FormData();
    formData.append("zipFile", this.zipFile[0]);
    formData.append("metadata", this.metadataFile[0]);
    formData.append("agreement", json);
    formData.append("submitterInfo", submitterInfo);

    return formData;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res.data;
    }
  }

  getHeaders() {
    const {
      token,
      user: { userId },
    } = this.userDetails;
    this.headers = {
      headers: {
        "x-token": token,
        "x-user-id": userId,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
