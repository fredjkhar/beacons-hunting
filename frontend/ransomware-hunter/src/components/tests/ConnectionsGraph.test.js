import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ConnectionsGraph from '../ConnectionsGraph.vue';

// Mock d3 methods to avoid rendering the actual graph
vi.mock('d3', () => ({
    ...vi.importActual('d3'),
    select: vi.fn(() => ({
      html: vi.fn().mockReturnThis(),
      append: vi.fn().mockReturnThis(),
      attr: vi.fn().mockReturnThis(),
      data: vi.fn().mockReturnThis(),
      join: vi.fn().mockReturnThis(),
      call: vi.fn(function () { return this; }),  // Ensure `call` returns the same object to support chaining
      selectAll: vi.fn(() => ({
        data: vi.fn().mockReturnThis(),
        join: vi.fn().mockReturnThis(),
        attr: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        style: vi.fn().mockReturnThis(),  // Mocking the style method
        call: vi.fn(function () { return this; }),  // Ensure `call` works inside selectAll chain
      })),
    })),
    axisBottom: vi.fn(() => ({
      tickFormat: vi.fn((callback) => callback),  // Mock the tickFormat function for axisBottom
    })),
    axisLeft: vi.fn(() => ({
      tickFormat: vi.fn((callback) => callback),  // Mock the tickFormat function for axisLeft
    })),
    scaleBand: vi.fn(() => ({
      domain: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      padding: vi.fn().mockReturnThis(),
      bandwidth: vi.fn().mockReturnValue(50),
    })),
    scaleLinear: vi.fn(() => ({
      domain: vi.fn().mockReturnThis(),
      nice: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
    })),
    rollup: vi.fn((data, aggregator, key) => {
      return new Map([
        ['2024-11-15', [{ frequency: 3 }]],
        ['2024-11-16', [{ frequency: 1 }]],
      ]);
    }),
    max: vi.fn((data, accessor) => {
      return Math.max(...data.map(accessor));
    }),
  }));
  
  

describe('ConnectionsGraph.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ConnectionsGraph, {
      props: {
        rowData: [
          {
            ConnectionTimes: [
              '2024-11-15T00:00:00.000Z',
              '2024-11-15T01:00:00.000Z',
              '2024-11-15T02:00:00.000Z',
              '2024-11-16T00:00:00.000Z',
            ],
          },
        ],
      },
    });
  });

  test('renders the component with initial structure', async () => {
    await wrapper.vm.$nextTick();  // Wait for the next DOM update after mounted
    expect(wrapper.find('.graphContent').exists()).toBe(true);
    expect(wrapper.find('#graphTitle').text()).toBe('Beacon Connection Frequency');
    expect(wrapper.find('select').exists()).toBe(true);
  
    // Check if the plotContainer ref exists
    // const plotContainer = wrapper.vm.$refs.plotContainer;
    expect(wrapper.find('#plotContainer').exists()).toBe(true)
    // expect(plotContainer).toBeDefined();
  });
  

  test('calls updateGraph when the dropdown value changes', async () => {
    const dropdown = wrapper.find('select');
    expect(dropdown.exists()).toBe(true);

    // Simulate dropdown change
    dropdown.element.value = 'd'; // Select "Days" view
    await dropdown.trigger('change');

    // Verify that the graph updates correctly
    expect(wrapper.vm.selectedTimeUnit).toEqual('d');
  });

  test('initializes with the default time unit "Select a view"', () => {
    expect(wrapper.vm.selectedTimeUnit).toEqual("Select a view");
  });
  

  test('handles bar click events in day view', async () => {
    // Set the time unit to "day" manually
    wrapper.vm.selectedTimeUnit = 'd';  // Set to 'd' (day view)
    const dropdown = wrapper.find('select');
    expect(dropdown.exists()).toBe(true);
  
    // Simulate dropdown change
    dropdown.element.value = 'd'; // Select "Days" view
    await dropdown.trigger('change');
    
    await wrapper.vm.updateGraph();
    
    // Simulate a click event on a bar (ensure this method is actually called in the component)
    const barData = { date: '2024-11-15' };
    wrapper.vm.onBarClick(barData);  // Ensure this method is properly handling the click
    
    // Check the selected time unit after the bar click
    expect(wrapper.vm.selectedTimeUnit).toEqual('d');
    expect(wrapper.vm.selectedDate).toBe('2024-11-15');  // Ensure selectedDate is correctly updated
  });
  
});
