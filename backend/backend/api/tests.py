import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from django.test import TestCase
import unittest
import pandas as pd
from unittest.mock import patch
from views.process import process_data
from views.score import compute_bowleys_skewness, compute_mad_score, compute_connection_count_score, compute_combined_score

class TestProcessData(unittest.TestCase):
    def setUp(self):
        """
        Prepare a basic test dataset.
        """
        self.sample_data = pd.DataFrame({
            'source': [{'ip': '192.168.1.1'}, {'ip': '192.168.1.1'}, {'ip': '192.168.1.1'}],
            'destination': [{'ip': '10.0.0.1'}, {'ip': '10.0.0.1'}, {'ip': '10.0.0.1'}],
            'process': [{'name': 'proc1', 'executable': '/bin/proc1'}] * 3,
            '@timestamp': ['2024-11-20T12:00:00Z', '2024-11-20T12:01:00Z', '2024-11-20T12:02:00Z']
        })
        self.sample_data['@timestamp'] = pd.to_datetime(self.sample_data['@timestamp'])

    def test_missing_data_handling(self):
        """
        Test that rows with missing data are dropped.
        """
        # Modify sample data to include missing values
        data_with_missing = self.sample_data.copy()
        data_with_missing.loc[0, 'source'] = None

        result = process_data(data_with_missing)
        self.assertEqual(len(result), 0)  # Expect all rows to be dropped

    def test_basic_processing(self):
        result = process_data(self.sample_data)
        print("Basic Processing Result:")
        print(result)  # Debugging output to see what the result is
        
        self.assertEqual(len(result), 1)  # Expecting one row
        self.assertEqual(result["source.ip"].iloc[0], "192.168.1.1")
        self.assertEqual(result["destination.ip"].iloc[0], "10.0.0.1")
        self.assertEqual(result["TotalConnections"].iloc[0], 3)  # Expecting 3 connections
        
if __name__ == '__main__':
    unittest.main()
