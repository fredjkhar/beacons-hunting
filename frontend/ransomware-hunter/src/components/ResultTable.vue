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
            v-if="checkWhitelist(row)"
          >
            <td v-for="key in headers" :key="key" :data-label="key">
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
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const backendData = await fetchBackendData(
        "http://127.0.0.1:8000/api/get/"
      );
      this.data = backendData.map((item, index) => {
        const { "ConnectionTimes": _, ...rest } = item; // Use exact field name
        return {
          id: index + 1, // Start IDs from 1
          ...rest,
        };
      });

      // Store the data in localStorage
      localStorage.setItem("tableData", JSON.stringify(this.data));
    } catch (error) {
      console.error("Error during fetch:", error);
      this.error = "Failed to load data.";
    } finally {
      this.isLoading = false;
    }
  },
  computed: {
    headers() {
      // Exclude 'id' from headers
      return this.data.length
        ? Object.keys(this.data[0]).filter((key) => key !== "id")
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
  },
};
</script>