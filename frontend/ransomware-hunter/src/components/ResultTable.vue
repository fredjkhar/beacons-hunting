<template>
  <div class="container">
    <h1>Beacon Scores</h1>
    <div class="table-container">
      <table v-if="data.length" class="result-table">
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
          <tr v-for="row in sortedData" :key="row.id" @click="rowClicked(row)" class="clickable-row">
            <td v-for="key in headers" :key="key" :data-label="key" v-if="whitelistedRowTest(row)">
              {{ row[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div v-else class="no-data">No data available.</div> -->
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

    if (localStorage.getItem("whitelisted_programs") != null) {
      this.whitelisted_programs = JSON.parse(localStorage.getItem("whitelisted_programs"));
    }
    if (localStorage.getItem("whitelisted_destinations") != null) {
      this.whitelisted_destinations = JSON.parse(localStorage.getItem("whitelisted_destinations"));
    }
    if (localStorage.getItem("whitelisted_sources") != null) {
      this.whitelisted_sources = JSON.parse(localStorage.getItem("whitelisted_sources"));
    }

    if (localStorage.getItem("tableData") != null) {
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

<style scoped>
/* Header Styling */
header h1 {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Table Container */
.table-container {
  overflow-x: auto;
  /* Enables horizontal scrolling if needed */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fefefe;
  width: 90vw;
  /* Adjust this if a different percentage is preferred */
  margin: 0 auto;
  /* Center the container */
  max-width: 100%;
  /* Ensure it doesn't exceed the viewport width */
  display: flex;
  justify-content: center;
  /* Center the content within the container */
}

/* Table Styling */
.result-table {
  width: 100%;
  /* Ensures the table stretches to fit the container */
  border-collapse: collapse;
  /* Prevents double borders */
  table-layout: auto;
  /* Allows columns to resize naturally */
}

.result-table thead {
  background-color: #333;
  color: white;
}

.result-table th,
.result-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  /* Prevents text wrapping, can remove if wrapping is fine */
}

.result-table th:hover {
  background-color: #ddd;
  color: black;
}

.result-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.result-table tbody tr:hover {
  background-color: #f1f8ff;
}

.result-table .clickable-row:hover {
  background-color: #e0f7fa;
  transition: background-color 0.3s ease;
}
</style>
