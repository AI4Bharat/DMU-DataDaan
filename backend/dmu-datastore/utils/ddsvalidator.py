import logging
from repository.ddsrepo import DDSRepo

log = logging.getLogger('file')
dds_repo = DDSRepo()


class DDSValidator:
    def __init__(self):
        pass

    def validate_upload_req(self, api_request):
        try:
            meta, zip = api_request.files["metadata"], api_request.files["zipFile"]
            return None
        except Exception as e:
            return {"status": "VALIDATION_FAILED", "message": "metadata and zipFilePath are mandatory"}

    def validate_login_req(self, api_request):
        try:
            if 'username' not in api_request.keys():
                return {"status": "VALIDATION_FAILED", "message": "username is mandatory!"}
            if 'password' not in api_request.keys():
                return {"status": "VALIDATION_FAILED", "message": "password is mandatory!"}
        except Exception as e:
            return {"status": "VALIDATION_FAILED", "message": "mandatory fields missing."}


