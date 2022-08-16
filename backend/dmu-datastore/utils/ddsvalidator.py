import logging
from repository.ddsrepo import DDSRepo
from service.ddsservice import DDSService

log = logging.getLogger('file')
dds_repo, dds_service = DDSRepo(), DDSService()


class DDSValidator:
    def __init__(self):
        pass

    def validate_upload_req(self, api_request):
        try:
            log.info("Validating the request.........")
            if dds_service.is_system_busy():
                return {"status": "FAILED", "message": "The System is currently busy, please try after sometime."}
            files = api_request.files
            log.info("files read")
            if 'metadata' not in files.keys():
                return {"status": "VALIDATION_FAILED", "message": "metadata is mandatory!"}
            if 'zipFile' not in files.keys():
                return {"status": "VALIDATION_FAILED", "message": "zipFile is mandatory!"}
            log.info("checks over")
            return None
        except Exception as e:
            log.exception(f"Exception in upload validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "metadata and zipFilePath are mandatory"}

    def validate_login_req(self, api_request):
        try:
            log.info("Validating the request.........")
            data = api_request.get_json()
            if 'username' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "username is mandatory!"}
            if 'password' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "password is mandatory!"}
        except Exception as e:
            log.exception(f"Exception in login validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}

    def validate_delete_req(self, api_request):
        try:
            log.info("Validating the request.........")
            data = api_request.get_json()
            if 'uploadIds' not in data.keys():
                return {"status": "VALIDATION_FAILED", "message": "uploadIds is mandatory!"}
        except Exception as e:
            log.exception(f"Exception in login validation: {e}", e)
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}
