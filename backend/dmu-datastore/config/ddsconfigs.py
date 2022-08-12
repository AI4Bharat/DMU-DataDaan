import os

kafka_bootstrap_server_host = os.environ.get('KAFKA_BOOTSTRAP_SERVER_HOST', 'localhost:9092')
db_cluster = os.environ.get('MONGO_CLUSTER_URL', 'mongodb://localhost:27017')
app_host = os.environ.get('DDS_APP_HOST', 'localhost')
app_port = os.environ.get('DDS_APP_PORT', 5001)
context_path = os.environ.get('ANUVAAD_ETL_WFM_CONTEXT_PATH', '/dmu-datastore/data-upload-service')
db = os.environ.get('ULCA_DS_PUBLISH_DB', "ulca")
user_collection = os.environ.get('ULCA_DS_PUBLISH_ASR_COL', "asr-dataset")
dds_collection = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "tts-dataset")
session_collection = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "tts-dataset")
session_timeout_in_ms = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', 1000000)
if isinstance(session_timeout_in_ms, str):
    ds_batch_size = eval(session_timeout_in_ms)
allowed_file_types = ["zip"]
allowed_metadata_file_types = ["csv"]
local_storage_path = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "/Users/vishalmahuli/Desktop/dmu-dus/docs")
azure_link_prefix = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "tts-dataset")
azure_connection_string = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "tts-dataset")
azure_container_name = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "tts-dataset")
x_key = os.environ.get('ULCA_DS_PUBLISH_TTS_COL', "d6fd7481-f43e-4b76-b882-2ec512350d75")

