import pandas as pd
from dateutil.parser import parse
from .score import compute_bowleys_skewness, compute_mad_score, compute_connection_count_score, compute_combined_score

def process_data(df_original):
    df = df_original[df_original["EventID"] == 3].copy()

    target_columns = ['SystemTime', 'SourceIp', 'DestinationIp']
    df = df[target_columns].dropna()

    if df.empty:
        return pd.DataFrame()

    df = (
        df.groupby(["SourceIp", "DestinationIp"])
        .agg(
            TotalConnections=pd.NamedAgg(column="SystemTime", aggfunc="count"),
            ConnectionTimes=pd.NamedAgg(column="SystemTime", aggfunc=list),
        )
        .reset_index()
    )

    df["ConnectionTimes"] = df["ConnectionTimes"].apply(
        lambda x: sorted([parse(t) for t in x])
    )

    df["Skew score"] = df["ConnectionTimes"].apply(compute_bowleys_skewness)
    df["MAD score"] = df["ConnectionTimes"].apply(compute_mad_score)
    df["Count score"] = df["ConnectionTimes"].apply(compute_connection_count_score)

    df.dropna(inplace=True)
    df["Score"] = df.apply(compute_combined_score, axis=1)

    return df