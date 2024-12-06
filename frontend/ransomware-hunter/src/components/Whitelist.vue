<template>
    <div class="container">
        <!-- Title of the page -->
        <h1>Whitelist</h1>

        <br>

        <!-- Search bar to add items to be whitelisted -->
        <div class="search-bar">
            <input type="text" v-model="whitelisted_item" placeholder="Add item to be whitelisted" />
        </div>
        
        <!-- Buttons to add items to destinations or sources -->
        <button @click="addToDestinations(whitelisted_item)" style="margin-left: 1%; margin-right: 1%; margin-bottom: 1%;">Add to Destinations</button>
        <button @click="addToSources(whitelisted_item)">Add to Sources</button>

        <!-- Display of whitelisted destinations and sources -->
        <div class="groups">
            <div class="whitelist-group whitelist-group-1">
                <h2>Whitelisted Destinations</h2>
                <ul>
                    <!-- Loop through the destinations and display them with a remove button -->
                    <li v-for="(d, index) in whitelisted_destinations" :key="index">
                        {{ d }}
                        <button class="remove-btn" @click="removeFromDestinations(index)">X</button>
                    </li>
                </ul>
            </div>
            <div class="whitelist-group whitelist-group-2">
                <h2>Whitelisted Sources</h2>
                <ul>
                    <!-- Loop through the sources and display them with a remove button -->
                    <li v-for="(s, index) in whitelisted_sources" :key="index">
                        {{ s }}
                        <button class="remove-btn" @click="removeFromSources(index)">X</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // Arrays to store whitelisted programs, destinations, and sources
            whitelisted_programs: [],
            whitelisted_destinations: [],
            whitelisted_sources: [],
            // Variable to bind the input for new items
            whitelisted_item: "",
        };
    },
    mounted() {
        // Check localStorage and load previously saved whitelisted items
        if (localStorage.getItem("whitelisted_programs") != null) {
            this.whitelisted_programs = JSON.parse(localStorage.getItem("whitelisted_programs"));
        }
        if (localStorage.getItem("whitelisted_destinations") != null) {
            this.whitelisted_destinations = JSON.parse(localStorage.getItem("whitelisted_destinations"));
        }
        if (localStorage.getItem("whitelisted_sources") != null) {
            this.whitelisted_sources = JSON.parse(localStorage.getItem("whitelisted_sources"));
        }
    },
    methods: {
        // Add a new program to the whitelisted programs array
        addToPrograms(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_programs.push(newItem);
                localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
                this.whitelisted_item = ""; // Reset the input field
            } else {
                alert("Please enter a valid program name!"); // Alert if input is invalid
            }
        },
        // Add a new item to the whitelisted destinations array
        addToDestinations(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_destinations.push(newItem);
                localStorage.setItem("whitelisted_destinations", JSON.stringify(this.whitelisted_destinations));
                this.whitelisted_item = ""; // Reset the input field
            } else {
                alert("Please enter a valid destination name!"); // Alert if input is invalid
            }
        },
        // Add a new item to the whitelisted sources array
        addToSources(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_sources.push(newItem);
                localStorage.setItem("whitelisted_sources", JSON.stringify(this.whitelisted_sources));
                this.whitelisted_item = ""; // Reset the input field
            } else {
                alert("Please enter a valid sender name!"); // Alert if input is invalid
            }
        },
        // Remove an item from the whitelisted programs array
        removeFromPrograms(index) {
            this.whitelisted_programs.splice(index, 1);
            localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
        },
        // Remove an item from the whitelisted destinations array
        removeFromDestinations(index) {
            this.whitelisted_destinations.splice(index, 1);
            localStorage.setItem("whitelisted_destinations", JSON.stringify(this.whitelisted_destinations));
        },
        // Remove an item from the whitelisted sources array
        removeFromSources(index) {
            this.whitelisted_sources.splice(index, 1);
            localStorage.setItem("whitelisted_sources", JSON.stringify(this.whitelisted_sources));
        },
    },
};
</script>

<style>
/* Global reset for all elements */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body styling */
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    padding: 20px;
}

/* Styling for the search bar */
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
    border-color: #333; /* Highlight border when input is focused */
}

/* Styling for the groups container */
.groups {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two columns */
    gap: 20px;
    height: 55vh;
}

/* Styling for each whitelist group */
.whitelist-group {
    background-color: #f2f2f2;
    color: #333;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Styling for the list within the whitelist group */
ul {
    flex: 1;
    margin-bottom: 20px;
    overflow-y: auto;
}

ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #a1a1a1;
    transition: background-color 0.2s;
}

ul li:last-child {
    border-bottom: none;
}

/* Button styling */
button {
    padding: 10px 20px;
    color: #fff;
    border: none;
    border-radius: 4px !important;
    font-size: small;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
}

button:hover {
    transform: scale(1.05); /* Slightly increase size on hover */
}

button:active {
    transform: scale(1); /* Reset size when button is clicked */
}

/* Remove button styling */
.remove-btn {
    margin-left: auto; /* Push the remove button to the right */
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
    background-color: #e60000; /* Change color when hovering over the remove button */
}
</style>
