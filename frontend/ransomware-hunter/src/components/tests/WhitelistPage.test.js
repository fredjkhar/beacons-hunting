// test/whitelist.test.js

import { mount } from '@vue/test-utils';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Whitelist from '../Whitelist.vue';

describe('Whitelist.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Mocking localStorage to avoid actual storage usage during tests
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(null), // Return null to simulate no data in localStorage initially
      setItem: vi.fn(), // Mock the setItem method
    };

    wrapper = mount(Whitelist);
  });

  test('renders component correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Whitelist');
    expect(wrapper.find('.search-bar input').exists()).toBe(true);
    expect(wrapper.findAll('button').length).toBe(3); // Three buttons in the component
  });

  test('adds item to programs and updates localStorage', async () => {
    const item = 'Program 1';
    const input = wrapper.find('input');
    const addButton = wrapper.findAll('button').at(0); // "Add to Programs" button
    
    // Simulate entering an item and adding it to the programs
    await input.setValue(item);
    await addButton.trigger('click');

    // Verify the item is added to the whitelist group
    expect(wrapper.vm.whitelisted_programs).toContain(item);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('whitelisted_programs', JSON.stringify([item]));
  });

  test('adds item to destinations and updates localStorage', async () => {
    const item = 'Destination 1';
    const input = wrapper.find('input');
    const addButton = wrapper.findAll('button').at(1); // "Add to Destinations" button
    
    // Simulate entering an item and adding it to the destinations
    await input.setValue(item);
    await addButton.trigger('click');

    // Verify the item is added to the whitelist group
    expect(wrapper.vm.whitelisted_destinations).toContain(item);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('whitelisted_destinations', JSON.stringify([item]));
  });

  test('adds item to senders and updates localStorage', async () => {
    const item = 'Sender 1';
    const input = wrapper.find('input');
    const addButton = wrapper.findAll('button').at(2); // "Add to Senders" button
    
    // Simulate entering an item and adding it to the senders
    await input.setValue(item);
    await addButton.trigger('click');

    // Verify the item is added to the whitelist group
    expect(wrapper.vm.whitelisted_sources).toContain(item);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('whitelisted_sources', JSON.stringify([item]));
  });

  test('removes item from destinations and updates localStorage', async () => {
    // Setup: Add a destination
    const item = 'Destination 1';
    wrapper.vm.whitelisted_destinations = [item];
    await wrapper.vm.$nextTick(); // Ensure the DOM is updated after modifying the data
    
    // Find the remove button for the added destination
    const removeButtons = wrapper.findAll('.whitelist-group-2 .remove-btn');
    const removeButton = removeButtons.at(0); // Select the first button
    
    // Simulate removing the item from the whitelist
    await removeButton.trigger('click');
    
    // Verify the item is removed from the list
    expect(wrapper.vm.whitelisted_destinations).not.toContain(item);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('whitelisted_destinations', JSON.stringify([]));
  });
  

  test('removes item from senders and updates localStorage', async () => {
    // Setup: Add a sender
    const item = 'Sender 1';
    wrapper.vm.whitelisted_sources = [item];
    await wrapper.vm.$nextTick(); // Ensure the DOM is updated after modifying the data

    const removeButton = wrapper.find('.whitelist-group-3 .remove-btn');
    
    // Simulate removing the item from the whitelist
    await removeButton.trigger('click');
    
    // Verify the item is removed from the list
    expect(wrapper.vm.whitelisted_sources).not.toContain(item);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('whitelisted_sources', JSON.stringify([]));
  });
});
