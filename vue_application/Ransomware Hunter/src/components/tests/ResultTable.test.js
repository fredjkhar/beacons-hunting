import { fetchCSVData, parseCSV, getSortedTableData, sortTable } from '../ResultTable';
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

describe("Get Sorted Table Data", () => {
    const tableData = [
        ['id', 'Name', 'Age', 'JobTitle'],
        ['0', 'Alice', '24', 'Developer'],
        ['1', 'Bob', '30', 'Designer'],
        ['2', 'Charlie', '22', 'Manager'],
        ['3', 'Andrew', '30', 'Contractor'],
    ];

    test("return all rows except headers for no sort selected", () => {
        const result = getSortedTableData(tableData, null, true);
        expect(result).toEqual([
            ['0', 'Alice', '24', 'Developer'],
            ['1', 'Bob', '30', 'Designer'],
            ['2', 'Charlie', '22', 'Manager'],
            ['3', 'Andrew', '30', 'Contractor'],
        ]);
    });

    test("return row 2,1,3,0 when sorting by descending name", () => {
        const result = getSortedTableData(tableData, 1, false);
        expect(result).toEqual([
            ['2', 'Charlie', '22', 'Manager'],
            ['1', 'Bob', '30', 'Designer'],
            ['3', 'Andrew', '30', 'Contractor'],
            ['0', 'Alice', '24', 'Developer'],
        ])
    })

    test("return row 2,0,3,1 when sorting by acending age", () => {
        const result = getSortedTableData(tableData, 2, true);
        expect(result).toEqual([
            ['2', 'Charlie', '22', 'Manager'],
            ['0', 'Alice', '24', 'Developer'],
            ['1', 'Bob', '30', 'Designer'],
            ['3', 'Andrew', '30', 'Contractor'],
        ])
    })
})

describe("Sort Table", () => {
    test("im not sure about this one", () => {
        const result = sortTable(1, 1, true); // Clicking the same column (index 1), current sort is ascending
        expect(result).toEqual({ sortColumn: 1, sortAsc: false }); // Sort direction should toggle to descending
    })

    test('should set the sort column to the given index and toggle to ascending when clicked again', () => {
        const result = sortTable(1, 1, false); // Clicking the same column (index 1), current sort is descending
        expect(result).toEqual({ sortColumn: 1, sortAsc: true }); // Sort direction should toggle to ascending
    });

    test('should set the sort column to the new index and default sort to ascending', () => {
        const result = sortTable(2, 1, true); // Clicking a different column (index 2), current column is index 1
        expect(result).toEqual({ sortColumn: 2, sortAsc: true }); // New column, so sort direction should be ascending by default
    });

    test('should set the sort column to the new index and sort ascending even if the previous column was descending', () => {
        const result = sortTable(3, 1, false); // Clicking a different column (index 3), current column is index 1, which is descending
        expect(result).toEqual({ sortColumn: 3, sortAsc: true }); // New column, so sort direction should reset to ascending
    });
})

describe("handleSort in ResultTable.vue", () => {
    test("test 1", async () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData:[['id', 'Name', 'Age', 'JobTitle'],
                    ['0', 'Alice', '24', 'Developer'],
                    ['1', 'Bob', '30', 'Designer'],
                    ['2', 'Charlie', '22', 'Manager'],
                    ['3', 'Andrew', '30', 'Contractor']],
                    sortColumn: null,
                    sortAsc: true,
                };
            },
        });

        expect(wrapper.vm.sortColumn).toBe(null);
        expect(wrapper.vm.sortAsc).toBe(true);

        // Simulate a click on the first column header to trigger sorting
        const headers = wrapper.findAll('th');
        await headers[0].trigger('click');

        // After clicking the first column, sortColumn should be updated to 0 (first column)
        expect(wrapper.vm.sortColumn).toBe(0);
        expect(wrapper.vm.sortAsc).toBe(true); // Ascending order should be set by default

        // Click the same column again to toggle the sort direction
        await headers[0].trigger('click');
        expect(wrapper.vm.sortAsc).toBe(false);
    });

    test("test 2", async () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData:[['id', 'Name', 'Age', 'JobTitle'],
                    ['0', 'Alice', '24', 'Developer'],
                    ['1', 'Bob', '30', 'Designer'],
                    ['2', 'Charlie', '22', 'Manager'],
                    ['3', 'Andrew', '30', 'Contractor']],
                    sortColumn: null,
                    sortAsc: true,
                };
            },
        });

        // Simulate a click on the second column header to change sorting column
        const headers = wrapper.findAll('th');
        await headers[1].trigger('click');

        // After clicking the second column, sortColumn should be updated to 1 (second column)
        expect(wrapper.vm.sortColumn).toBe(1);
        expect(wrapper.vm.sortAsc).toBe(true); // Sorting should default to ascending for the new column
    });
})

