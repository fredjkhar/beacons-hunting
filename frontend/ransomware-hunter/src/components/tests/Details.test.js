import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import DetailPage from '../DetailPage.vue';
import { nextTick } from 'vue';

vi.mock('../ConnectionsGraph.vue', () => ({
  default: {
    name: 'ConnectionsGraph',
    template: '<div>Mocked Graph</div>',
  },
}));

test("mount component", () => {
    expect(DetailPage).toBeTruthy();
  });

describe('DetailPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn((key) => {
        const data = {
          tableData: JSON.stringify([
            {
              id: 1,
              'source.ip': '192.168.1.1',
              'destination.ip': '192.168.1.2',
              ConnectionTimes: ['2024-11-15T00:00:00.000Z'],
              Score: 85,
            },
          ]),
          whitelisted_sources: JSON.stringify([]),
          whitelisted_destinations: JSON.stringify([]),
        };
        return data[key];
      }),
      setItem: vi.fn(),
    };

    wrapper = mount(DetailPage, {
      props: { id: '1' },
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    });
  });

  

  test('fetches and renders row data based on id', async () => {
    await nextTick();

    expect(wrapper.vm.rowData).toEqual({
      id: 1,
      'source.ip': '192.168.1.1',
      'destination.ip': '192.168.1.2',
      ConnectionTimes: ['2024-11-15T00:00:00.000Z'],
      Score: 85,
    });

    expect(wrapper.find('.details-section').text()).toContain('192.168.1.1');
    expect(wrapper.find('.details-section').text()).toContain('192.168.1.2');
    expect(wrapper.find('.details-section').text()).toContain('85');
  });

  test('navigates back to the report page', async () => {
    await nextTick();
  
    const backButton = wrapper.find('#backButton'); // Use the id to find the button
    expect(backButton.exists()).toBe(true); // Ensure the button exists
    await backButton.trigger('click'); // Simulate the click event
  
    // Check if the router push method is called with the correct route
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/report');
  });

  test('whitelist souce', async () => {
    await nextTick();

    expect(wrapper.vm.sourceWhitelisted).toEqual(false);
  
    const backButton = wrapper.find('#whitelistButtonSource'); // Use the id to find the button
    expect(backButton.exists()).toBe(true); // Ensure the button exists
    await backButton.trigger('click'); // Simulate the click event
  
    // Check if the router push method is called with the correct route
    expect(wrapper.vm.sourceWhitelisted).toEqual(true);
  });

  test('whitelist souce', async () => {
    await nextTick();

    expect(wrapper.vm.destinationWhitelisted).toEqual(false);
  
    const backButton = wrapper.find('#whitelistButtonDestination'); // Use the id to find the button
    expect(backButton.exists()).toBe(true); // Ensure the button exists
    await backButton.trigger('click'); // Simulate the click event
  
    // Check if the router push method is called with the correct route
    expect(wrapper.vm.destinationWhitelisted).toEqual(true);
  });
});
