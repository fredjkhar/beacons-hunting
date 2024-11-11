import { mount } from "@vue/test-utils";
import RowExpandView from "../RowExpandView.vue";
import { describe, expect } from "vitest";
import { checkRow } from "../RowExpandView";

test("mount component", async () => {
    expect(RowExpandView).toBeTruthy();
});

describe('Check Row', () => {
    test('empty row', () => {
        expect(checkRow()).toBe(false);
    }),

    test('non null invalid input', () => {
        expect(checkRow(6)).toBe(false);
    })

    test('non null invalid row', () => {
        expect(checkRow(["0", "1", "2", "3", "4", "5", "6", "7", "8"])).toBe(false);
    })

    test('non null valid row', () => {
        expect(checkRow(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])).toBe(true);
    })
})

describe('Back Button', () => {
    it('emits "closeView" when the backButton is clicked', async () => {
        // Arrange
        const wrapper = mount(RowExpandView, {
                props: {
                row: [1, '192.168.1.1', '192.168.1.2', 10, 0.5, 0.7, 1.2, 0.8, 'process1', '/usr/bin/process1'],
            },
        });
    
        // Act
        const button = wrapper.find('button'); // Find the button
        await button.trigger('click'); // Trigger a click event
    
        // Assert
        expect(wrapper.emitted()).toHaveProperty('closeView'); // Check if the 'closeView' event was emitted
    });
});