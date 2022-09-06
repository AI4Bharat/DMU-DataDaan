#!/bin/python
import json
import logging
import os

from logging.config import dictConfig
from utils.ddsutils import DDSUtils

from controller.ddscontroller import dds_app
from config.ddsconfigs import app_host, app_port, local_storage_path

log = logging.getLogger('file')
list_of_tc_keys = []


def create_local_storage_folder():
    if not os.path.exists(local_storage_path):
        log.info(f"Creating an empty folder -- {local_storage_path}")
        os.makedirs(local_storage_path)
    else:
        log.info(f"{local_storage_path} - Folder Exists!")


create_local_storage_folder()
utils = DDSUtils()
utils.fetch_tc_keys()

if __name__ == '__main__':
    dds_app.run(host=app_host, port=eval(str(app_port)), threaded=True)

# Log config
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] {%(filename)s:%(lineno)d} %(threadName)s %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {
        'info': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'filename': 'info.log'
        },
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout',
        }
    },
    'loggers': {
        'file': {
            'level': 'DEBUG',
            'handlers': ['info', 'console'],
            'propagate': ''
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['info', 'console']
    }
})
