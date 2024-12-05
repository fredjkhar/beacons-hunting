<template>
    <div class="content">
        <h1>Welcome to Ransomware Hunter</h1>
        <div class="welcome-box">
            <p>Description of product.</p>
            <p>Description of score calculation.</p>
            <p>Click the get started button to start generating a report.</p>
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
    height: 55vh;
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