from django.test import TestCase
import unittest
import pandas as pd
from unittest.mock import patch
from views.process import process_data

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

    def test_basic_processing(self):
        """
        Test that the function processes valid input correctly.
        """
        with patch('yourmodule.score.compute_bowleys_skewness', return_value=0.5), \
             patch('yourmodule.score.compute_mad_score', return_value=1.2), \
             patch('yourmodule.score.compute_connection_count_score', return_value=10), \
             patch('yourmodule.score.compute_combined_score', return_value=50):
            
            result = process_data(self.sample_data)

        # Assert output structure and content
        self.assertEqual(len(result), 1)
        self.assertListEqual(result.columns.tolist(), [
            'source.ip', 'destination.ip', 'TotalConnections', 'ConnectionTimes', 'Skew score', 'MAD score', 'Count score', 'Score'
        ])
        self.assertEqual(result.iloc[0]['TotalConnections'], 3)
        self.assertEqual(result.iloc[0]['Score'], 50)

    def test_missing_data_handling(self):
        """
        Test that rows with missing data are dropped.
        """
        # Modify sample data to include missing values
        data_with_missing = self.sample_data.copy()
        data_with_missing.loc[0, 'source'] = None

        result = process_data(data_with_missing)
        self.assertEqual(len(result), 0)  # Expect all rows to be dropped

    def test_empty_dataframe(self):
        """
        Test processing of an empty DataFrame.
        """
        empty_data = pd.DataFrame()
        result = process_data(empty_data)
        self.assertTrue(result.empty)

    def test_column_filtering(self):
        """
        Test that only target columns are retained.
        """
        result = process_data(self.sample_data)
        expected_columns = ['source.ip', 'destination.ip', 'TotalConnections', 'ConnectionTimes', 'Skew score', 'MAD score', 'Count score', 'Score']
        self.assertListEqual(result.columns.tolist(), expected_columns)

if __name__ == '__main__':
    unittest.main()
