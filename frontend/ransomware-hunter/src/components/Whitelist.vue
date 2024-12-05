<template>
    <div class="container">
        <h1>Whitelist</h1>

        <br>

        <div class="search-bar">
            <input type="text" v-model="whitelisted_item" placeholder="Add a program" />
        </div>

        <div class="groups">
            <div class="whitelist-group whitelist-group-1">
                <h2>Whitelisted Programs</h2>
                <ul>
                    <li v-for="(p, index) in whitelisted_programs" :key="index">
                        {{ p }}
                        <button class="remove-btn" @click="removeFromPrograms(index)">X</button>
                    </li>
                </ul>
                <div class="group-footer">
                    <button @click="addToPrograms(whitelisted_item)">Add to Programs</button>
                </div>
            </div>
            <div class="whitelist-group whitelist-group-2">
                <h2>Whitelisted Destinations</h2>
                <ul>
                    <li v-for="(d, index) in whitelisted_destinations" :key="index">
                        {{ d }}
                        <button class="remove-btn" @click="removeFromDestinations(index)">X</button>
                    </li>
                </ul>
                <div class="group-footer">
                    <button @click="addToDestinations(whitelisted_item)">Add to Destinations</button>
                </div>
            </div>
            <div class="whitelist-group whitelist-group-3">
                <h2>Whitelisted Senders</h2>
                <ul>
                    <li v-for="(s, index) in whitelisted_sources" :key="index">
                        {{ s }}
                        <button class="remove-btn" @click="removeFromSources(index)">X</button>
                    </li>
                </ul>
                <div class="group-footer">
                    <button @click="addToSources(whitelisted_item)">Add to Senders</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            whitelisted_programs: [],
            whitelisted_destinations: [],
            whitelisted_sources: [],
            whitelisted_item: "",
        };
    },
    mounted() {
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
        addToPrograms(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_programs.push(newItem);
                localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
                this.whitelisted_item = "";
            } else {
                alert("Please enter a valid program name!");
            }
        },
        addToDestinations(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_destinations.push(newItem);
                localStorage.setItem("whitelisted_destinations", JSON.stringify(this.whitelisted_destinations));
                this.whitelisted_item = "";
            } else {
                alert("Please enter a valid destination name!");
            }
        },
        addToSources(newItem) {
            if (newItem && newItem.trim() !== "") {
                this.whitelisted_sources.push(newItem);
                localStorage.setItem("whitelisted_sources", JSON.stringify(this.whitelisted_sources));
                this.whitelisted_item = "";
            } else {
                alert("Please enter a valid sender name!");
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
/* Same reset and body styles as before */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    padding: 20px;
}

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
    border-color: #333;
}

/* Groups container */
.groups {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    height: 60vh;
}

/* Group styles */
.whitelist-group {
    background-color: #f2f2f2;
    ;
    color: #333;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* Ensure items are spaced top to bottom */
}

ul {
    flex: 1;
    /* Allow list to expand and take up space */
    margin-bottom: 20px;
    overflow-y: auto;
    /* Scroll for long lists */
}

ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

ul li:last-child {
    border-bottom: none;
}

/* Footer button styling */
.group-footer {
    text-align: center;
}

button {
    padding: 10px 20px;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: medium;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
}

button:hover {
    transform: scale(1.05);
}

button:active {
    transform: scale(1);
}
</style>
