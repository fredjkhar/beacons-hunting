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
    
    # Define the target columns to retain, including 'process.name' and 'process.executable'
    target_columns = ["destination.ip", "source.ip", "@timestamp", "process.name", "process.executable"]
    
    # Ensure all target columns exist in the DataFrame to prevent KeyError
    existing_target_columns = [col for col in target_columns if col in df.columns]
    df = df[existing_target_columns]
    
    # Optional: Print columns after selecting target columns for debugging
    print("Selected Columns:", df.columns.tolist())
    
    # Group by 'source.ip' and 'destination.ip' and aggregate necessary data
    # Additionally, aggregate 'process.name' and 'process.executable' into lists of unique values
    group_by_columns = ["source.ip", "destination.ip"]
    df = (
        df.groupby(group_by_columns)
        .agg(
            TotalConnections=pd.NamedAgg(column="@timestamp", aggfunc="count"),
            ConnectionTimes=pd.NamedAgg(column="@timestamp", aggfunc=list),
            ProcessNames=pd.NamedAgg(column="process.name", aggfunc=lambda x: list(set(x))),
            ProcessExecutables=pd.NamedAgg(column="process.executable", aggfunc=lambda x: list(set(x))),
        )
        .reset_index()
    )
    
    # Optional: Print DataFrame after grouping for debugging
    print("DataFrame after Grouping:\n", df.head())
    
    # Parse timestamp strings to datetime objects and sort
    df["ConnectionTimes"] = df["ConnectionTimes"].apply(
        lambda x: sorted([parse(t) for t in x])
    )
    
    # Compute various scores based on ConnectionTimes
    df["Skew score"] = df["ConnectionTimes"].apply(compute_bowleys_skewness)
    df["MAD score"] = df["ConnectionTimes"].apply(compute_mad_score)
    df["Count score"] = df["ConnectionTimes"].apply(compute_connection_count_score)
    
    # Drop any remaining rows with NaN values after scoring
    df.dropna(inplace=True)
    
    print(f"Processed {len(df)} records with valid scores.")
    
    # Compute the combined score
    df["Score"] = df.apply(compute_combined_score, axis=1)
    
    return df