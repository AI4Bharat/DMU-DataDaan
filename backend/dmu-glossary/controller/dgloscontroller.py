import logging
import time

import uuid
from flask import Flask, jsonify, request
from logging.config import dictConfig
from config.dglosconfigs import context_path, x_key
from service.dglosservice import DGlosService
from utils.dglosvalidator import DGlosValidator
from flask_cors import CORS

dglos_app = Flask(__name__)
cors = CORS(dglos_app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

log = logging.getLogger('file')


@dglos_app.route(context_path + '/ping')
def index():
    return jsonify(
        status=True,
        message='Welcome to the DMU Glossary Server!'
    )


# REST endpoint for login
@dglos_app.route(context_path + '/v1/glossary/create', methods=["POST"])
def create():
    dglos_service, validator = DGlosService(), DGlosValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        response = dglos_service.create(data)
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for login
@dglos_app.route(context_path + '/v1/glossary/file/upload', methods=["POST"])
def upload():
    dglos_service, validator = DGlosService(), DGlosValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        response = dglos_service.upload_file(request, data)
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for logout
@dglos_app.route(context_path + '/v1/sentence/phrases/search', methods=["GET"])
def search_phrases_for_sentence():
    dglos_service, validator = DGlosService(), DGlosValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        response = dglos_service.search_glossary(data)
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request, user_id):
    if not data:
        data = {}
    headers = {
        "userId": user_id,
        "receivedAt": eval(str(time.time()).replace('.', '')[0:13]),
        "requestId": str(uuid.uuid4())
    }
    api_headers = dict(api_request.headers)
    if 'X-Key' in api_headers.keys():
        headers["xKey"] = api_headers['X-Key']
    if 'X-Token' in api_headers.keys():
        headers["token"] = api_headers['X-Token']
    data["metadata"] = headers
    return data


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
