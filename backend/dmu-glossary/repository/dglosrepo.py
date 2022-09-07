import logging
import time
from datetime import datetime

import pymongo
from elasticsearch import Elasticsearch

from config.dglosconfigs import db_cluster, db, dglos_collection, es_url, base_index

log = logging.getLogger('file')

mongo_instance = None
es_instance = None


class DGlosRepo:
    def __init__(self):
        pass

    # Initialises and fetches mongo db client
    def mongodb_conn_instantiate(self):
        global mongo_instance
        client = pymongo.MongoClient(db_cluster)
        mongo_instance = client[db][dglos_collection]
        return mongo_instance

    # Method to instantiate the elasticsearch client.
    def instantiate_es_client(self):
        global es_instance
        es_client = Elasticsearch([es_url])
        return es_client

    def get_mongodb_connection(self):
        global mongo_instance
        if not mongo_instance:
            return self.mongodb_conn_instantiate()
        else:
            return mongo_instance

    def get_es_client(self):
        global es_instance
        if not es_instance:
            return self.instantiate_es_client()
        else:
            return es_instance

    def insert_bulk(self, data):
        col = self.get_mongodb_connection()
        col.insert_many(data)
        return len(data)

    # Searches the object into mongo collection
    def search_db(self, query, exclude, offset, res_limit):
        col = self.get_mongodb_connection()
        if offset is None and res_limit is None:
            res = col.find(query, exclude).sort([('_id', 1)])
        else:
            res = col.find(query, exclude).sort([('_id', -1)]).skip(offset).limit(res_limit)
        result = []
        for record in res:
            result.append(record)
        return result

    def delete_bulk(self, query):
        col = self.get_mongodb_connection()
        deleted = col.delete_many(query)
        return deleted.deleted_count

    def update_db(self, find_query, set_clause):
        col = self.get_mongodb_connection()
        updated = col.update(find_query, {"$set": set_clause})
        return updated

    # Method to index errors on to elasticsearch.
    def index_basic_to_es(self, index_obj):
        try:
            es = self.get_es_client()
            index_obj = self.add_timestamp_field(index_obj)
            es.index(index=base_index, id=index_obj["glosssaryId"], body=index_obj)
        except Exception as e:
            log.exception("Indexing FAILED for errorID: " + index_obj["errorID"], e)

    # Method to generate timestamp in the format es expects per index object.
    def add_timestamp_field(self, index_obj):
        epoch_short = eval(str(time.time()).replace('.', '')[0:10])
        index_obj["@timestamp"] = datetime.fromtimestamp(epoch_short).isoformat()
        return index_obj
