<template>
  <div class="container">
    <h1>Beacon Score</h1>
    <div v-if="rowData" class="content-wrapper">
      <div class="details-section">
        <div v-for="(value, key) in rowData" :key="key" class="mb-1">
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
          <div v-else>
            <strong>{{ key }}:</strong> {{ value }}
          </div>
        </div>

        <br />
        <button id="whitelistButtonSource" v-if="!sourceWhitelisted" @click="addSourceToWhitelist" style="font-size: medium;">Add source to Whitelist</button>
        <p v-if="sourceWhitelisted"><strong>Source has been whitelisted</strong></p>
        <br v-if="!sourceWhitelisted"/><br />
        <button id="whitelistButtonDestination" v-if="!destinationWhitelisted" @click="addDestinationToWhitelist" style="font-size: medium;">Add destination to Whitelist</button>
        <p v-if="destinationWhitelisted"><strong>Destination has been whitelisted</strong></p>
      </div>

      <div class="graph-section">
        <connections-graph :rowData="rowData" />
      </div>
    </div>
  </div>
  <br>
  <button id="backButton" @click="goBack">Back to Table</button>
</template>


<script>
import ConnectionsGraph from "./ConnectionsGraph.vue";
export default {
  components: { ConnectionsGraph },
  props: ["id"],
  data() {
    return {
      rowData: null,
      whitelisted_programs: [],
      whitelisted_sources: [],
      whitelisted_destinations: [],
      sourceWhitelisted: false,
      destinationWhitelisted: false,
    };
  },
  mounted() {
    // this.programs = this.rowData[8].split(" | ");
    // if (localStorage.getItem("whitelisted_programs") != null) {
    //   this.whitelisted_programs = JSON.parse(
    //     localStorage.getItem("whitelisted_programs")
    //   );
    // }
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
    this.fetchRowData();
    // if (this.rowData == null) {
    //   this.rowData = {
    //     "source.ip": "0:0:0:0:0:0:0:1",
    //     "destination.ip": "0:0:0:0:0:0:0:1",
    //     TotalConnections: 25,
    //     ConnectionTimes: [
    //       "2024-11-15T00:00:00.000Z",
    //       "2024-11-15T01:00:00.000Z",
    //       "2024-11-15T01:00:00.000Z",
    //       "2024-11-15T01:00:00.000Z",
    //       "2024-11-15T02:00:00.000Z",
    //       "2024-11-15T02:00:00.000Z",
    //       "2024-11-15T04:00:00.000Z",
    //       "2024-11-15T04:00:00.000Z",
    //       "2024-11-15T06:00:00.000Z",
    //       "2024-11-15T06:00:00.000Z",
    //       "2024-11-16T04:00:00.000Z",
    //       "2024-11-16T06:00:00.000Z",
    //       "2024-11-16T06:00:00.000Z",
    //     ],
    //     "Skew score": 1,
    //     "MAD score": 1,
    //     "Count score": 1,
    //     Score: 1,
    //   };
    // }
  },
  methods: {
    fetchRowData() {
      const allData = JSON.parse(localStorage.getItem("tableData")) || [];
      this.rowData = allData.find((row) => row.id === parseInt(this.id));
    },
    goBack() {
      this.$router.push("/report");
    },

    // Whitelist functions
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
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;

}

.details-section {
  padding: 20px;
  flex: 1;
  /* Takes up 1 part of the space */
  min-width: 0;
  text-align: left;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.graph-section {
  padding: 20px;
  flex: 2;
  /* Takes up 2 parts of the space */
  min-width: 0;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.details-section ul {
  padding: 0;
  margin: 0;
}

.details-section li {
  margin: 0;
  padding: 0;
}
</style>
