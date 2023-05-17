import os

db_cluster = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://dmuadmin:ai4bharat123@mongodb:27017/')
app_host = os.environ.get('DDS_APP_HOST', 'localhost')
app_port = os.environ.get('DDS_APP_PORT', 5001)
context_path = os.environ.get('DMU_DUS_CONTEXT_PATH', '/datadaaan')
db = os.environ.get('DMU_DUS_DB', "dmu-datastore")
user_collection = os.environ.get('DMU_DUS_USER_COL', "users")
dds_collection = os.environ.get('DMU_DUS_DDS_COL', "dds")
session_collection = os.environ.get('DMU_DUS_SESSION_COL', "sessions")
session_timeout_in_ms = os.environ.get('DMU_DUS_SESSION_TIMEOUT_IN_MS', 86400000)
if isinstance(session_timeout_in_ms, str):
    session_timeout_in_ms = eval(session_timeout_in_ms)
allowed_file_types = ["zip"]
allowed_metadata_file_types = ["txt"]
local_storage_path = os.environ.get('DMU_DUS_LOCAL_STORAGE_PATH', "/Users/vishalmahuli/Desktop/dmu-dus/docs")
azure_connection_string = os.environ.get('DMU_DUS_AZURE_CONNECTION_STRING', "connection_string")
azure_container_name = os.environ.get('DMU_DUS_AZURE_FILE_CONTAINER', "container")
azure_account_name = os.environ.get('DMU_DUS_AZURE_ACCOUNT_NAME', "account")
azure_link_prefix = f'https://{azure_account_name}.blob.core.windows.net/{azure_container_name}/'
x_key = os.environ.get('DMU_DUS_X_KEY', "d6fd7481-f43e-4b76-b882-2ec512350d75")
max_no_of_processes = os.environ.get('DMU_DUS_MAX_NO_OF_PROC', 10)
t_and_c_file = os.environ.get('DMU_DUS_T_AND_C_FILE_PATH', "/app/config/termsAndConditions.json")
if isinstance(max_no_of_processes, str):
    max_no_of_processes = eval(max_no_of_processes)
max_media_file_size_in_mb = os.environ.get('DMU_DUS_MAX_MEDIA_FILE_SIZE_IN_MB', 5000)
if isinstance(max_media_file_size_in_mb, str):
    max_file_size_in_mb = eval(max_media_file_size_in_mb)
max_metadata_file_size_in_mb = os.environ.get('DMU_DUS_MAX_METADATA_FILE_SIZE_IN_MB', 10)
if isinstance(max_metadata_file_size_in_mb, str):
    max_metadata_file_size_in_mb = eval(max_metadata_file_size_in_mb)

