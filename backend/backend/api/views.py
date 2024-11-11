import pandas as pd
import numpy as np
from dateutil.parser import parse
from elasticsearch import Elasticsearch
from django.http import JsonResponse

def fetch_data_from_elasticsearch():
    try:
        es = Elasticsearch([{'host': '35.203.32.116', 'port': 9200, 'scheme': 'http'}])

        # Elasticsearch query to fetch EventID 3 documents
        query = {
            "query": {
                "match": {
                    "EventID": 3
                }
            },
            "size": 10000 , # Adjust the size according to your data volume
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
        df_original = pd.DataFrame(data)

        return df_original
    except Exception as e:
        # Handle exceptions (e.g., connection errors)
        print(f"Error fetching data from Elasticsearch: {e}")
        return pd.DataFrame()



def compute_bowleys_skewness(connection_times):
    # Convert connection times to numpy array
    connection_times = np.array(connection_times)

    # Sort the connection times and compute intervals (differences)
    connection_times.sort()
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)

    # Data cleansing: Filter out intervals less than 1 second and check if enough data remains
    diffs = diffs[diffs > 1]
    if len(diffs) < 6:
        return None  # Not enough data to compute a score

    # Calculate the quartiles
    Q1, Q2, Q3 = np.percentile(diffs, [25, 50, 75])

    # Compute Bowley's skewness
    bowleys_numerator = Q1 + Q3 - 2 * Q2
    bowleys_denominator = Q3 - Q1
    if bowleys_denominator == 0 or Q2 == Q1 or Q2 == Q3:
        return 0  # Handle division by zero and identical quartile cases

    bowleys_skewness = bowleys_numerator / bowleys_denominator

    # Skew score is the complement of the absolute value of Bowley's skewness to 1
    skew_score = 1.0 - abs(bowleys_skewness)
    return skew_score

def compute_mad_score(connection_times):
    # Convert connection times to numpy array
    connection_times = np.array(connection_times)

    # Sort the connection times and compute intervals (differences)
    connection_times.sort()
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)

    # Data cleansing: Filter out intervals less than 1 second and check if enough data remains
    diffs = diffs[diffs > 1]
    if len(diffs) < 6:
        return None  # Not enough data to compute a score

    # Calculate the median of the differences
    tsMid = np.percentile(diffs, 50)

    # Calculate the Median Absolute Deviation (MAD) about the median
    tsMadm = np.median(np.abs(diffs - tsMid))

    # Normalize the MAD score
    tsMadmScore = 1.0 - float(tsMadm) / 30.0

    # Ensure the MAD score is non-negative
    tsMadmScore = max(tsMadmScore, 0)

    return tsMadmScore


def compute_connection_count_score(connection_times):
    if len(connection_times) < 6:
        return None  # Not enough data to compute a meaningful score

    connection_times.sort()
    # Calculate the total time span of observed connections in seconds
    time_span_seconds = (connection_times[-1] - connection_times[0]).total_seconds()
    # Calculate the median interval in seconds between connections
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)
    tsMid = np.percentile(diffs, 50)

    # Avoid division by zero in case tsMid is 0
    if tsMid == 0:
        return 0

    # Calculate the expected number of connections based on the median interval and the actual time span
    tsTimespanDiv = float(time_span_seconds) / tsMid
    # Calculate the connection count score based on the actual and expected number of connections
    tsConnCountScore = float(len(connection_times)) / tsTimespanDiv

    # Cap the score at 1.0
    tsConnCountScore = min(tsConnCountScore, 1.0)

    return tsConnCountScore

def compute_combined_score(row):
    return round(((row["Skew score"] + row["MAD score"] + row["Count score"]) / 3), 4)

def compute_combined_score(row):
    return round(((row["Skew score"] + row["MAD score"] + row["Count score"]) / 3), 4)


def my_view(request):
    # Fetch data from Elasticsearch
    df_original = fetch_data_from_elasticsearch()

    if df_original.empty:
        return JsonResponse({'error': 'No data fetched from Elasticsearch.'}, status=500)

    # Proceed with data processing as per your code
    df = df_original.copy()

    # Filter EventID 3
    df = df[df["EventID"] == 3]

    # Select relevant columns
    target_columns = ['SystemTime', 'SourceIp', 'DestinationIp']
    df = df[target_columns].dropna()

    # Ensure the necessary columns are present
    if df.empty:
        return JsonResponse({'error': 'No relevant data after filtering.'}, status=404)

    # Group by SourceIp and DestinationIp
    df = (
        df.groupby(["SourceIp", "DestinationIp"])
        .agg(
            TotalConnections=pd.NamedAgg(column="SystemTime", aggfunc="count"),
            ConnectionTimes=pd.NamedAgg(column="SystemTime", aggfunc=list),
        )
        .reset_index()
    )

    # Convert timestamps
    df["ConnectionTimes"] = df["ConnectionTimes"].apply(
        lambda x: sorted([parse(t) for t in x])
    )

    # Compute scores
    df["Skew score"] = df["ConnectionTimes"].apply(compute_bowleys_skewness)
    df["MAD score"] = df["ConnectionTimes"].apply(compute_mad_score)
    df["Count score"] = df["ConnectionTimes"].apply(compute_connection_count_score)

    # Drop rows with missing values
    df.dropna(inplace=True)

    # Compute combined score
    df["Score"] = df.apply(compute_combined_score, axis=1)

    # Sort the dataframe by the score in descending order
    df.sort_values("Score", ascending=False, inplace=True)

    # Merge with original data to get additional details
    df_with_details = df.merge(
        df_original[
            ["SourceIp", "DestinationIp", "Image", "Computer", "CommandLine", "ProcessId"]
        ],
        on=["SourceIp", "DestinationIp"],
        how="left",
    )

    # Remove duplicates and aggregate
    df = (
        df_with_details.groupby(["SourceIp", "DestinationIp"])
        .agg(
            {
                "TotalConnections": "first",
                "Score": "first",
                "Skew score": "first",
                "MAD score": "first",
                "Count score": "first",
                "Image": lambda x: " | ".join(set(x.dropna().astype(str))),
                "Computer": "first",
                "CommandLine": lambda x: " | ".join(set(x.dropna().astype(str))),
                "ProcessId": lambda x: " | ".join(map(str, set(x.dropna()))),
            }
        )
        .reset_index()
    )

    df.sort_values("Score", ascending=False, inplace=True)

    # Convert DataFrame to JSON
    result = df.head(10).to_dict(orient='records')  # Return top 10 results

    return JsonResponse(result, safe=False)