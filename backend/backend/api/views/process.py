import pandas as pd
from dateutil.parser import parse
from .score import (
    compute_bowleys_skewness,
    compute_mad_score,
    compute_connection_count_score,
    compute_combined_score
)

def process_data(df_original):
    df = df_original.copy()
    
    # Expand nested JSON fields into separate columns
    df_destination = df['destination'].apply(pd.Series)
    df_source = df['source'].apply(pd.Series)
    df_process = df['process'].apply(pd.Series)

    # Rename the columns to avoid name conflicts
    df_destination = df_destination.rename(columns=lambda x: f'destination.{x}')
    df_source = df_source.rename(columns=lambda x: f'source.{x}')
    df_process = df_process.rename(columns=lambda x: f'process.{x}')

    # Concatenate the expanded columns back to the original DataFrame
    df = pd.concat(
        [df.drop(['destination', 'source', 'process'], axis=1), df_destination, df_source, df_process],
        axis=1
    )

    # Define the target columns to retain
    target_columns = ["destination.ip", "source.ip", "@timestamp", "process.name", "process.executable"]
    df = df[target_columns]

    # Drop rows with missing (NaN) values
    df = df.dropna()

    # Group by source and destination IPs and aggregate connection data
    df = (
        df.groupby(["source.ip", "destination.ip"])
        .agg(
            TotalConnections=pd.NamedAgg(column="@timestamp", aggfunc="count"),
            ConnectionTimes=pd.NamedAgg(column="@timestamp", aggfunc=list),
        )
        .reset_index()
    )

    # **Corrected Lambda Function: Parse Strings to datetime Objects**
    df["ConnectionTimes"] = df["ConnectionTimes"].apply(
        lambda x: sorted([parse(t) for t in x])
    )

    # Compute various scores based on ConnectionTimes
    df["Skew score"] = df["ConnectionTimes"].apply(compute_bowleys_skewness)
    df["MAD score"] = df["ConnectionTimes"].apply(compute_mad_score)
    df["Count score"] = df["ConnectionTimes"].apply(compute_connection_count_score)

    # Drop any remaining rows with NaN values after scoring
    df.dropna(inplace=True)

    # Compute the combined score
    df["Score"] = df.apply(compute_combined_score, axis=1)

    return df