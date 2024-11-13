// tests/ResultTable.test.js

import { fetchBackendData, getSortedTableData, toggleSort } from '../ResultTable';
import ResultTable from '../ResultTable.vue';
import { describe, test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

test("mount component", () => {
  expect(ResultTable).toBeTruthy();
});

describe('fetchBackendData', () => {
  // Mock the global fetch API
  beforeEach(() => {
    // Reset the fetch mock before each test
    global.fetch = vi.fn();
  });

  test('handles fetch error', async () => {
    const result = await fetchBackendData(null);
    expect(result).toEqual([]); // Should return an empty array on error
  });

  test('should return data when fetch is successful', async () => {
    const mockData = [{ name: 'John', age: 30 }, { name: 'Doe', age: 25 }]; // Sample data

    // Mock a successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchBackendData('/path/to/api'); // Simulate passing an endpoint
    expect(fetch).toHaveBeenCalledWith('/path/to/api'); // Ensure the fetch was called with the correct endpoint
    expect(result).toEqual(mockData); // Ensure the returned data is correct
  });

  test('should return an empty array when fetch fails (response not ok)', async () => {
    // Mock a failed response
    fetch.mockResolvedValueOnce({
      ok: false, // Simulate fetch failure (response.ok === false)
    });

    const result = await fetchBackendData('/path/to/api');
    expect(fetch).toHaveBeenCalledWith('/path/to/api');
    expect(result).toEqual([]); // Ensure it returns an empty array on error
  });

  test('should catch fetch error and return an empty array', async () => {
    // Mock a network or fetch error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchBackendData('/path/to/api');
    expect(fetch).toHaveBeenCalledWith('/path/to/api');
    expect(result).toEqual([]); // Ensure it returns an empty array on fetch error
  });
});

describe('Row Clicked', () => {
  test('rowClicked method navigates to the correct route', () => {
    const pushMock = vi.fn();
    const wrapper = mount(ResultTable, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
          },
        },
      },
      data() {
        return {
          data: [
            { id: 1, Name: 'John', Age: '30' },
          ],
        };
      },
    });

    // Simulate clicking on a row
    const row = { id: 1, Name: 'John', Age: '30' };
    wrapper.vm.rowClicked(row);

    // Check if $router.push was called with the correct parameters
    expect(pushMock).toHaveBeenCalledWith({ name: 'Details', params: { id: 1 } });
  });

  test('rowClicked method logs an error if row id is undefined', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pushMock = vi.fn();
    const wrapper = mount(ResultTable, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
          },
        },
      },
    });

    const row = {}; // No id
    wrapper.vm.rowClicked(row);

    expect(consoleErrorMock).toHaveBeenCalledWith('Row ID not found');
    expect(pushMock).not.toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });
});

