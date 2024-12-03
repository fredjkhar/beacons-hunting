import unittest
import pandas as pd
from datetime import datetime, timedelta
from dateutil.parser import parse
from views.process import process_data
from views.score import (
    compute_bowleys_skewness,
    compute_mad_score,
    compute_connection_count_score,
    compute_combined_score,
)

class TestScores(unittest.TestCase):

    def test_compute_bowleys_skewness(self):
        # Sample data with connection times that have differences greater than 1 second
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
            datetime(2024, 12, 1, 12, 20),
            datetime(2024, 12, 1, 12, 30),
            datetime(2024, 12, 1, 12, 40),
            datetime(2024, 12, 1, 12, 50),
            datetime(2024, 12, 1, 13, 0),
            datetime(2024, 12, 1, 13, 10),
            datetime(2024, 12, 1, 13, 20),
        ]
        skewness = compute_bowleys_skewness(connection_times)
        self.assertIsNotNone(skewness)
        self.assertIsInstance(skewness, int)

    def test_compute_mad_score(self):
        # Sample data for MAD score calculation
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
            datetime(2024, 12, 1, 12, 20),
            datetime(2024, 12, 1, 12, 30),
            datetime(2024, 12, 1, 12, 40),
            datetime(2024, 12, 1, 12, 50),
            datetime(2024, 12, 1, 13, 0),
            datetime(2024, 12, 1, 13, 10),
            datetime(2024, 12, 1, 13, 20),
        ]
        mad_score = compute_mad_score(connection_times)
        self.assertIsNotNone(mad_score)
        self.assertIsInstance(mad_score, float)

    def test_compute_connection_count_score(self):
        # Sample connection times
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
            datetime(2024, 12, 1, 12, 20),
            datetime(2024, 12, 1, 12, 30),
            datetime(2024, 12, 1, 12, 40),
            datetime(2024, 12, 1, 12, 50),
            datetime(2024, 12, 1, 13, 0),
            datetime(2024, 12, 1, 13, 10),
            datetime(2024, 12, 1, 13, 20),
        ]
        count_score = compute_connection_count_score(connection_times)
        self.assertIsNotNone(count_score)
        self.assertIsInstance(count_score, float)

    def test_compute_combined_score(self):
        # Test combined score with dummy data
        row = {
            "Skew score": 0.8,
            "MAD score": 0.9,
            "Count score": 0.7,
        }
        combined_score = compute_combined_score(row)
        self.assertEqual(combined_score, 0.8)

    def test_process_data(self):
    # Add multiple connection times for a single source IP to simulate real data
        data = {
        "destination": [{"ip": "192.168.1.1"}, {"ip": "192.168.1.1"}],
        "source": [{"ip": "192.168.1.2"}, {"ip": "192.168.1.2"}],
        "process": [{"name": "test_process", "executable": "test_executable"}, {"name": "test_process", "executable": "test_executable"}],
        "@timestamp": [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),  # 10-minute gap
        ],
    }
        df = pd.DataFrame(data)
        result = process_data(df)

    # Debugging output to check the result
        print(f"Result DataFrame:\n{result}")
    
    # Ensure the processed result contains data and has a 'Score' column
        self.assertEqual(len(result), 1)  # The group-by should result in one row
        self.assertTrue("Score" in result.columns)  # Ensure the score column exists

    def test_process_data_with_more_diffs(self):
        # Add multiple connection times to create more differences
        data = {
            "destination": [{"ip": "192.168.1.1"}] * 9,
            "source": [{"ip": "192.168.1.2"}] * 9,
            "process": [{"name": "test_process", "executable": "test_executable"}] * 9,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 10),
                datetime(2024, 12, 1, 12, 20),
                datetime(2024, 12, 1, 12, 30),
                datetime(2024, 12, 1, 12, 40),
                datetime(2024, 12, 1, 12, 50),
                datetime(2024, 12, 1, 13, 0),
                datetime(2024, 12, 1, 13, 10),
                datetime(2024, 12, 1, 13, 20),
            ],
        }
        df = pd.DataFrame(data)
        result = process_data(df)

        # Ensure the processed result contains data and has a 'Score' column
        self.assertEqual(len(result), 1)  # The group-by should result in one row
        self.assertTrue("Score" in result.columns)  # Ensure the score column exists

if __name__ == "__main__":
    unittest.main()
