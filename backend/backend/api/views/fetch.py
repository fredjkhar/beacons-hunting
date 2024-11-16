import pandas as pd
from elasticsearch import Elasticsearch

def fetch_data_from_elasticsearch():
    try:
        es = Elasticsearch([{'host': 'localhost', 'port': 9200, 'scheme': 'http'}])

        query = {
            "size": 10000,
            "query": {
                "range": {
                "@timestamp": {
                    "gte": "now-24h/h",
                    "lt": "now/h"
                }
                }
            }
        }

        # Execute the query
        result = es.search(index='.ds-winlogbeat-*', body=query)

        # Extract data from the result
        hits = result['hits']['hits']
        df = pd.DataFrame([hit['_source'] for hit in hits])

        # Create a DataFrame
        return df
    except Exception as e:
        # Handle exceptions (e.g., connection errors)
        print(f"Error fetching data from Elasticsearch: {e}")
        return pd.DataFrame()