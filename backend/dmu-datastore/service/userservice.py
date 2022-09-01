import logging
import time
import uuid

from utils.ddsutils import DDSUtils
from repository.userrepo import UserRepo
from config.ddsconfigs import session_timeout_in_ms

dds_utils = DDSUtils()
user_repo = UserRepo()
log = logging.getLogger('file')


class UserService:
    def __init__(self):
        pass

    def signup(self, user_signup_req):
        log.info("Signing Up...")
        query = {"username": user_signup_req["email"]}
        users = user_repo.search_users(query, {'_id': False}, None, None)
        if users:
            return {"status": "Signup failed", "message": "Username already used, try a different email Id."}
        pwd = dds_utils.hash_password(user_signup_req["password"])
        user_signup_req["password"], user_signup_req["salt"] = pwd[0], pwd[1]
        user_signup_req["username"] = user_signup_req["email"]
        user_signup_req["userId"] = str(uuid.uuid4())
        del user_signup_req["metadata"]
        user_repo.insert_users([user_signup_req])
        return {"status": "Success", "message": "User created Successfully"}

    def delete_user(self, user_delete_req):
        log.info("Deleting User...")
        query = {"username": user_delete_req["username"]}
        users = user_repo.search_users(query, {'_id': False}, None, None)
        if users:
            user = users[0]
            user_repo.delete_users(query)
            user_repo.logout({"userId": user["userId"]})
        return {"status": "Success", "message": "User deleted Successfully"}

    def login(self, login_req):
        log.info("Logging in...")
        query = {"username": login_req["username"]}
        try:
            users = user_repo.search_users(query, {'_id': False}, None, None)
            if not users:
                return {"status": "login failed", "message": "Invalid User"}
            user = users[0]
            if dds_utils.verify_pwd(user["password"], user["salt"], login_req["password"]):
                user_repo.logout({"userId": user["userId"]})
                login_entity = {"userId": user["userId"], "token": str(uuid.uuid4()),
                                "createdAt": eval(str(time.time()).replace('.', '')[0:13]), "expired": False}
                user_repo.login(login_entity)
                del user["password"]
                del user["salt"]
                user_data = {"token": login_entity["token"], "user": user}
                return user_data
            else:
                return {"status": "login failed", "message": "Invalid Password"}
        except Exception as e:
            log.exception(f"Exception while logging in: {e}", e)
            return None

    def is_session_active(self, token):
        log.info("Checking if the user session is active.....")
        session_details = user_repo.session_search({"token": token})
        if not session_details:
            log.info(f'Invalid Token!')
            return False
        session_details = session_details[0]
        diff = eval(str(time.time()).replace('.', '')[0:13]) - session_details["createdAt"]
        if diff > session_timeout_in_ms:
            log.info(f'Session Expired')
            self.logout(token)
            return False
        return session_details["userId"]

    def logout(self, token):
        log.info("Logging out...")
        try:
            session_details = user_repo.session_search({"token": token})
            if not session_details:
                log.info(f'Logged out already!')
                return {"status": "Success", "message": "Logged out already!"}
            session_details = session_details[0]
            logged_out = user_repo.logout({"userId": session_details["userId"]})
            if logged_out > 0:
                log.info(f'Logged out successfully!')
                return {"status": "Success", "message": "logged out!"}
        except Exception as e:
            log.exception(f"Exception while logging in: {e}", e)
            return None
    '''
    def add_tc_to_user(self, data):
        log.info("Updating T&C...")
        try:
            user_id = data["metadata"]["userId"]
            user = user_repo.search_users({"userId": user_id}, {'_id': False}, None, None)[0]
            if 'termsAndConditions' in user.keys():
                return {"status": "FAILED", "message": "This user has already accepted T&C"}
            else:
                terms_and_cond = data
                del terms_and_cond["metadata"]
                terms_and_cond["acceptedTimestamp"] = eval(str(time.time()).replace('.', '')[0:13])
                user_repo.update_users({"userId": user_id}, {"termsAndConditions": terms_and_cond})
                return {"status": "Success", "message": "T&C acceptance recorded!"}
        except Exception as e:
            log.exception(f"Exception while logging in: {e}", e)
            return None
    '''

    '''
    def del_tc_user(self, data):
        log.info("Deleting T&C...")
        try:
            user_id = data["metadata"]["userId"]
            user_repo.delete_a_key({"userId": user_id}, "termsAndConditions")
            return {"status": "Success", "message": "T&C deleted!"}
        except Exception as e:
            log.exception(f"Exception while Deleting TC for User in: {e}", e)
            return None
    '''
