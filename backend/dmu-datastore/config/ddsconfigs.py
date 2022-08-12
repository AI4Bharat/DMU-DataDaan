import os

db_cluster = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')
app_host = os.environ.get('DDS_APP_HOST', 'localhost')
app_port = os.environ.get('DDS_APP_PORT', 5001)
context_path = os.environ.get('DMU_DUS_CONTEXT_PATH', '/dmu-datastore/data-upload-service')
db = os.environ.get('DMU_DUS_DB', "ulca")
user_collection = os.environ.get('DMU_DUS_USER_COL', "users")
dds_collection = os.environ.get('DMU_DUS_DDS_COL', "dds")
session_collection = os.environ.get('DMU_DUS_SESSION_COL', "sessions")
session_timeout_in_ms = os.environ.get('DMU_DUS_SESSION_TIMEOUT_IN_MS', 1000000)
if isinstance(session_timeout_in_ms, str):
    ds_batch_size = eval(session_timeout_in_ms)
allowed_file_types = ["zip"]
allowed_metadata_file_types = ["tsv"]
local_storage_path = os.environ.get('DMU_DUS_LOCAL_STORAGE_PATH', "/Users/vishalmahuli/Desktop/dmu-dus/docs")
azure_connection_string = os.environ.get('DMU_DUS_AZURE_CONNECTION_STRING', "connection_string")
azure_container_name = os.environ.get('DMU_DUS_AZURE_FILE_CONTAINER', "container")
azure_account_name = os.environ.get('DMU_DUS_AZURE_ACCOUNT_NAME', "account")
azure_link_prefix = f'https://{azure_account_name}.blob.core.windows.net/{azure_container_name}/'
x_key = os.environ.get('DMU_DUS_X_KEY', "d6fd7481-f43e-4b76-b882-2ec512350d75")
