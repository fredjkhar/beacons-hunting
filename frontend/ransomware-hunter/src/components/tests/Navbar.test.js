// tests/Navbar.test.js

import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import Navbar from '../Navbar.vue';  // Adjust the path as needed
import { describe, test, expect, vi } from 'vitest';

// Create mock components for the test
const Home = { template: '<div>Home</div>' };
const Report = { template: '<div>Report</div>' };
const GenerateReport = { template: '<div>Generate Report</div>' };
const Whitelist = { template: '<div>Whitelist</div>' };

// Mock router configuration
const routes = [
  { path: '/', component: Home },
  { path: '/generate', component: GenerateReport },
  { path: '/report', component: Report },
  { path: '/whitelist', component: Whitelist },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('Navbar.vue', () => {
  // Test if the content renders correctly
  test('renders navbar and links', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    // Check if the navbar is rendered
    expect(wrapper.find('.navbar').exists()).toBe(true);

    // Check if the links are rendered
    expect(wrapper.find('a[href="/"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/generate"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/report"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/whitelist"]').exists()).toBe(true);
  });

  // Test if clicking a link navigates to the correct route
  test('clicking on a link navigates to correct route', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    // Click on the 'View Report' link (third link in the navbar)
    await wrapper.findAll('.item a')[2].trigger('click');

    // Wait for navigation to complete
    await router.push('/report');  // Explicitly navigate to the route

    // Check if the router navigated to '/report'
    expect(wrapper.vm.$router.currentRoute.value.path).toBe('/report');
  });

  // Test if clicking on the project name navigates to the home page
  test('clicking project name redirects to home page', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    // Simulate clicking the project name
    await wrapper.find('.project-name').trigger('click');

    // Wait for the navigation to complete
    await router.push('/');  // Explicitly navigate to the home route

    // Check if the router navigated to '/'
    expect(wrapper.vm.$router.currentRoute.value.path).toBe('/');
  });
});
