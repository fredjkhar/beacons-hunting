export async function fetchCSVData(location) {
    try {
        const response = await fetch(location); // Ensure the path is correct
        if (!response.ok) {
            throw new Error('Failed to load the CSV file');
        }
        const csv = await response.text();
        return csv; // Return the CSV content as a string
    } catch (error) {
        console.error(error.message);
        return ''; // Return an empty string on error
    }
}

export function parseCSV(csv) {
    if (!csv) return []; // Handle case where csv is empty or undefined
    const rows = csv.split('\n').map((row) => row.trim());
    return rows.map((row) => row.split(',').map((cell) => cell.trim()));
}

export function getSortedTableData(tableData, sortColumn, sortAsc) {
    if (sortColumn === null) {
        return tableData.slice(1); // Return all rows except the headers if no sort is applied
    }
    return tableData.slice(1).sort((a, b) => {
        let cellA = a[sortColumn];
        let cellB = b[sortColumn];

        // Try to parse numbers first; if NaN, compare as strings
        const numberA = parseFloat(cellA);
        const numberB = parseFloat(cellB);

        if (!isNaN(numberA) && !isNaN(numberB)) {
            cellA = numberA;
            cellB = numberB;
        }

        if (cellA < cellB) return sortAsc ? -1 : 1;
        if (cellA > cellB) return sortAsc ? 1 : -1;
        return 0;
    });
}

export function sortTable(index, currentSortColumn, currentSortAsc) {
    let sortColumn = index;
    let sortAsc = currentSortAsc;

    if (currentSortColumn === index) {
        // If the same column is clicked, toggle the sort direction
        sortAsc = !currentSortAsc;
    } else {
        // If a new column is clicked, sort it in ascending order by default
        sortColumn = index;
        sortAsc = true;
    }

    return { sortColumn, sortAsc };
}