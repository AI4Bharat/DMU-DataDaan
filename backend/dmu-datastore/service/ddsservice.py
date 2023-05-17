import csv
import json
import logging
import time
import os
import uuid
from flask_restful import reqparse
import hashlib
from flask import jsonify
# from filehash import FileHash
# import traceback

from utils.ddsutils import DDSUtils
from repository.userrepo import UserRepo
from repository.ddsrepo import DDSRepo
from config.ddsconfigs import allowed_file_types, local_storage_path, allowed_metadata_file_types, max_no_of_processes, \
    max_media_file_size_in_mb, max_metadata_file_size_in_mb

dds_utils = DDSUtils()
user_repo = UserRepo()
dds_repo = DDSRepo()

parser = reqparse.RequestParser(bundle_errors=True)
log = logging.getLogger('file')


class DDSService:
    def __init__(self):
        pass

    def upload(self, api_request, data ,fileIds):
        upload_id = str(uuid.uuid4())
        log.info(f"{upload_id} | Initiating...")
        find_hash = DDSRepo()
        file_hash = self.hash_file(api_request , upload_id , fileIds['zipFileId'])
        hash_result = find_hash.hash_check(file_hash)
        if hash_result == 1 :
            return {"status":"Success","message":"This file already exists"}
        metadata = self.parse_metadata_file(api_request, upload_id ,fileIds['metaFileId'])
        if not metadata:
            log.info(f"{upload_id} | Metadata file couldn't be parsed!")
            return {"status": "FAILED", "message": "Metadata file couldn't be parsed!"}
        if not isinstance(metadata, tuple):
            log.info(f"{upload_id} | Metadata file couldn't be parsed or is too Large!")
            return metadata
        data["fileMetadata"], meta_filepath = metadata[0], metadata[1]
        doc_path = self.upload_doc_to_azure(api_request, metadata[1], upload_id , fileIds['zipFileId'])
        if doc_path:
            if not isinstance(doc_path, list):
                return doc_path
            data["agreement"] = json.loads(api_request.form.get('agreement'))
            data["submitterInfo"] = json.loads(api_request.form.get('submitterInfo'))
            data["uploadId"], data["mediaFilePath"], data["submitterId"] = upload_id, doc_path[0], data["metadata"]["userId"]
            data["createdTimestamp"], data["metadataFilePath"] = eval(str(time.time()).replace('.', '')[0:13]), doc_path[2]
            data["lastUpdatedBy"], data["lastUpdatedTimestamp"] = data["metadata"]["userId"], eval(str(time.time()).replace('.', '')[0:13])
            data["uploadStatus"], data["active"] = "InProgress", True
            data["metadata_local"], data["media_local"] = doc_path[3], doc_path[1]
            data["fileHash"] = file_hash
            log.info(f"{upload_id} | Saving metadata to mongo store....")
            dds_repo.insert_dds_metadata([data])
            return {"status": "Success", "message": "Your files are being uploaded, use 'uploadId' to track the status!", "uploadId": upload_id}
        else:
            log.info(f"{upload_id} | File upload failed.")
            return {"status": "FAILED", "message": "File Upload Failed!"}

    def parse_metadata_file(self, api_request, upload_id, metaFileId):
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
            # file.save(filepath)
            os.rename(f"{local_storage_path}/{metaFileId}.txt",filepath) #renamed file saved after validation
            file_size = os.stat(filepath).st_size
            file_size_in_mb = file_size / (1024 * 1024)
            if file_size_in_mb > max_metadata_file_size_in_mb:
                os.remove(filepath)
                log.info(f"{upload_id} | Metadata File too Large!")
                return {"status": "FAILED", "message": f"File too Large, Allowed metadata file size: {max_metadata_file_size_in_mb}MB"}
            '''
            result = {}
            with open(filepath, 'r') as f:
                red = csv.DictReader(f, delimiter="\t")
                for d in red:
                    result.setdefault(d['Field'], d['Value'])
            '''
            file = open(filepath, "r")
            result = {"content": file.read()}
            return result, filepath
        except Exception as e:
            log.exception(f"Exception while parsing metadata: {e}", e)
            return None

    def upload_doc_to_azure(self, api_request, metadata_filepath, upload_id,zipFileId):
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
                log.info(f"{upload_id} | Unsupported Media File Type!!")
                return {"status": "FAILED", "message": "Unsupported Media File Type!"}
            log.info(f"{upload_id} | Saving to local store...")
            os.rename(f"{local_storage_path}/{zipFileId}.zip",filepath) #renamed file saved after validation
            # file.save(filepath)
            file_size = os.stat(filepath).st_size
            file_size_in_mb = file_size / (1024 * 1024)
            if file_size_in_mb > max_media_file_size_in_mb:
                os.remove(filepath)
                os.remove(metadata_filepath)
                log.info(f"{upload_id} | Media File too Large!")
                return {"status": "FAILED", "message": f"File too Large, Allowed media file size: {max_media_file_size_in_mb}MB"}
            log.info(f"{upload_id} | Uploading to blob store...")
            uploaded_path = dds_utils.upload_file_to_azure_blob(filepath, filename, upload_id)
            if uploaded_path:
                metadata_filename = metadata_filepath.split("___")[2]
                uploaded_metadata_path = dds_utils.upload_file_to_azure_blob(metadata_filepath, metadata_filename, upload_id)
                if uploaded_metadata_path:
                    return [uploaded_path, filepath, uploaded_metadata_path, metadata_filepath]
            os.remove(filepath)
            os.remove(metadata_filepath)
            return {"status": "FAILED", "message": "File Upload failed due to an internal error!"}
        except Exception as e:
            log.exception(f"Exception while uploading to azure: {e}", e)
            return None

    def is_system_busy(self):
        log.info("Checking for system status.........")
        query, exclude, is_sys_busy = {"uploadStatus": "InProgress", "active": True}, {"_id": False}, False
        pending_jobs = dds_repo.search_dds(query, exclude, None, None)
        if pending_jobs:
            if len(pending_jobs) >= max_no_of_processes:
                log.info(f'The system is busy, no of proc: {len(pending_jobs)}')
                is_sys_busy = True
        return is_sys_busy

    def search_uploads(self, data):
        log.info("Searching for User Uploads......")
        query = {"submitterId": data["metadata"]["userId"], "active": True}
        if 'uploadId' in data.keys():
            query["uploadId"] = data["uploadId"]
        result = dds_repo.search_dds(query, {"_id": False}, None, None)
        return result

    def delete_uploads(self, data):
        log.info("Deleting for User Uploads......")
        query = {"submitterId": data["metadata"]["userId"]}
        if 'uploadIds' in data.keys():
            query["uploadId"] = {"$in": data["uploadIds"]}
        dds_repo.update_dds_metadata(query, {"active": False})
        return {"status": "Success", "message": "Uploads Deleted Successfully."}

    # def hashofzip(self,filepath):
    #     md5hasher = FileHash('md5')
    #     hashed = md5hasher.hash_file(filepath)
    #     return hashed

    def hash_file(self, api_request, upload_id , zipFileId):
    
        log.info(f"{upload_id} | Processing Zip File for hashvalue")
        # file = api_request.files['zipFile']
        with open(f"{local_storage_path}/{zipFileId}.zip","rb") as data :  #read file stored after validation
            hash_value = hashlib.sha256(data.read()).hexdigest()
        return hash_value
    
    