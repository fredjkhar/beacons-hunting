from django.http import JsonResponse
from .fetch import fetch_data_from_elasticsearch, fetch_data_from_elasticsearch_last_24h
from datetime import datetime
from .process import process_data

import os
from .fetch_csv import fetch_data_from_csv

def my_view(request):
    # Currently using a local csv file for testing until the issue with the VM gets resolved
    #BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    #csv_file_path = os.path.join(BASE_DIR, 'data', 'data.csv')
    #df_original = fetch_data_from_csv(csv_file_path)
    
    start_time = request.GET.get('start_time')
    end_time = request.GET.get('end_time')

    if(not start_time or not end_time):
        print("here")
        df_original = fetch_data_from_elasticsearch_last_24h()
    else:
        try:
            # Validate datetime format
            datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S")
            datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S")
        except ValueError as e:
            return JsonResponse({'error': f'Invalid datetime format: {e}'}, status=400)

        df_original = fetch_data_from_elasticsearch(start_time, end_time)
        
    print(df_original)
    print(len(df_original))

    if df_original.empty:
        return JsonResponse({'error': 'No data fetched from Elasticsearch.'}, status=500)

    df = process_data(df_original)

    if df.empty:
        return JsonResponse({'error': 'No relevant data after processing.'}, status=404)

    result = df.head(10).to_dict(orient='records')
    return JsonResponse(result, safe=False)