<!-- ResultTable.vue -->

<template>
  <div class="container">
    <header>
      <h1>Beacon Scores</h1>
    </header>

    <div class="whitelist mb-2">
      <input
        type="text"
        v-model="whitelistText"
        placeholder="Enter whitelist text"
      />
      <button @click="submitWhitelist">Whitelist</button>
    </div>
    
    <div>
      <table v-if="data.length" class="result_table">
        <thead>
          <tr>
            <th v-for="key in headers" :key="key" @click="handleSort(key)">
              {{ key }}
              <span v-if="sortKey === key">
                {{ sortAsc ? "▲" : "▼" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in sortedData"
            :key="row.id"
            @click="rowClicked(row)"
            
          >
            <td v-for="key in headers" :key="key" :data-label="key" v-if="whitelistedRowTest(row)">
              {{ row[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  fetchBackendData,
  getSortedTableData,
  toggleSort,
} from "./ResultTable.js";

export default {
  data() {
    return {
      whitelistText: "",
      whitelist: null,
      data: [],
      sortKey: null,
      sortAsc: true,
      isLoading: false,
      error: null,
      whitelisted_programs: [],
      whitelisted_destinations: [],
      whitelisted_sources: [],
    };
  },
  async mounted() {
    this.isLoading = true;
    
    if(localStorage.getItem("whitelisted_programs") != null){
        this.whitelisted_programs = JSON.parse(localStorage.getItem("whitelisted_programs"));
    }
    if(localStorage.getItem("whitelisted_destinations") != null){
        this.whitelisted_destinations = JSON.parse(localStorage.getItem("whitelisted_destinations"));
    }
    if(localStorage.getItem("whitelisted_sources") != null){
        this.whitelisted_sources = JSON.parse(localStorage.getItem("whitelisted_sources"));
    }

    if(localStorage.getItem("tableData") != null){
      this.data = JSON.parse(localStorage.getItem("tableData"));
    }
    
  },
  computed: {
    headers() {
      // Exclude 'id' from headers
      return this.data.length
        ? Object.keys(this.data[0]).filter((key) => !(key === "id" || key === "ConnectionTimes"))
        : [];
    },
    sortedData() {
      return getSortedTableData(this.data, this.sortKey, this.sortAsc);
    },
  },
  methods: {
    rowClicked(row) {
      if (row && row.id !== undefined) {
        this.$router.push({ name: "Details", params: { id: row.id } });
      } else {
        console.error("Row ID not found");
      }
    },
    handleSort(key) {
      const { sortKey, sortAsc } = toggleSort(
        key,
        this.sortKey,
        this.sortAsc
      );
      this.sortKey = sortKey;
      this.sortAsc = sortAsc;
    },
    submitWhitelist() {
      this.whitelist = this.whitelistText;
    },
    checkWhitelist(row) {
      if (!this.whitelist) return true;
      return !Object.values(row).some((value) => {
        if (typeof value === "string") {
          return value.includes(this.whitelist);
        }
        if (Array.isArray(value)) {
          return value.some((item) => item.includes(this.whitelist));
        }
        return false;
      });
    },
    
    whitelistedRowTest(row) {
      const rowArray = Object.entries(row);

      // Check for whitelist matches
      const isWhitelisted = rowArray.some(([key, value]) => {
        if (this.whitelisted_sources && key === "source.ip") {
          return this.whitelisted_sources.includes(value);
        }
        if (this.whitelisted_destinations && key === "destination.ip") {
          return this.whitelisted_destinations.includes(value);
        }
        // Add more checks as needed
        return false;
      });
      return !isWhitelisted; // Return `false` to filter out the row
    }
  },
};
</script>
