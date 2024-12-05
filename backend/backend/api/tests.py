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
    
    # Ensure the processed result contains data and has a 'Score' column
        self.assertEqual(len(result), 1)  
        self.assertTrue("Score" in result.columns) 

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
        self.assertEqual(len(result), 1)  
        self.assertTrue("Score" in result.columns) 
    
    def test_compute_bowleys_skewness_empty_diffs(self):
        # Edge case where diffs array is too short
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
        ]
        skewness = compute_bowleys_skewness(connection_times)
        self.assertEqual(skewness, 0) 
    
    def test_compute_mad_score_empty_diffs(self):
        # Edge case where diffs array is too short
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
        ]
        mad_score = compute_mad_score(connection_times)
        self.assertEqual(mad_score, 0.0) 
    
    def test_compute_connection_count_score_few_connections(self):
        # Fewer than 6 connections
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 10),
        ]
        count_score = compute_connection_count_score(connection_times)
        self.assertEqual(count_score, 0.0)

    def test_process_data_missing_data(self):
        # Adding missing data in the timestamp column
        data = {
            "destination": [{"ip": "192.168.1.1"}] * 9,
            "source": [{"ip": "192.168.1.2"}] * 9,
            "process": [{"name": "test_process", "executable": "test_executable"}] * 9,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 10),
                None,  # Missing timestamp
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
        
        self.assertEqual(len(result), 1)  
        self.assertTrue("Score" in result.columns) 

    def test_process_data_same_connection_times(self):
        # Edge case with no variation
        data = {
            "destination": [{"ip": "192.168.1.1"}] * 9,
            "source": [{"ip": "192.168.1.2"}] * 9,
            "process": [{"name": "test_process", "executable": "test_executable"}] * 9,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 0),
            ],
        }
        df = pd.DataFrame(data)
        result = process_data(df)
        
        self.assertEqual(len(result), 1)
        self.assertTrue("Score" in result.columns) 

    def test_compute_combined_score_extreme_values(self):
        # Extreme values for the individual scores
        row = {
            "Skew score": 1.0,
            "MAD score": 0.0,
            "Count score": 1.0,
        }
        combined_score = compute_combined_score(row)
        self.assertEqual(combined_score, 0.6667)  # (1 + 0 + 1) / 3 = 0.6667

    def test_compute_bowleys_skewness_identical_times(self):
        # Identical connection times
        connection_times = [
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 0),
            datetime(2024, 12, 1, 12, 0),
        ]
        skewness = compute_bowleys_skewness(connection_times)
        self.assertEqual(skewness, 0)

    def test_process_data_missing_destination_ip(self):
        # Rows where destination.ip is missing
        data = {
            "destination": [{"ip": None}, {"ip": "192.168.1.1"}],
            "source": [{"ip": "192.168.1.2"}, {"ip": "192.168.1.2"}],
            "process": [{"name": "test_process", "executable": "test_executable"}] * 2,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 10),
            ],
        }
        df = pd.DataFrame(data)
        result = process_data(df)
        self.assertEqual(len(result), 1)
        self.assertTrue("Score" in result.columns)

    def test_process_data_multiple_source_ips(self):
        # Multiple source IPs and groups data
        data = {
            "destination": [{"ip": "192.168.1.1"}] * 5,
            "source": [{"ip": "192.168.1.2"}] * 3 + [{"ip": "192.168.1.3"}] * 2,
            "process": [{"name": "test_process", "executable": "test_executable"}] * 5,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 10),
                datetime(2024, 12, 1, 12, 20),
                datetime(2024, 12, 1, 12, 30),
                datetime(2024, 12, 1, 12, 40),
            ],
        }
        df = pd.DataFrame(data)
        result = process_data(df)
        self.assertGreater(len(result), 1) 

    def test_process_data_missing_ips(self):
        # IPs are missing or invalid
        data = {
            "destination": [{"ip": "192.168.1.1"}, {"ip": None}],
            "source": [{"ip": "192.168.1.2"}, {"ip": "192.168.1.3"}],
            "process": [{"name": "test_process", "executable": "test_executable"}] * 2,
            "@timestamp": [
                datetime(2024, 12, 1, 12, 0),
                datetime(2024, 12, 1, 12, 10),
            ],
        }
        df = pd.DataFrame(data)
        result = process_data(df)
        self.assertEqual(len(result), 1)

if __name__ == "__main__":
    unittest.main()
