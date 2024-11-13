import pandas as pd
from elasticsearch import Elasticsearch

def fetch_data_from_elasticsearch():
    try:
        es = Elasticsearch([{'host': '34.67.212.1', 'port': 9200, 'scheme': 'http'}])

        # Elasticsearch query to fetch EventID 3 documents
        query = {
            "query": {
                "match": {
                    "EventID": 3
                }
            },
            "size": 10000,  # Adjust the size according to your data volume
        }

        res = es.search(index="sysmon-events", body=query, scroll='2m')
        scroll_id = res['_scroll_id']
        total_hits = res['hits']['total']['value']

        all_hits = res['hits']['hits']

        # Scroll through the data if more than one batch
        while len(res['hits']['hits']):
            res = es.scroll(scroll_id=scroll_id, scroll='2m')
            all_hits.extend(res['hits']['hits'])
            if len(all_hits) >= total_hits:
                break

        # Extract the _source field from each hit
        data = [hit["_source"] for hit in all_hits]

        # Create a DataFrame
        return pd.DataFrame(data)
    except Exception as e:
        # Handle exceptions (e.g., connection errors)
        print(f"Error fetching data from Elasticsearch: {e}")
        return pd.DataFrame()