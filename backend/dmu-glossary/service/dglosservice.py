import logging
import time
import uuid
from flask_restful import reqparse

from utils.dglosutils import DGlosUtils
from repository.dglosrepo import DGlosRepo
from config.dglosconfigs import phrase_length_in_words

dds_utils = DGlosUtils()
dglos_repo = DGlosRepo()

parser = reqparse.RequestParser(bundle_errors=True)
log = logging.getLogger('file')


class DGlosService:
    def __init__(self):
        pass

    def upload(self, data):
        # validate
        req_id = data["metadata"]["requestId"]
        log.info(f"{req_id} | Uploading Glossary...")
        glossary = []
        for glossary_entry in data["glossary"]:
            glossary_entry["createdTime"], = eval(str(time.time()).replace('.', '')[0:13])
            glossary_entry["glossaryId"] = str(uuid.uuid4())
            glossary.append(glossary_entry)
        log.info(f"{req_id} | Pushing to the backup store...")
        dglos_repo.insert_bulk(glossary)
        log.info(f"{req_id} | Pushing to ES...")
        for glos in glossary:
            dglos_repo.index_basic_to_es(glos)
        log.info(f"{req_id} | Upload Complete!")
        return {"status": "Success", "message": "Glossary Uploaded!"}

    def search_glossary(self, data):
        req_id, result = data["metadata"]["requestId"], []
        for sentence in data['sentences']:
            log.info(f"{req_id} | Searching Glossary for phrases in: {sentence}")
            glossary_phrases = self.glossary_phrase_search(sentence)
            if glossary_phrases:
                log.info(f"{req_id} | sentence: {sentence} | search_details: {glossary_phrases[1]}")
            result.append({"sentence": sentence, "glossaryPhrases": glossary_phrases})
        return result

    # Searches for all glossary phrases of a fixed length within a given sentence
    # Uses a custom implementation of the sliding window search algorithm.
    def glossary_phrase_search(self, sentence):
        glossary_phrases = []
        hopping_pivot, sliding_pivot, i = 0, len(sentence), 1
        computed, glos_count = 0, 0
        try:
            while hopping_pivot < len(sentence):
                phrase = sentence[hopping_pivot:sliding_pivot]
                phrase_size = phrase.split(" ")
                if len(phrase_size) <= phrase_length_in_words:
                    suffix_phrase_list, found = [phrase], False
                    if phrase.endswith(".") or phrase.endswith(","):
                        short = phrase.rstrip('.,')
                        suffix_phrase_list.append(short)
                    for phrase in suffix_phrase_list:
                        result = self.search_from_store({"phrase": phrase})
                        computed += 1
                        if result:
                            glossary_phrases.extend(result)
                            phrase_list = phrase.split(" ")
                            hopping_pivot += (1 + len(' '.join(phrase_list)))
                            sliding_pivot = len(sentence)
                            i = 1
                            glos_count += 1
                            found = True
                            break
                    if found:
                        continue
                sent_list = sentence.split(" ")
                phrase_list = phrase.split(" ")
                reduced_phrase = ' '.join(sent_list[0: len(sent_list) - i])
                sliding_pivot = len(reduced_phrase)
                i += 1
                if hopping_pivot == sliding_pivot or (hopping_pivot - 1) == sliding_pivot:
                    hopping_pivot += (1 + len(' '.join(phrase_list)))
                    sliding_pivot = len(sentence)
                    i = 1
        except Exception as e:
            log.exception(f"Exception while computing phrases: {e}", e)
        res_dict = {"computed": computed, "found": glos_count}
        return glossary_phrases, res_dict

    def search_from_store(self, data):
        query = {"submitterId": data["metadata"]["userId"]}
        if 'sentence' in data.keys():
            query["sentence"] = data["sentence"]
        result = dglos_repo.search_db(query, {"_id": False}, None, None)
        return result
