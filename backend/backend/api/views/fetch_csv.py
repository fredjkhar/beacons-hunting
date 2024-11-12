import pandas as pd

def fetch_data_from_csv(file_path):
    """
    Reads data from a local CSV file and returns a pandas DataFrame.
    :param file_path: Path to the local CSV file.
    :return: A pandas DataFrame containing the data.
    """
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)

        # Perform any required preprocessing (if needed)
        return df
    except Exception as e:
        # Handle exceptions (e.g., file not found, invalid format)
        print(f"Error reading data from CSV: {e}")
        return pd.DataFrame()