import json
import logging

import requests

from repository.ddsrepo import DDSRepo
from service.ddsservice import DDSService
from config.ddsconfigs import t_and_c_file

log = logging.getLogger('file')
dds_repo, dds_service = DDSRepo(), DDSService()
list_of_tc_keys = []


class DDSValidator:
    def __init__(self):
        pass

    def fetch_tc_keys(self):
        global list_of_tc_keys
        tc_list = []
        log.info(f"Reading T&C from - {t_and_c_file}")
        response = json.loads(requests.get(t_and_c_file).text)
        if response:
            response = response["termsAndConditions"]
            for k in response.keys():
                val_list = response[k]
                if val_list:
                    for val in val_list:
                        if val["active"]:
                            tc_list.append(val["code"])
        else:
            log.info(f"T&C unavailable at - {t_and_c_file}")
        if tc_list:
            list_of_tc_keys = tc_list

    def validate_upload_req(self, api_request):
        try:
            if dds_service.is_system_busy():
                return {"status": "FAILED", "message": "The System is currently busy, please try after sometime."}
            log.info("Validating the Upload request.........")
            files = api_request.files
            if 'metadata' not in files.keys():
                return {"status": "VALIDATION_FAILED", "message": "metadata is mandatory!"}
            if 'zipFile' not in files.keys():
                return {"status": "VALIDATION_FAILED", "message": "zipFile is mandatory!"}
            return None
        except Exception as e:
            log.exception(f"Exception in upload validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "metadata and zipFilePath are mandatory"}

    def validate_login_req(self, api_request):
        try:
            log.info("Validating the Login request.........")
            data = api_request.get_json()
            if 'username' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "username is mandatory!"}
            if 'password' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "password is mandatory!"}
        except Exception as e:
            log.exception(f"Exception in login validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}

    def validate_delete_req(self, data):
        try:
            log.info("Validating the Delete Uploads request.........")
            if 'uploadIds' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "uploadIds is mandatory!"}
        except Exception as e:
            log.exception(f"Exception in login validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}

    def validate_terms_and_cond(self, data):
        global list_of_tc_keys
        try:
            log.info("Validating the T&C request.........")
            if 'termsAndConditions' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "termsAndConditions is mandatory!"}
            if data["termsAndConditions"] not in list_of_tc_keys:
                return {"status": "VALIDATION_FAILED", "message": "termsAndConditions is invalid!"}
            if 'permission' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "permission is mandatory!"}
            if data["permission"] not in list_of_tc_keys:
                return {"status": "VALIDATION_FAILED", "message": "permission is invalid!"}
        except Exception as e:
            log.exception(f"Exception in login validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}
