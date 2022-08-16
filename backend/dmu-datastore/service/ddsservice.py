import csv
import logging
import time
import os
import uuid
from flask_restful import reqparse

from utils.ddsutils import DDSUtils
from repository.userrepo import UserRepo
from repository.ddsrepo import DDSRepo
from config.ddsconfigs import allowed_file_types, local_storage_path, allowed_metadata_file_types, max_no_of_processes

dds_utils = DDSUtils()
user_repo = UserRepo()
dds_repo = DDSRepo()

parser = reqparse.RequestParser(bundle_errors=True)
log = logging.getLogger('file')


class DDSService:
    def __init__(self):
        pass

    def upload(self, api_request, data):
        upload_id = str(uuid.uuid4())
        if self.is_system_busy(upload_id):
            return {"status": "FAILED", "message": "The System is currently busy, please try after sometime."}
        log.info(f"{upload_id} | Initiating...")
        metadata = self.parse_metadata_csv(api_request, upload_id)
        if not metadata:
            log.info(f"{upload_id} | Metadata file couldn't be parsed!")
            return {"status": "FAILED", "message": "Metadata file couldn't be parsed!"}
        if not isinstance(metadata, tuple):
            log.info(f"{upload_id} | Metadata file couldn't be parsed!")
            return metadata
        data["fileMetadata"] = metadata[0]
        doc_path = self.upload_doc_to_azure(api_request, metadata[1], upload_id)
        if doc_path:
            data["uploadId"], data["mediaFilePath"], data["submitterId"] = upload_id, doc_path[0], data["metadata"]["userId"]
            data["createdTimestamp"], data["metadataFilePath"] = eval(str(time.time()).replace('.', '')[0:13]), doc_path[1]
            data["lastUpdatedBy"], data["lastUpdatedTimestamp"] = data["metadata"]["userId"], eval(str(time.time()).replace('.', '')[0:13])
            data["uploadStatus"] = "InProgress"
            log.info(f"{upload_id} | Saving metadata to mongo store....")
            dds_repo.insert_dds_metadata([data])
            return {"status": "Success", "message": "Your file is being uploaded, use 'uploadId' to track the status!", "uploadId": upload_id}
        else:
            log.info(f"{upload_id} | File upload failed.")
            return {"status": "FAILED", "message": "File Upload Failed!"}

    def parse_metadata_csv(self, api_request, upload_id):
        log.info(f"{upload_id} | Parsing metadata file...")
        try:
            file = api_request.files['metadata']
            mime_type, filename = file.mimetype, str(file.filename)
            file_real_name, file_extension = os.path.splitext(filename)
            file_allowed = False
            for allowed_file_extension in allowed_metadata_file_types:
                if file_extension.endswith(allowed_file_extension):
                    file_allowed = True
                    break
            if not file_allowed:
                return {"status": "FAILED", "message": "Unsupported Metadata File Type!"}
            local_filename = f'{upload_id}___metadata___{filename}'
            filepath = os.path.join(local_storage_path, local_filename)
            file.save(filepath)
            result = {}
            with open(filepath, 'r') as f:
                red = csv.DictReader(f, delimiter="\t")
                for d in red:
                    result.setdefault(d['Field'], d['Value'])
            return result, filepath
        except Exception as e:
            log.exception(f"Exception while parsing metadata: {e}", e)
            return None

    def upload_doc_to_azure(self, api_request, metadata_filepath, upload_id):
        try:
            log.info(f"{upload_id} | Processing Zip File......")
            file = api_request.files['zipFile']
            mime_type, filename = file.mimetype, str(file.filename)
            file_real_name, file_extension = os.path.splitext(filename)
            local_filename = f'{upload_id}___{filename}'
            filepath = os.path.join(local_storage_path, local_filename)
            file_allowed = False
            for allowed_file_extension in allowed_file_types:
                if file_extension.endswith(allowed_file_extension):
                    file_allowed = True
                    break
            if not file_allowed:
                return {"status": "FAILED", "message": "Unsupported File Type!"}
            log.info(f"{upload_id} | Saving to local store...")
            file.save(filepath)
            log.info(f"{upload_id} | Uploading to blob store...")
            uploaded_path = dds_utils.upload_file_to_azure_blob(filepath, filename, upload_id)
            metadata_filename = metadata_filepath.split("___")[2]
            uploaded_metadata_path = dds_utils.upload_file_to_azure_blob(metadata_filepath, metadata_filename, upload_id)
            return uploaded_path, uploaded_metadata_path
        except Exception as e:
            log.exception(f"Exception while uploading to azure: {e}", e)
            return None

    def is_system_busy(self, upload_id):
        query, exclude, is_sys_busy = {"status": "InProgress"}, {"_id": False}, False
        pending_jobs = dds_repo.search_dds(query, exclude, None, None)
        if pending_jobs:
            if len(pending_jobs) >= max_no_of_processes:
                log.info(f'{upload_id} | The system is busy, no of proc: {len(pending_jobs)}')
                is_sys_busy = True
        return is_sys_busy

    def search_uploads(self, data):
        log.info("Searching for User Uploads......")
        query = {"submitterId": data["metadata"]["userId"]}
        if 'uploadId' in data.keys():
            query["uploadId"] = data["uploadId"]
        result = dds_repo.search_dds(query, {"_id": False}, None, None)
        return result
