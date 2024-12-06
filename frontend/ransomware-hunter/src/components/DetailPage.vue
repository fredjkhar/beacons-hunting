<template>
  <div class="container">
    <h1>Beacon Score</h1>
    <div v-if="rowData" class="content-wrapper">
      <!-- Display details of the selected row data -->
      <div class="details-section">
        <div v-for="(value, key) in rowData" :key="key" class="mb-1">
          <!-- Check if the key is 'ConnectionTimes' and show it as a collapsible section -->
          <div v-if="key == 'ConnectionTimes'">
            <details>
              <summary>
                <strong>{{ key }}: </strong>
              </summary>
              <ul v-for="(time, index) in value" :key="index">
                <li>{{ time }}</li>
              </ul>
            </details>
          </div>
          <!-- Display other key-value pairs directly -->
          <div v-else>
            <strong>{{ key }}:</strong> {{ value }}
          </div>
        </div>

        <br />
        <!-- Display button to add source to whitelist if it's not already whitelisted -->
        <button id="whitelistButtonSource" v-if="!sourceWhitelisted" @click="addSourceToWhitelist" style="font-size: medium;">Add source to Whitelist</button>
        <!-- Display message if source is already whitelisted -->
        <p v-if="sourceWhitelisted"><strong>Source has been whitelisted</strong></p>
        <br v-if="!sourceWhitelisted"/><br />
        
        <!-- Display button to add destination to whitelist if it's not already whitelisted -->
        <button id="whitelistButtonDestination" v-if="!destinationWhitelisted" @click="addDestinationToWhitelist" style="font-size: medium;">Add destination to Whitelist</button>
        <!-- Display message if destination is already whitelisted -->
        <p v-if="destinationWhitelisted"><strong>Destination has been whitelisted</strong></p>
      </div>

      <!-- Display the connections graph component -->
      <div class="graph-section">
        <connections-graph :rowData="rowData" />
      </div>
    </div>
  </div>
  <br>
  <!-- Button to go back to the previous report view -->
  <button id="backButton" @click="goBack">Back to Table</button>
</template>

<script>
import ConnectionsGraph from "./ConnectionsGraph.vue"; // Importing the ConnectionsGraph component

export default {
  components: { ConnectionsGraph }, // Registering ConnectionsGraph component
  props: ["id"], // Accepting 'id' as a prop to fetch the specific row data
  data() {
    return {
      rowData: null, // Holds the data for the current row
      whitelisted_programs: [], // List of whitelisted programs (not used in this component)
      whitelisted_sources: [], // List of whitelisted sources
      whitelisted_destinations: [], // List of whitelisted destinations
      sourceWhitelisted: false, // Flag to track if source has been whitelisted
      destinationWhitelisted: false, // Flag to track if destination has been whitelisted
    };
  },
  mounted() {
    // Initialize localStorage values for whitelisted sources and destinations
    if (localStorage.getItem("whitelisted_destinations") != null) {
      this.whitelisted_destinations = JSON.parse(
        localStorage.getItem("whitelisted_destinations")
      );
    }
    if (localStorage.getItem("whitelisted_sources") != null) {
      this.whitelisted_sources = JSON.parse(
        localStorage.getItem("whitelisted_sources")
      );
    }
  },
  created() {
    // Fetch the row data for the given id
    this.fetchRowData();
  },
  methods: {
    // Fetch data for the row with the given 'id' from localStorage
    fetchRowData() {
      const allData = JSON.parse(localStorage.getItem("tableData")) || [];
      this.rowData = allData.find((row) => row.id === parseInt(this.id));
    },

    // Method to navigate back to the previous report page
    goBack() {
      this.$router.push("/report");
    },

    // Whitelist functions
    // Add the source to the whitelist and save to localStorage
    addSourceToWhitelist() {
      if (!this.whitelisted_sources.includes(this.rowData["source.ip"])) {
        this.whitelisted_sources.push(this.rowData["source.ip"]);
        localStorage.setItem(
          "whitelisted_sources",
          JSON.stringify(this.whitelisted_sources)
        );
      }
      this.sourceWhitelisted = true;
    },

    // Add the destination to the whitelist and save to localStorage
    addDestinationToWhitelist() {
      if (
        !this.whitelisted_destinations.includes(this.rowData["destination.ip"])
      ) {
        this.whitelisted_destinations.push(this.rowData["destination.ip"]);
        localStorage.setItem(
          "whitelisted_destinations",
          JSON.stringify(this.whitelisted_destinations)
        );
      }
      this.destinationWhitelisted = true;
    },
  },
};
</script>

<style scoped>
/* Container for the entire page */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

/* Wrapper for the content section */
.content-wrapper {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
}

/* Section for displaying the details of the row data */
.details-section {
  padding: 20px;
  flex: 1; /* Takes up 1 part of the space */
  min-width: 0;
  text-align: left;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Section for displaying the connections graph */
.graph-section {
  padding: 20px;
  flex: 2; /* Takes up 2 parts of the space */
  min-width: 0;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Styling for the lists in the details section */
.details-section ul {
  padding: 0;
  margin: 0;
}

/* Styling for each list item in the details section */
.details-section li {
  margin: 0;
  padding: 0;
}
</style>
