// tests/GenerateReport.test.js

import { mount } from '@vue/test-utils';
import { describe, test, expect, vi } from 'vitest';
import GenerateReport from '../GenerateReport.vue';  // Adjust the path as needed

// Mock functions in ResultTable.js
vi.mock('../ResultTable.js', () => ({
    fetchBackendData: vi.fn(),
    fetchBackendDataWithDates: vi.fn(),
  }));

describe('GenerateReport.vue', () => {
  test('sets default start and end date correctly on mount', async () => {
    const wrapper = mount(GenerateReport);

    // Mock the current date
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Check if the start date and end date are set correctly
    expect(wrapper.vm.startDate).toBe(wrapper.vm.formatDate(yesterday));
    expect(wrapper.vm.endDate).toBe(wrapper.vm.formatDate(now));
  });

  test('validates date range correctly', async () => {
    const wrapper = mount(GenerateReport);

    // Set valid date range
    await wrapper.setData({
      startDate: '2024-12-01T10:00',
      endDate: '2024-12-02T10:00',
    });
    expect(wrapper.vm.isDateRangeValid()).toBe(true);

    // Set invalid date range (start date is after end date)
    await wrapper.setData({
      startDate: '2024-12-03T10:00',
      endDate: '2024-12-02T10:00',
    });
    expect(wrapper.vm.isDateRangeValid()).toBe(false);
  });

//   test('generates report and updates result data', async () => {
//     const mockData = [{ name: 'Test Data 1' }, { name: 'Test Data 2' }];
//     const wrapper = mount(GenerateReport);

//     // Mock the fetchBackendData function to return mock data
//     const { fetchBackendData } = require('../ResultTable.js');
//     fetchBackendData.mockResolvedValue(mockData);

//     // Trigger report generation
//     await wrapper.setData({ startDate: '2024-12-01T10:00', endDate: '2024-12-02T10:00' });
//     await wrapper.find('button').trigger('click');

//     // Check loading state
//     expect(wrapper.vm.loading).toBe(true);

//     // Wait for the loading state to be false after report generation
//     await wrapper.vm.$nextTick();
//     expect(wrapper.vm.loading).toBe(false);

//     // Check if resultData is updated correctly
//     expect(wrapper.vm.resultData.length).toBe(2);
//     expect(wrapper.vm.resultData[0].id).toBe(1);
//     expect(wrapper.vm.resultData[1].id).toBe(2);
//   });

//   test('handles API error gracefully', async () => {
//     const wrapper = mount(GenerateReport);

//     // Mock the fetchBackendData function to simulate an error
//     const { fetchBackendData } = require('../ResultTable.js');
//     fetchBackendData.mockRejectedValue(new Error('Network error'));

//     // Mock the global alert function
//     global.alert = vi.fn();

//     // Trigger report generation
//     await wrapper.setData({ startDate: '2024-12-01T10:00', endDate: '2024-12-02T10:00' });
//     await wrapper.find('button').trigger('click');

//     // Check if loading state is true during the request
//     expect(wrapper.vm.loading).toBe(true);

//     // Wait for the error to be handled
//     await wrapper.vm.$nextTick();
//     expect(wrapper.vm.loading).toBe(false);

//     // Check if an alert was triggered
//     expect(global.alert).toHaveBeenCalledWith('Failed to generate report. Please try again.');
//   });

//   test('navigates to /report after generating report', async () => {
//     const mockData = [{ name: 'Test Data 1' }];
//     const wrapper = mount(GenerateReport, {
//       global: {
//         mocks: {
//           $router: { push: vi.fn() },  // Mock the router push function
//         },
//       },
//     });

//     // Mock the fetchBackendData function to return mock data
//     const { fetchBackendData } = require('../ResultTable.js');
//     fetchBackendData.mockResolvedValue(mockData);

//     // Trigger report generation
//     await wrapper.setData({ startDate: '2024-12-01T10:00', endDate: '2024-12-02T10:00' });
//     await wrapper.find('button').trigger('click');

//     // Wait for the loading state to be false
//     await wrapper.vm.$nextTick();

//     // Check if the router was pushed to '/report'
//     expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/report');
//   });
});
