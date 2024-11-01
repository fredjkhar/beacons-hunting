from django.http import JsonResponse

def my_notebook_function():
    # Your function code here
    result = {'message': 'Hello from the notebook function'}
    return result

def my_view(request):
    data = my_notebook_function()
    return JsonResponse(data)