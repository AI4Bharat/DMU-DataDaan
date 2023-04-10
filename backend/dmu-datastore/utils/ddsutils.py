import json
import time
from re import sub

import bcrypt as bcrypt
import threading
import logging
from repository.ddsrepo import DDSRepo
from azure.storage.blob import BlobServiceClient
from config.ddsconfigs import azure_link_prefix, azure_connection_string, azure_container_name
from config.ddsconfigs import t_and_c_file
import os

log = logging.getLogger('file')
dds_repo = DDSRepo()
list_of_tc_keys, t_and_c_data = [], {}


class DDSUtils:
    def __init__(self):
        pass

    def hash_password(self, password):
        password_in_byte = bytes(password, "utf-8")
        salt = bcrypt.gensalt()
        hashed_pwd = bcrypt.hashpw(password_in_byte, salt)
        return hashed_pwd, salt

    def verify_pwd(self, pwd, salt, ip_pwd):
        password_in_byte = bytes(ip_pwd, "utf-8")
        hashed_pwd = bcrypt.hashpw(password_in_byte, salt)
        if pwd == hashed_pwd:
            return True
        return False

    # uploading file to blob storage
    def upload_file_to_azure_blob(self, file_path, file_name, folder):
        try:
            blob_file_name = folder + "/" + file_name
            blob_service_client = BlobServiceClient.from_connection_string(azure_connection_string)
            blob_client = blob_service_client.get_blob_client(container=azure_container_name, blob=blob_file_name)
            log.info(f'{folder} | Pushing {file_path} to azure at {blob_file_name} on a new fork......')
            blob_uploader = threading.Thread(target=self.upload_file, args=(blob_client, file_path, folder))
            blob_uploader.start()
            '''
            log.info(f'Pushing {file_path} to azure at {blob_file_name} synchronously....')
            self.upload_file(blob_client, file_path)
            '''
            return f'{azure_link_prefix}{blob_file_name}'
        except Exception as e:
            log.exception(f'Exception while getting Blob Client to azure blob storage: {e}', e)
            self.update_upload_status(folder, file_path, True)
            return None

    def upload_file(self, blob_client, file_path, upload_id):
        try:
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            self.update_upload_status(upload_id, file_path, False)
        except Exception as e:
            log.exception(f'Exception while pushing to azure blob storage: {e}', e)
            self.update_upload_status(upload_id, file_path, True)

    def camel_case(self, str):
        s = sub(r"(_|-)+", " ", str).title().replace(" ", "")
        return ''.join([s[0].lower(), s[1:]])

    def update_upload_status(self, upload_id, file_path, upload_failed):
        log.info(f"{upload_id} | Updating Upload status for: {file_path}")
        if upload_failed:
            update_query = {"uploadStatus": "Failed",
                            "lastUpdatedTimestamp": eval(str(time.time()).replace('.', '')[0:13])}
            dds_repo.update_dds_metadata({"uploadId": upload_id}, update_query)
        else:
            if "___metadata___" in file_path:
                query = {"lastUpdatedTimestamp": eval(str(time.time()).replace('.', '')[0:13])}
            else:
                query = {"uploadStatus": "Completed",
                         "lastUpdatedTimestamp": eval(str(time.time()).replace('.', '')[0:13])}
            dds_repo.update_dds_metadata({"uploadId": upload_id}, query)
            os.remove(file_path)

    def fetch_tc_keys(self):
        global list_of_tc_keys
        global t_and_c_data
        tc_list = []
        log.info(f"Reading T&C from - {t_and_c_file}")
        try:
            with open("/app/config/termsAndConditions.json", 'r') as f:
                t_and_c_data = json.load(f)
            if t_and_c_data:
                data = t_and_c_data["termsAndConditions"]
                for k in data.keys():
                    val_list = data[k]
                    if val_list:
                        for val in val_list:
                            if val["active"]:
                                tc_list.append(val["code"])
            else:
                log.info(f"T&C unavailable at - {t_and_c_file}")
            if tc_list:
                log.info(tc_list)
                list_of_tc_keys = tc_list
        except Exception as e:
            log.exception(f"Exception while reading T&C file: {e}", e)

    def get_t_and_c(self):
        global t_and_c_data
        global list_of_tc_keys
        return t_and_c_data, list_of_tc_keys
