// ResultTable.js

export async function fetchBackendData(endpoint = "/api/get/") {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
      return []; // Return an empty array on error
    }
  }
  
  export function getSortedTableData(data, sortKey, sortAsc) {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
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