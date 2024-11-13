from django.http import JsonResponse
from .fetch import fetch_data_from_elasticsearch

from .process import process_data

import os
from .fetch_csv import fetch_data_from_csv

def my_view(request):
    # Currently using a local csv file for testing until the issue with the VM gets resolved
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_file_path = os.path.join(BASE_DIR, 'data', 'data.csv')
    df_original = fetch_data_from_csv(csv_file_path)

    #df_original = fetch_data_from_elasticsearch()

    if df_original.empty:
        return JsonResponse({'error': 'No data fetched from Elasticsearch.'}, status=500)

    df = process_data(df_original)

    if df.empty:
        return JsonResponse({'error': 'No relevant data after processing.'}, status=404)

    result = df.head(10).to_dict(orient='records')
    return JsonResponse(result, safe=False)