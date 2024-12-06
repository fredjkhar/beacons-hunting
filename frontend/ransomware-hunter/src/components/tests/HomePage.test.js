// tests/HomPage.test.js

import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../HomePage.vue';
import { describe, test, expect, vi } from 'vitest';

// Mock the Vue Router
const routes = [
  { path: '/', name: 'Home' },
  { path: '/generate', name: 'GenerateReport' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('HomePage.vue', () => {
  // Test if the content is rendered correctly
  test('renders the content', async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
      },
    });

    // Check if the heading is rendered
    expect(wrapper.find('h1').text()).toBe('Welcome to Beacon Hunter');

    // Check if the welcome box content is rendered
    expect(wrapper.find('.welcome-box').exists()).toBe(true);
    expect(wrapper.find('.welcome-box').text()).toContain(
      'Beacon hunting involves identifying and analyzing communication signals'
    );
    expect(wrapper.find('#click-text').text()).toBe(
      'Click the get started button to start generating a report.'
    );

    // Check if the button is rendered
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Get Started');
  });

  // Test if clicking the "Get Started" button navigates to the '/generate' route
  test('clicking Get Started button navigates to /generate', async () => {
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
      },
    });

    // Simulate clicking the "Get Started" button
    await wrapper.find('button').trigger('click');

    // Wait for the navigation to complete
    await router.push('/generate');  // Explicitly navigate to the route

    // Check if the router navigated to '/generate'
    expect(wrapper.vm.$router.currentRoute.value.path).toBe('/generate');
  });
});
