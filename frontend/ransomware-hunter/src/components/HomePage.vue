<template>
    <div class="content">
        <!-- Main heading for the page -->
        <h1>Welcome to Beacon Hunter</h1>

        <!-- A box with a welcome message and description of beacon hunting -->
        <div class="welcome-box">
            <p>Beacon hunting involves identifying and analyzing communication signals between compromised systems and threat actors to detect malicious activity. The generated reports help in identifying these systems.</p>
            <!-- Instructional text to prompt the user to click the button to get started -->
            <p id="click-text">Click the get started button to start generating a report.</p>
        </div>

        <!-- Button that triggers the 'getStartedButton' method to navigate to the next page -->
        <button @click="getStartedButton">Get Started</button>
    </div>
</template>

<script scoped>
// This script controls the behavior of the page, including the button click event
export default {
    methods: {
        // Method to handle the button click, navigates to the '/generate' route
        getStartedButton() {
            this.$router.push("/generate");
        },
    }
}
</script>

<style>
/* Styling for the content container */
.content {
    display: flex; /* Enable Flexbox layout */
    flex-direction: column; /* Stack children vertically */
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
    text-align: center; /* Center text within the content */
}

/* Styling for the welcome box */
.welcome-box {
    background-color: #f2f2f2; /* Light gray background */
    color: #333; /* Dark text color */
    width: 75vw; /* Set width to 75% of the viewport width */
    margin-top: 5vh; /* Margin from top of viewport */
    margin-bottom: 5vh; /* Margin from bottom of viewport */
    padding: 20px; /* Add padding inside the box */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow effect for visual depth */
    font-size: x-large; /* Larger font size for the text */
}

/* Styling for the instruction text inside the welcome box */
#click-text {
    color: #38678F; /* Set color for the instruction text */
}

/* Styling for the button */
button {
    background-color: #38678F; /* Dark blue background */
    color: #f2f2f2; /* Light text color */
    font-weight: bold; /* Make the button text bold */
    font-size: x-large; /* Increase font size */
}

/* Button hover effect */
button:hover {
    background-color: #38678F; /* Same background color on hover */
    color: #f2f2f2; /* Maintain text color on hover */
    font-weight: bold; /* Keep the text bold on hover */
}
</style>
