<!-- DetailPage.vue -->

<template>
  <div class="container">
    <h1>Beacon Score</h1>
    <div v-if="rowData">
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
      <div v-if="rowData">
        <connections-graph :rowData="rowData" />
      </div>
    </div>
    <button @click="goBack">Back to Table</button>
    <!-- Whitelist Start -->
    <button @click="addSourceToWhitelist">Add source to Whitelist</button>
    <br />
    <button @click="addDestinationToWhitelist">
      Add destination to Whitelist
    </button>
    <br />
  </div>
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
      this.$router.push("/");
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
    // addProgramToWhitelist(){
    //   if (this.selectedProgram && !this.whitelisted_programs.includes(this.selectedProgram)) {
    //     this.whitelisted_programs.push(this.selectedProgram)
    //     localStorage.setItem("whitelisted_programs", JSON.stringify(this.whitelisted_programs));
    //   }
    // }
  },
};
</script>
