import logging
import time

from flask import Flask, jsonify, request
from logging.config import dictConfig
from config.ddsconfigs import context_path, x_key
from service.userservice import UserService
from service.ddsservice import DDSService
from utils.ddsvalidator import DDSValidator

dds_app = Flask(__name__)
log = logging.getLogger('file')


# REST endpoint for login
@dds_app.route(context_path + '/v1/login', methods=["POST"])
def login():
    user_service, validator = UserService(), DDSValidator()
    data = request.get_json()
    try:
        validation_res = validator.validate_login_req(request)
        if validation_res:
            return jsonify(validation_res), 400
        response = user_service.login(data)
        if not response:
            return {"status": "FAILED", "message": "Something went wrong"}, 400
        if 'status' in response.keys():
            return jsonify(response), 400
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for logout
@dds_app.route(context_path + '/v1/logout', methods=["GET"])
def logout():
    user_service = UserService()
    data = add_headers({}, request)
    try:
        if user_service.is_session_active(data["metadata"]["token"]):
            response = user_service.logout(data["metadata"]["token"])
            if not response:
                return {"status": "FAILED", "message": "Something went wrong"}, 400
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for signup - protected access.
@dds_app.route(context_path + '/v1/signup', methods=["POST"])
def signup():
    user_service = UserService()
    data = request.get_json()
    data = add_headers(data, request)
    try:
        response = user_service.signup(data)
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for delete users - protected access.
@dds_app.route(context_path + '/v1/users/delete', methods=["POST"])
def delete_users():
    user_service = UserService()
    data = request.get_json()
    data = add_headers(data, request)
    try:
        if user_service.is_session_active(data["metadata"]["token"]):
            response = user_service.delete_user(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for file upload (zip file)
@dds_app.route(context_path + '/v1/file/upload', methods=["POST"])
def doc_upload():
    dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request)
    try:
        validation_res = validator.validate_upload_req(request)
        if validation_res:
            return jsonify(validation_res), 400
        if user_service.is_session_active(data["metadata"]["token"]):
            response = dds_service.upload(request, data)
            if "uploadId" in response.keys():
                return jsonify(response), 200
            return jsonify(response), 400
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to search user uploads
@dds_app.route(context_path + '/v1/upload/search', methods=["POST"])
def doc_search():
    dds_service, user_service = DDSService(), UserService()
    data = request.get_json()
    data = add_headers(data, request)
    try:
        if user_service.is_session_active(data["metadata"]["token"]):
            response = dds_service.search_uploads(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request):
    if not data:
        data = {}
    headers = {
        "userId": api_request.headers["x-user-id"],
        "receivedAt": eval(str(time.time()).replace('.', '')[0:13]),
    }
    api_headers = dict(api_request.headers)
    if 'X-Key' in api_headers.keys():
        if api_headers['X-Key'] == x_key:
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
