// tests/Login.test.js

import { mount } from '@vue/test-utils';
import Login from '../Login.vue';
import { describe, test, expect, vi } from 'vitest';

describe('Login.vue', () => {
    test("mount component", () => {
        expect(Login).toBeTruthy();
      });

  // Test to check if the login form elements are rendered correctly
  test('renders login form elements', () => {
    const wrapper = mount(Login);

    expect(wrapper.find('h1').text()).toBe('Beacon Hunter');
    expect(wrapper.find('h3').text()).toBe('Log in to start generating reports');
    expect(wrapper.find('#username').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Log In');
  });

  // Test for successful login with valid credentials
  test('logs in successfully with valid credentials', async () => {
    const wrapper = mount(Login);
  
    await wrapper.setData({ username: 'admin', password: 'password' });
  
    // Trigger the login button click
    await wrapper.find('button').trigger('click');
  
    // Check if the loginSuccess event was emitted
    const emittedEvents = wrapper.emitted('loginSuccess');
    expect(emittedEvents).toBeDefined();
    expect(emittedEvents.length).toBe(1);
  
    // Check session storage and error message
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    expect(wrapper.find('.error-message').exists()).toBe(false);
  });
  

  test('displays error message with invalid credentials', async () => {
    // Clear session storage before each test to avoid interference from previous tests
    sessionStorage.clear();
  
    const wrapper = mount(Login);
  
    await wrapper.setData({ username: 'admin', password: 'wrongpassword' });
  
    await wrapper.find('button').trigger('click');
  
    // Check if the error message is shown
    expect(wrapper.find('.error-message').text()).toBe('Invalid username or password.');
    
    // Check that the session storage is not set
    expect(sessionStorage.getItem('isLoggedIn')).toBeNull();
  });
  

  // Test to ensure the error message does not show when correct credentials are used
  test('does not show error message on successful login', async () => {
    const wrapper = mount(Login);

    await wrapper.setData({ username: 'admin', password: 'password' });

    await wrapper.find('button').trigger('click');

    expect(wrapper.find('.error-message').exists()).toBe(false);
  });
});
