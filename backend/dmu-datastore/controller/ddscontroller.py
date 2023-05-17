import logging
import time
import os

from flask import Flask, jsonify, request
from logging.config import dictConfig
from config.ddsconfigs import context_path, x_key ,local_storage_path
from service.userservice import UserService
from service.ddsservice import DDSService
from utils.ddsvalidator import DDSValidator
from utils.ddsutils import DDSUtils
from flask_cors import CORS, cross_origin

dds_app = Flask(__name__)
cors = CORS(dds_app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

log = logging.getLogger('file')


@dds_app.route('/ping')
def index():
    return jsonify(
        status=True,
        message='Welcome to the DMU Backend Server!'
    )

# print("*"*500,context_path)
# REST endpoint for login
@dds_app.route(os.path.join(context_path,'/v1/login'), methods=["POST"])
def login():
    user_service, validator = UserService(), DDSValidator()
    data = request.get_json()
    try:
        validation_res = validator.validate_login_req(request)
        if validation_res:
            return jsonify(validation_res), 400
        response = user_service.login(data)
        log.info(response)
        if not response:
            return {"status": "FAILED", "message": "Something went wrong"}, 400
        if 'status' in response.keys():
            return jsonify(response), 400
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for logout
@dds_app.route(os.path.join(context_path, '/v1/logout'), methods=["GET"])
def logout():
    user_service = UserService()
    data = add_headers({}, request, "userId")
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
@dds_app.route(os.path.join(context_path, '/v1/signup'), methods=["POST"])
def signup():
    dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        validated = validator.validate_signup(data)
        if validated:
            return jsonify(validated), 400
        response = user_service.signup(data)
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for delete users - protected access.
@dds_app.route(os.path.join(context_path, '/v1/users/delete'), methods=["POST"])
def delete_users():
    dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            validation_res = validator.validate_users_del(data)
            if validation_res:
                return jsonify(validation_res), 400
            response = user_service.delete_user(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint for file upload (zip file)
@dds_app.route(os.path.join(context_path, '/v1/file/upload'), methods=["POST"])
def doc_upload():
    dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
    data = request.form.to_dict(flat=False) #to get agreement and submitterInfo from request body
   
    # data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            validation_res = validator.validate_upload_req(request, data)
            if "status" in validation_res.keys(): #status key in  indicate validation error
                return jsonify(validation_res), 400
            response = dds_service.upload(request, data , validation_res)
            if "uploadId" in response.keys():
                return jsonify(response), 200
            else:
                return jsonify(response),200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to search user uploads
@dds_app.route(os.path.join(context_path, '/v1/upload/search'), methods=["POST"])
def doc_search():
    dds_service, user_service = DDSService(), UserService()
    data = request.get_json(silent=True)
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            response = dds_service.search_uploads(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


# REST endpoint to search user uploads
@dds_app.route(os.path.join(context_path, '/v1/upload/delete'), methods=["POST"])
def doc_delete():
    dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            validation_res = validator.validate_delete_req(data)
            if validation_res:
                return jsonify(validation_res), 400
            response = dds_service.delete_uploads(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400

# @dds_app.route(context_path + '/v1/userinfo', methods=["POST"])
# def submitter_info():
#     dds_service, user_service, validator = DDSService(), UserService(), DDSValidator()
#     data = request.get_json()
#     submitter_info = {}
#     submitter_info["orgName"] = data["organisationName"]
#     submitter_info["name"] = data["submitterName"]
#     submitter_info["designation"] = data["designation"]
#     submitter_info["emailId"] = data["emailId"]
#     submitter_info["contactNumber"] = data ["contactNumber"]
#     submitter_info["directoryStructure"] = data["directoryStructure"]
#     return submitter_info


'''
# REST endpoint to search user uploads
@dds_app.route(context_path + '/v1/terms/accept', methods=["POST"])
def terms_accept():
    user_service, validator = UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            validation_res = validator.validate_terms_and_cond(data)
            if validation_res:
                return jsonify(validation_res), 400
            response = user_service.add_tc_to_user(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400
'''


# REST endpoint to search user uploads
@dds_app.route(os.path.join(context_path, '/v1/terms/search'), methods=["GET"])
def terms_search():
    utils = DDSUtils()
    try:
        response = utils.get_t_and_c()[0]
        return jsonify(response), 200
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400


'''
# REST endpoint to search user uploads
@dds_app.route(context_path + '/v1/terms/delete', methods=["GET"])
def terms_delete():
    user_service, validator = UserService(), DDSValidator()
    data = request.get_json()
    data = add_headers(data, request, "userId")
    try:
        user_id = user_service.is_session_active(data["metadata"]["token"])
        if user_id:
            data = add_headers(data, request, user_id)
            validation_res = validator.validate_tc_del_req(data)
            if validation_res:
                return jsonify(validation_res), 400
            response = user_service.del_tc_user(data)
            return jsonify(response), 200
        response = {"status": "Invalid Access", "message": "You're not authorised to access this resource"}
        return jsonify(response), 403
    except Exception as e:
        log.exception("Something went wrong: " + str(e), e)
        return {"status": "FAILED", "message": "Something went wrong"}, 400
'''


# Fetches required headers from the request and adds it to the body.
def add_headers(data, api_request, user_id):
    if not data:
        data = {}
    headers = {
        "userId": user_id,
        "receivedAt": eval(str(time.time()).replace('.', '')[0:13]),
    }
    api_headers = dict(api_request.headers)
    log.info(f"the headers are {api_headers}")
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
