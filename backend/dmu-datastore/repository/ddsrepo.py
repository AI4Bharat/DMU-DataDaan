import logging
import pymongo
from config.ddsconfigs import db_cluster, db, dds_collection

log = logging.getLogger('file')

mongo_instance_dds = None


class DDSRepo:
    def __init__(self):
        pass

    # Initialises and fetches mongo db client
    def instantiate(self):
        global mongo_instance_dds
        client = pymongo.MongoClient(db_cluster)
        mongo_instance_dds = client[db][dds_collection]
        return mongo_instance_dds

    def get_dds_connection(self):
        global mongo_instance_dds
        if not mongo_instance_dds:
            return self.instantiate()
        else:
            return mongo_instance_dds

    def insert_dds_metadata(self, data):
        col = self.get_dds_connection()
        col.insert_many(data)
        return len(data)

    # Searches the object into mongo collection
    def search_dds(self, query, exclude, offset, res_limit):
        col = self.get_dds_connection()
        if offset is None and res_limit is None:
            res = col.find(query, exclude).sort([('_id', 1)])
        else:
            res = col.find(query, exclude).sort([('_id', -1)]).skip(offset).limit(res_limit)
        result = []
        for record in res:
            del record["metadata"]
            del record["media_local"]
            del record["metadata_local"]
            result.append(record)
        return result

    def delete_dds_metadata(self, query):
        col = self.get_dds_connection()
        deleted = col.delete_many(query)
        return deleted.deleted_count

    def update_dds_metadata(self, find_query, set_clause):
        col = self.get_dds_connection()
        updated = col.update(find_query, {"$set": set_clause})
        return updated

    def hash_check(self,file_hash):
        col = self.get_dds_connection()
        result = col.find({"fileHash":file_hash})
        if result.count() == 0 :
            return 0
        if result.count() == 1 :
            return 1

        
