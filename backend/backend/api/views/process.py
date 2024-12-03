import pandas as pd
from dateutil.parser import parse
from .score import compute_bowleys_skewness, compute_mad_score, compute_connection_count_score, compute_combined_score

def process_data(df_original):
    df = df_original.copy()
    df_destination = df['destination'].apply(pd.Series)
    df_source = df['source'].apply(pd.Series)
    df_process = df['process'].apply(pd.Series)

    # Rename the columns to avoid name conflicts
    df_destination = df_destination.rename(columns=lambda x: 'destination.' + str(x))
    df_source = df_source.rename(columns=lambda x: 'source.' + str(x))
    df_process = df_process.rename(columns=lambda x: 'process.' + str(x))

    # Concatenate the expanded columns back to the original DataFrame
    df = pd.concat([df.drop(['destination', 'source'], axis=1), df_destination, df_source, df_process], axis=1)

    # Now, filter the DataFrame to include only the target columns
    target_columns = ["destination.ip", "source.ip", "@timestamp", "process.name", "process.executable"]
    df = df[target_columns]

    # Drop rows with missing (NaN) values
    df = df.dropna()
    df = (
        df.groupby(["source.ip", "destination.ip"])
        .agg(
            TotalConnections=pd.NamedAgg(column="@timestamp", aggfunc="count"),
            ConnectionTimes=pd.NamedAgg(column="@timestamp", aggfunc=list),
        )
        .reset_index()
    )

    df["ConnectionTimes"] = df["ConnectionTimes"].apply(
        lambda x: sorted([parse(t.strftime('%Y-%m-%dT%H:%M:%SZ')) for t in x])
    )

    df["Skew score"] = df["ConnectionTimes"].apply(compute_bowleys_skewness)
    df["MAD score"] = df["ConnectionTimes"].apply(compute_mad_score)
    df["Count score"] = df["ConnectionTimes"].apply(compute_connection_count_score)

    df.dropna(inplace=True)
    df["Score"] = df.apply(compute_combined_score, axis=1)

    return df