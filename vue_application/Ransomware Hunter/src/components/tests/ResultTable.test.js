import { fetchCSVData, parseCSV } from '../ResultTable';
import ResultTable from '../ResultTable.vue';
import { describe, test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

test("mount component", async () => {
    expect(ResultTable).toBeTruthy();
});

describe('fetchCSVData', () => {
        // Mock the global fetch API
        beforeEach(() => {
            // Reset the fetch mock before each test
            global.fetch = vi.fn();
        });

    test('handles fetch error', async () => {
        const result = await fetchCSVData(null);
        expect(result).toBe(''); // Should return an empty string on error
    });

    test('known csv', async () => {
        const result = await fetchCSVData('./sheets/final_results.csv');
        expect(result).not.toBeNull(); // Check the CSV content is correctly fetched
    });

    // gpt generated figure out what it does
    test('should return CSV content when fetch is successful', async () => {
        const mockCSV = 'name,age\nJohn,30\nDoe,25'; // Sample CSV content

        // Mock a successful response
        fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => mockCSV,
        });

        const result = await fetchCSVData('/path/to/csv'); // Simulate passing a path
        expect(fetch).toHaveBeenCalledWith('/path/to/csv'); // Ensure the fetch was called with the correct path
        expect(result).toBe(mockCSV); // Ensure the returned CSV content is correct
    });

    // gpt generated figure out what it does
    test('should throw an error and return an empty string when fetch fails (response not ok)', async () => {
        // Mock a failed response
        fetch.mockResolvedValueOnce({
            ok: false, // Simulate fetch failure (response.ok === false)
        });

        const result = await fetchCSVData('/path/to/csv');
        expect(fetch).toHaveBeenCalledWith('/path/to/csv');
        expect(result).toBe(''); // Ensure it returns an empty string on error
    });

    // gpt generated figure out what it does
    test('should catch fetch error and return an empty string', async () => {
        // Mock a network or fetch error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await fetchCSVData('/path/to/csv');
        expect(fetch).toHaveBeenCalledWith('/path/to/csv');
        expect(result).toBe(''); // Ensure it returns an empty string on fetch error
    });
});

describe('parseCSV', () => {
    test('handles fetch error', () => {
        const result = parseCSV();
        expect(result).toEqual([]);
    });


    test('handles empty csv string', () => {
        const result = parseCSV(''); // Empty CSV input
        expect(result).toEqual([]); // Should return an empty array when CSV string is empty
    });

    test('parses known csv', () => {
        const csvString = 'name,age\nJohn,30\nDoe,25'; // Example known CSV string
        const result = parseCSV(csvString);
        expect(result).toEqual([
            ["name", "age"],
            ["John", "30"],
            ["Doe", "25"]
        ]);
    });
});

describe('Row Clicked', () => {
    test('rowClicked method sets the correct state', () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    rowSelected: false,
                    selectedRow: null,
                };
            },
        });

        // Simulate a click on the first row
        const row = ["29", "192.168.2.238", "20.54.24.246", "7", "0.6667", "0.0", "1.0", "1.0", "svchost.exe", "C:\Windows\System32\svchost.exe"];
        wrapper.vm.rowClicked(row);

        // Check if the selected row and rowSelected state are correctly updated
        expect(wrapper.vm.selectedRow).toEqual(row);
        expect(wrapper.vm.rowSelected).toBe(true);
    });

    test('rowClicked method with null row', () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    rowSelected: false,
                    selectedRow: null,
                };
            },
        });

        const row = null;
        wrapper.vm.rowClicked(row);

        expect(wrapper.vm.selectedRow).toEqual(null);
        expect(wrapper.vm.rowSelected).toBe(false);
    })
});

describe('Close Row Expand View', () => {
    test('closeRowExpandView method sets rowSelected from true to false', () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    selectedRow: ["29", "192.168.2.238", "20.54.24.246", "7", "0.6667", "0.0", "1.0", "1.0", "svchost.exe", "C:\Windows\System32\svchost.exe"],
                    rowSelected: true, // Initially, a row is selected
                };
            },
        });

        // Call the closeRowExpandView method
        wrapper.vm.closeRowExpandView();

        // Check if rowSelected is set to false after the method is called
        expect(wrapper.vm.rowSelected).toBe(false);
    });
});