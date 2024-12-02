<template>
    <div class="container">
        <header>
            <h1>Whtielist</h1>
        </header>

        <div class="search-bar">
            <input type="text" v-model="whitelisted_item" placeholder="Add a program" />
        </div>

        <div class="groups">
            <div class="whitelist-group-1">
                <h2>Whitelisted Programs</h2>
                <ul>
                    <li v-for="(p, index) in whitelisted_programs" :key="index">
                        {{ p }}
                        <button class="remove-btn" @click="removeFromPrograms(index)">X</button>
                    </li>
                </ul>
                <button @click="addToPrograms(whitelisted_item)">Add to Programs</button>
            </div>
            <div class="whitelist-group-2">
                <h2>Whitelisted Destinations</h2>
                <ul>
                    <li v-for="(d, index) in whitelisted_destinations" :key="index">
                        {{ d }}
                        <button class="remove-btn" @click="removeFromDestinations(index)">X</button>
                    </li>
                </ul>
                <button @click="addToDestinations(whitelisted_item)">Add to Destinations</button>
            </div>
            <div class="whitelist-group-3">
                <h2>Whitelisted Senders</h2>
                <ul>
                    <li v-for="(s, index) in whitelisted_sources" :key="index">
                        {{ s }}
                        <button class="remove-btn" @click="removeFromSources(index)">X</button>
                    </li>
                </ul>
                <button @click="addToSources(whitelisted_item)">Add to Senders</button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            whitelisted_programs: [], // Start with an empty array
            whitelisted_destinations: [],
            whitelisted_sources: [],
            whitelisted_item: "", // Input field for adding new items
        };
    },
    mounted() {
        this.whitelisted_programs = JSON.parse(localStorage.getItem("whitelisted_programs"));
        this.whitelisted_destinations = JSON.parse(localStorage.getItem("whitelisted_destinations"));
        this.whitelisted_sources = JSON.parse(localStorage.getItem("whitelisted_sources"));
    },
    methods: {
        addToPrograms(newItem) {
            if (newItem && newItem.trim() !== "") {
                // Add to the array and save to localStorage
                this.whitelisted_programs.push(newItem);
                localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
                this.whitelisted_item = ""; // Clear the input field
            } else {
                alert("Please enter a valid program name!");
            }
        },
        addToDestinations(newItem) {
            if (newItem && newItem.trim() !== "") {
                // Add to the array and save to localStorage
                this.whitelisted_destinations.push(newItem);
                localStorage.setItem("whitelisted_destinations", JSON.stringify(this.whitelisted_destinations));
                this.whitelisted_item = ""; // Clear the input field
            } else {
                alert("Please enter a valid program name!");
            }
        },
        addToSources(newItem) {
            if (newItem && newItem.trim() !== "") {
                // Add to the array and save to localStorage
                this.whitelisted_sources.push(newItem);
                localStorage.setItem("whitelisted_sources", JSON.stringify(this.whitelisted_sources));
                this.whitelisted_item = ""; // Clear the input field
            } else {
                alert("Please enter a valid program name!");
            }
        },
        removeFromPrograms(index) {
            this.whitelisted_programs.splice(index, 1);
            localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
        },
        removeFromDestinations(index) {
            this.whitelisted_destinations.splice(index, 1);
            localStorage.setItem("whitelisted_destinations", JSON.stringify(this.whitelisted_destinations));
        },
        removeFromSources(index) {
            this.whitelisted_sources.splice(index, 1);
            localStorage.setItem("whitelisted_sources", JSON.stringify(this.whitelisted_sources));
        },
    },
};
</script>


<style>
/* Reset default margin and padding */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Set a basic font for the entire page */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    padding: 20px;
}

/* Search bar styling */
.search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    max-width: 400px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
}

.search-bar input:focus {
    border-color: #007bff;
}

/* Group container */
.groups {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

/* Group card styling */
.whitelist-group-1,
.whitelist-group-2,
.whitelist-group-3 {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
    color: #444;
    margin-bottom: 15px;
}

/* List styling */
ul li {
    display: flex; /* Use flexbox for alignment */
    justify-content: space-between; /* Space out text and button */
    align-items: center; /* Center-align the content vertically */
    padding: 5px 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
    position: relative; /* Ensure proper layout for the button */
}

ul li:last-child {
    border-bottom: none;
}

ul li:hover {
    background-color: #f0f8ff;
}

/* Remove button styling */
.remove-btn {
    margin-left: auto; /* Push the button to the far right */
    padding: 2px 6px;
    background-color: #ff4d4d;
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.remove-btn:hover {
    background-color: #e60000;
}

/* Button styling */
button {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
}

button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

button:active {
    transform: scale(1);
}
</style>