describe('ResultTable.vue', () => {
    test("line 12", () => {
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData:[['id', 'Name', 'Age', 'JobTitle'],
                    ['0', 'Alice', '24', 'Developer'],
                    ['1', 'Bob', '30', 'Designer'],
                    ['2', 'Charlie', '22', 'Manager'],
                    ['3', 'Andrew', '30', 'Contractor']],
                    sortColumn: null,
                    sortAsc: true,
                };
            },
        });

        expect(wrapper.vm.tableData.length).toBeGreaterThan(0);

        // Check if the table is rendered (this reaches the v-if="tableData.length" condition)
        const table = wrapper.find('table');
        expect(table.exists()).toBe(true);
    });
});

describe('ResultTable.vue row rendering and click', () => {
    it('should render table rows and trigger rowClicked on click', async () => {
        // Mount the component
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData:[['id', 'Name', 'Age', 'JobTitle'],
                    ['0', 'Alice', '24', 'Developer'],
                    ['1', 'Bob', '30', 'Designer'],
                    ['2', 'Charlie', '22', 'Manager'],
                    ['3', 'Andrew', '30', 'Contractor']],
                    sortColumn: null,
                    sortAsc: true,
                };
            },
        });

        // Wait for component to finish mounting and data to load
        await wrapper.vm.$nextTick();

        // Check if the rows are rendered correctly
        const rows = wrapper.findAll('tbody tr');
        expect(rows.length).toBe(4); // We expect four rows (excluding the header row)

        // Simulate a click on the first row (Alice)
        await rows[0].trigger('click');

        // Assert that the rowClicked method was called and the selectedRow is set to 'Alice'
        expect(wrapper.vm.selectedRow).toEqual(['0', 'Alice', '24', 'Developer']); // First row data
        expect(wrapper.vm.rowSelected).toBe(true); // rowSelected should be true after click

        // Simulate a click on the second row (Bob)
        await rows[1].trigger('click');

        // Assert that the selectedRow is now set to 'Bob'
        expect(wrapper.vm.selectedRow).toEqual(['1', 'Bob', '30', 'Designer']); // Second row data
        expect(wrapper.vm.rowSelected).toBe(true);

        // Simulate a click on the third row (Charlie)
        await rows[2].trigger('click');

        // Assert that the selectedRow is now set to 'Charlie'
        expect(wrapper.vm.selectedRow).toEqual(['2', 'Charlie', '22', 'Manager']); // Third row data
        expect(wrapper.vm.rowSelected).toBe(true);

        // Simulate a click on the fourth row (Andrew)
        await rows[3].trigger('click');

        // Assert that the selectedRow is now set to 'Andrew'
        expect(wrapper.vm.selectedRow).toEqual(['3', 'Andrew', '30', 'Contractor']); // Fourth row data
        expect(wrapper.vm.rowSelected).toBe(true);
    });
});

describe('ResultTable.vue sorting direction indicator', () => {
    test('should display ▲ for ascending sort', async () => {
        // Mount the component
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData:[['id', 'Name', 'Age', 'JobTitle'],
                    ['0', 'Alice', '24', 'Developer'],
                    ['1', 'Bob', '30', 'Designer'],
                    ['2', 'Charlie', '22', 'Manager'],
                    ['3', 'Andrew', '30', 'Contractor']],
                    sortColumn: null,
                    sortAsc: true,
                };
            },
        });

        // Initial sortColumn is null, so no span should be rendered initially
        expect(wrapper.find('span').exists()).toBe(false);

        // Simulate a sort on a column, let's say index 0
        await wrapper.vm.handleSort(0);

        // After sorting, sortColumn should be 0 and sortAsc should be true by default
        expect(wrapper.vm.sortColumn).toBe(0);
        expect(wrapper.vm.sortAsc).toBe(true);
        expect(wrapper.find('span').text()).toBe('▲'); // Check for ascending indicator
    });

    test('should display ▼ when sortColumn is set and sortAsc is false', async () => {
        // Mount the component with initial data
        const wrapper = mount(ResultTable, {
            data() {
                return {
                    tableData: [
                        ['id', 'Name', 'Age', 'JobTitle'],
                        ['0', 'Alice', '24', 'Developer'],
                        ['1', 'Bob', '30', 'Designer'],
                        ['2', 'Charlie', '22', 'Manager'],
                        ['3', 'Andrew', '30', 'Contractor'],
                    ],
                    sortColumn: 0, // Simulate sorting on the first column (index 0)
                    sortAsc: false, // Set sort direction to descending
                };
            },
        });
    
        // Wait for the DOM to update
        await wrapper.vm.$nextTick();
    
        // Check for the span element corresponding to the first column
        const span = wrapper.find('span');
    
        // Assert that the span exists and its text is "▼"
        expect(span.exists()).toBe(true); // Check if span exists
        expect(span.text()).toBe('▼'); // Check for descending indicator
    });    
});