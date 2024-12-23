import numpy as np

def compute_bowleys_skewness(connection_times):
    connection_times = np.array(connection_times)
    connection_times.sort()
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)
    diffs = diffs[diffs > 1]

    if len(diffs) < 6:
        return 0

    Q1, Q2, Q3 = np.percentile(diffs, [25, 50, 75])
    bowleys_numerator = Q1 + Q3 - 2 * Q2
    bowleys_denominator = Q3 - Q1

    if bowleys_denominator == 0 or Q2 == Q1 or Q2 == Q3:
        return 0

    bowleys_skewness = bowleys_numerator / bowleys_denominator
    return round(1.0 - abs(bowleys_skewness), 4)

def compute_mad_score(connection_times):
    connection_times = np.array(connection_times)
    connection_times.sort()
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)
    diffs = diffs[diffs > 1]

    if len(diffs) < 6:
        return 0

    tsMid = np.percentile(diffs, 50)
    tsMadm = np.median(np.abs(diffs - tsMid))
    tsMadmScore = 1.0 - float(tsMadm) / 30.0
    return round(max(tsMadmScore, 0),4)

def compute_connection_count_score(connection_times):
    if len(connection_times) < 6:
        return 0

    connection_times.sort()
    time_span_seconds = (connection_times[-1] - connection_times[0]).total_seconds()
    diffs = np.diff(connection_times).astype("timedelta64[s]").astype(int)
    tsMid = np.percentile(diffs, 50)

    if tsMid == 0:
        return 0

    tsTimespanDiv = float(time_span_seconds) / tsMid
    tsConnCountScore = float(len(connection_times)) / tsTimespanDiv
    return round(min(tsConnCountScore, 1.0),4)

def compute_combined_score(row):
    return round(((row["Skew score"] + row["MAD score"] + row["Count score"]) / 3), 4)