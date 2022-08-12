import time
from re import sub

import bcrypt as bcrypt
import threading
import logging
from repository.ddsrepo import DDSRepo
from azure.storage.blob import BlobServiceClient
from config.ddsconfigs import azure_link_prefix, azure_connection_string, azure_container_name
import os

log = logging.getLogger('file')
dds_repo = DDSRepo()

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
        blob_file_name = folder + "/" + file_name
        blob_service_client = BlobServiceClient.from_connection_string(azure_connection_string)
        blob_client = blob_service_client.get_blob_client(container=azure_container_name, blob=blob_file_name)
        log.info(f'{folder} | Pushing {file_path} to azure at {blob_file_name} on a new fork......')
        persister = threading.Thread(target=self.upload_file, args=(blob_client, file_path, folder))
        persister.start()
        '''
        log.info(f'Pushing {file_path} to azure at {blob_file_name} synchronously....')
        self.upload_file(blob_client, file_path)
        '''
        return f'{azure_link_prefix}{blob_file_name}'

    def upload_file(self, blob_client, file_path, upload_id):
        try:
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True)
            dds_repo.update_dds_metadata({"uploadId": upload_id}, {"uploadStatus": "Completed", "lastUpdatedTimestamp": eval(str(time.time()).replace('.', '')[0:13])})
            os.remove(file_path)
        except Exception as e:
            log.exception(f'Exception while pushing to azure blob storage: {e}', e)
            dds_repo.update_dds_metadata({"uploadId": upload_id}, {"uploadStatus": "Failed", "lastUpdatedTimestamp": eval(str(time.time()).replace('.', '')[0:13])})

    def camel_case(self, str):
        s = sub(r"(_|-)+", " ", str).title().replace(" ", "")
        return ''.join([s[0].lower(), s[1:]])
