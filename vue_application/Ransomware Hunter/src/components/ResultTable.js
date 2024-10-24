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