describe('Get Sorted Table Data', () => {
  const tableData = [
    { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
    { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
    { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
    { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
  ];

  test('return data as-is when no sort key is selected', () => {
    const result = getSortedTableData(tableData, null, true);
    expect(result).toEqual(tableData);
  });

  test("sort data by 'Age' ascending", () => {
    const result = getSortedTableData(tableData, 'Age', true);
    expect(result).toEqual([
      { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
      { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
      { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
      { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
    ]);
  });
});

describe('toggleSort', () => {
  test('toggle sort direction when same key is clicked', () => {
    let currentSortKey = 'Name';
    let currentSortAsc = true;
    let key = 'Name';

    const result = toggleSort(key, currentSortKey, currentSortAsc);

    expect(result).toEqual({ sortKey: 'Name', sortAsc: false });
  });

  test('set sort direction to ascending when new key is clicked', () => {
    let currentSortKey = 'Name';
    let currentSortAsc = false;
    let key = 'Age';

    const result = toggleSort(key, currentSortKey, currentSortAsc);

    expect(result).toEqual({ sortKey: 'Age', sortAsc: true });
  });
});

describe('handleSort in ResultTable.vue', () => {
  test('should update sortKey and sortAsc when a header is clicked', async () => {
    const wrapper = mount(ResultTable, {
      data() {
        return {
          data: [
            { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
            { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
            { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
            { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
          ],
          sortKey: null,
          sortAsc: true,
        };
      },
    });

    expect(wrapper.vm.sortKey).toBe(null);
    expect(wrapper.vm.sortAsc).toBe(true);

    // Simulate a click on the 'Name' header
    await wrapper.vm.handleSort('Name');

    expect(wrapper.vm.sortKey).toBe('Name');
    expect(wrapper.vm.sortAsc).toBe(true);

    // Click the same header again to toggle sort direction
    await wrapper.vm.handleSort('Name');

    expect(wrapper.vm.sortKey).toBe('Name');
    expect(wrapper.vm.sortAsc).toBe(false);

    // Click a different header
    await wrapper.vm.handleSort('Age');

    expect(wrapper.vm.sortKey).toBe('Age');
    expect(wrapper.vm.sortAsc).toBe(true);
  });
});

describe('ResultTable.vue', () => {
  test('should render the table when data is present', () => {
    const wrapper = mount(ResultTable, {
      data() {
        return {
          data: [
            { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
            { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
            { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
            { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
          ],
        };
      },
    });

    expect(wrapper.vm.data.length).toBeGreaterThan(0);

    // Check if the table is rendered (this reaches the v-if="data.length" condition)
    const table = wrapper.find('table');
    expect(table.exists()).toBe(true);
  });
});

describe('ResultTable.vue row rendering and click', () => {
  test('should render table rows and navigate on row click', async () => {
    const pushMock = vi.fn();
    const wrapper = mount(ResultTable, {
      global: {
        mocks: {
          $router: {
            push: pushMock,
          },
        },
      },
      data() {
        return {
          data: [
            { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
            { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
            { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
            { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
          ],
        };
      },
    });

    // Wait for component to finish mounting and data to load
    await wrapper.vm.$nextTick();

    // Check if the rows are rendered correctly
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(4); // We expect four rows

    // Simulate a click on the first row (Alice)
    await rows[0].trigger('click');

    // Assert that $router.push was called with the correct id
    expect(pushMock).toHaveBeenCalledWith({ name: 'Details', params: { id: '0' } });

    // Simulate a click on the second row (Bob)
    await rows[1].trigger('click');

    expect(pushMock).toHaveBeenCalledWith({ name: 'Details', params: { id: '1' } });
  });
});

describe('ResultTable.vue sorting direction indicator', () => {
  test('should display ▲ for ascending sort', async () => {
    // Mount the component
    const wrapper = mount(ResultTable, {
      data() {
        return {
          data: [
            { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
            { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
            { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
            { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
          ],
          sortKey: null,
          sortAsc: true,
        };
      },
    });

    // Initial sortKey is null, so no span should be rendered initially
    expect(wrapper.find('span').exists()).toBe(false);

    // Simulate a sort on a column, let's say 'Name'
    await wrapper.vm.handleSort('Name');

    // After sorting, sortKey should be 'Name' and sortAsc should be true by default
    expect(wrapper.vm.sortKey).toBe('Name');
    expect(wrapper.vm.sortAsc).toBe(true);

    // Check for the sort direction indicator
    const header = wrapper.find('th');
    const span = header.find('span');
    expect(span.exists()).toBe(true);
    expect(span.text()).toBe('▲'); // Check for ascending indicator
  });

  test('should display ▼ when sortKey is set and sortAsc is false', async () => {
    // Mount the component with initial data
    const wrapper = mount(ResultTable, {
      data() {
        return {
          data: [
            { id: '0', Name: 'Alice', Age: '24', JobTitle: 'Developer' },
            { id: '1', Name: 'Bob', Age: '30', JobTitle: 'Designer' },
            { id: '2', Name: 'Charlie', Age: '22', JobTitle: 'Manager' },
            { id: '3', Name: 'Andrew', Age: '30', JobTitle: 'Contractor' },
          ],
          sortKey: 'Name',
          sortAsc: false,
        };
      },
    });

    // Wait for the DOM to update
    await wrapper.vm.$nextTick();

    // Check for the span element corresponding to the 'Name' column
    const headers = wrapper.findAll('th');
    const header = headers.find((th) => th.text().includes('Name'));
    const span = header.find('span');

    // Assert that the span exists and its text is "▼"
    expect(span.exists()).toBe(true);
    expect(span.text()).toBe('▼'); // Check for descending indicator
  });
});

describe('whitelist functionality', () => {
  test('updates whitelist when Whitelist button is clicked', async () => {
    // Mount the component
    const wrapper = mount(ResultTable);

    // Set the whitelistText field
    const whitelistInput = wrapper.find('input[type="text"]');
    await whitelistInput.setValue('testExample');

    // Trigger the button click
    const button = wrapper.find('button');
    await button.trigger('click');

    // Verify that the whitelist is updated
    expect(wrapper.vm.whitelist).toEqual('testExample');
  });

  test('returns true if whitelist is empty or null', () => {
    const wrapper = mount(ResultTable);

    wrapper.vm.whitelist = ''; // Empty whitelist
    expect(wrapper.vm.checkWhitelist({ Name: 'some data' })).toBe(true);

    wrapper.vm.whitelist = null; // Null whitelist
    expect(wrapper.vm.checkWhitelist({ Name: 'other data' })).toBe(true);
  });

  test('returns false if a row contains the whitelist text', () => {
    const wrapper = mount(ResultTable);

    wrapper.vm.whitelist = 'test';
    const row = { Name: 'test data' };
    expect(wrapper.vm.checkWhitelist(row)).toBe(false);
  });

  test('returns true if a row does not contain the whitelist text', () => {
    const wrapper = mount(ResultTable);

    wrapper.vm.whitelist = 'notInRow';
    const row = { Name: 'some data' };
    expect(wrapper.vm.checkWhitelist(row)).toBe(true);
  });

  test('works with nested arrays within the row', () => {
    const wrapper = mount(ResultTable);

    wrapper.vm.whitelist = 'nested';
    const row = { Name: ['nested', 'data'] };
    expect(wrapper.vm.checkWhitelist(row)).toBe(false);

    wrapper.vm.whitelist = 'missing';
    expect(wrapper.vm.checkWhitelist(row)).toBe(true);
  });

  test('returns false if a string field contains the whitelist text', () => {
    const wrapper = mount(ResultTable);

    wrapper.vm.whitelist = 'matchMe';
    const row = {
      NumberField: 456,
      ObjectField: { key: 'value' },
      BooleanField: true,
      StringField: 'matchMe',
      ArrayField: ['no match here'],
    };

    // Since 'matchMe' is present in one of the string fields, checkWhitelist should return false
    expect(wrapper.vm.checkWhitelist(row)).toBe(false);
  });
});