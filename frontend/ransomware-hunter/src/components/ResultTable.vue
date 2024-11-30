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

    this.data = JSON.parse(localStorage.getItem("tableData"));
    console.log(this.data)

    // try {
    //   // this.whitelisted_programs = JSON.parse(localStorage.getItem("whitelisted_programs"));
    //   // this.whitelisted_destinations = JSON.parse(localStorage.getItem("whitelisted_destinations"));
    //   // this.whitelisted_sources = JSON.parse(localStorage.getItem("whitelisted_sources"));

    //   // localStorage.setItem("tableData", JSON.stringify(this.data));

    //   const backendData = await fetchBackendData(
    //     "http://34.67.212.1:8000/api/get/"  
    //   );
    //   this.data = backendData.map((item, index) => {
    //     const { "ConnectionTimes": _, ...rest } = item; // Use exact field name
    //     return {
    //       id: index + 1, // Start IDs from 1
    //       ...rest,
    //     };
    //   });

    //   // Store the data in localStorage
    //   localStorage.setItem("tableData", JSON.stringify(this.data));
    // } catch (error) {
    //   console.error("Error during fetch:", error);
    //   this.error = "Failed to load data.";
    // } finally {
    //   this.isLoading = false;
    // }
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
    // // // // // // // // // // // // // // // // // // // //
    // Using whitelisted items from local storage to filter results
    // checkWhitelistTest(row) {
    //   console.log("HERE")
    //   if(this.whitelisted_programs) {
    //     if(this.whitelisted_programs.some((program) => row.program?.includes(program))){
    //       return false;
    //     }
    //   }
    //   if(this.whitelisted_destination){
    //     if(this.whitelisted_destinations.some((destination) => row.destination?.includes(destination))){
    //       return false;
    //     }
    //   }
    //   if(this.whitelisted_sources){
    //     if(this.whitelisted_sources.some((source) => row.source?.includes(source))){
    //       return false;
    //     }
    //   }
    //   return true
    // }

    // whitelistedRowTest(row) {
    //   console.log(row)
    //   if (this.whitelisted_programs && this.ba) {
    //     // Ensure `row.program` exists before accessing `.includes`
    //     if (
    //       this.whitelisted_programs.some((program) =>
    //         row.program?.includes(program)
    //       )
    //     ) {
    //       return false;
    //     }
    //   }

    //   if (this.whitelisted_destinations) {
    //     // Ensure `row.destination` exists before accessing `.includes`
    //     if (
    //       this.whitelisted_destinations.some((destination) =>
    //         row.destination?.includes(destination)
    //       )
    //     ) {
    //       return false;
    //     }
    //   }

    //   if (this.whitelisted_sources) {
    //     // Ensure `row.source` exists before accessing `.includes`
    //     if (
    //       this.whitelisted_sources.some((source) =>
    //         row.source?.includes(source)
    //       )
    //     ) {
    //       return false;
    //     }
    //   }

    //   return true;
    // }
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