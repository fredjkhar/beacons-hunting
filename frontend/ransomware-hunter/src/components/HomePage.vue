<template>
    <div class="content">
        <h1>Welcome to Beacon Hunter</h1>
        <div class="welcome-box">
            <p>	Beacon hunting involves identifying and analyzing communication signals between compromised systems and threat actors to detect malicious activity. The generated reports help in identifying these systems.</p>
            <p id="click-text">Click the get started button to start generating a report.</p>
        </div>

        <button @click="getStartedButton">Get Started</button>
    </div>
</template>

<script scoped>
export default {
    methods: {
        getStartedButton() {
            this.$router.push("/generate");
        },
    }
}
</script>

<style>
.content {
    display: flex;
    /* Enable Flexbox layout */
    flex-direction: column;
    /* Stack children vertically */
    justify-content: center;
    /* Center vertically */
    align-items: center;
    /* Center horizontally */
    text-align: center;
}

.welcome-box {
    background-color: #f2f2f2;
    ;
    color: #333;
    width: 75vw;
    margin-top: 5vh;
    margin-bottom: 5vh;
    padding: 20px;
    /* Add some padding for spacing inside the box */
    border-radius: 8px;
    /* Optional: Add rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    /* Optional: Add shadow for better visuals */
    font-size: x-large;
}

#click-text {
    color: #38678F;
}

button {
    background-color: #38678F;
    color: #f2f2f2;
    font-weight: bold;
    font-size: x-large;
}

button:hover {
    background-color: #38678F;
    color: #f2f2f2;
    font-weight: bold;
}
</style>