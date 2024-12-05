// ResultTable.js

export async function fetchBackendData(endpoint = "/api/get/") {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend");
      }
      const resultData = await response.json();
      return resultData;
    } catch (error) {
      console.error(error.message);
      return []; // Return an empty array on error
    }
  }

  export async function fetchBackendDataWithDates(endpoint = "/api/get/", startTime = null, endTime = null) {
    try {
      // Construct query parameters
      // console.log(startTime)
      // console.log(endTime)
      const queryParams = new URLSearchParams();
      if (startTime) queryParams.append("start_time", startTime);
      if (endTime) queryParams.append("end_time", endTime);
  
      // Append query parameters to the endpoint
      const url = queryParams.toString() ? `${endpoint}?start_time=${startTime}:00&end_time=${endTime}:00` : endpoint;
      
      console.log('?start_time=' + startTime + '&end_time=' + endTime)

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend");
      }
      const resultData = await response.json();
      return resultData;
    } catch (error) {
      console.error(error.message);
      return []; // Return an empty array on error
    }
  }
  
  export function getSortedTableData(resultData, sortKey, sortAsc) {
    if (!sortKey) return resultData;
    return [...resultData].sort((a, b) => {
      let valueA = a[sortKey];
      let valueB = b[sortKey];
  
      const numberA = parseFloat(valueA);
      const numberB = parseFloat(valueB);
  
      if (!isNaN(numberA) && !isNaN(numberB)) {
        valueA = numberA;
        valueB = numberB;
      }
  
      if (valueA < valueB) return sortAsc ? -1 : 1;
      if (valueA > valueB) return sortAsc ? 1 : -1;
      return 0;
    });
  }
  
  export function toggleSort(key, currentSortKey, currentSortAsc) {
    let sortKey = key;
    let sortAsc = currentSortAsc;
  
    if (currentSortKey === key) {
      sortAsc = !currentSortAsc; // Toggle sort direction
    } else {
      sortKey = key;
      sortAsc = true; // Default to ascending
    }
  
    return { sortKey, sortAsc };
  }