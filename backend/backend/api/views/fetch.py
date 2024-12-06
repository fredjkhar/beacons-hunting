import pandas as pd
from elasticsearch import Elasticsearch

def fetch_data_from_elasticsearch(start_time, end_time):
    try:
        es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200, 'scheme': 'http'}])

        query = {
            "size": 10000,
            "query": {
                "range": {
                    "@timestamp": {
                        "gte": start_time,
                        "lt": end_time
                    }
                }
            }
        }

        # Execute the query
        result = es.search(index='.ds-winlogbeat-*', body=query)

        # Extract data from the result
        hits = result['hits']['hits']
        df = pd.DataFrame([hit['_source'] for hit in hits])
        print("retreived " + len(df) + " from elastic")

        # Create a DataFrame
        return df
    except Exception as e:
        # Handle exceptions (e.g., connection errors)
        print(f"Error fetching data from Elasticsearch: {e}")
        return pd.DataFrame()

def fetch_data_from_elasticsearch_last_24h():
    try:
        es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200, 'scheme': 'http'}])

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
        print("retreived " + len(df) + " from elastic")
        # Create a DataFrame
        return df
    except Exception as e:
        # Handle exceptions (e.g., connection errors)
        print(f"Error fetching data from Elasticsearch: {e}")
        return pd.DataFrame()