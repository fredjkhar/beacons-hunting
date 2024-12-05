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
        <button @click="addSourceToWhitelist" style="font-size: medium;">Add source to Whitelist</button>
        <br /><br />
        <button @click="addDestinationToWhitelist" style="font-size: medium;">Add destination to Whitelist</button>
      </div>

      <div class="graph-section">
        <connections-graph :rowData="rowData" />
      </div>
    </div>
  </div>
  
  <button @click="goBack">Back to Table</button>
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
    };
  },
  mounted() {
    // this.programs = this.rowData[8].split(" | ");
    if (localStorage.getItem("whitelisted_programs") != null) {
      this.whitelisted_programs = JSON.parse(
        localStorage.getItem("whitelisted_programs")
      );
    }
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
  min-width: 0;
  text-align: left;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.graph-section {
  padding: 20px;
  flex: 1;
  min-width: 0;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
