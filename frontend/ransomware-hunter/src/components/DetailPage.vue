<!-- DetailPage.vue -->

<template>
    <div class="container">
      <h1>Beacon Score</h1>
      <div v-if="rowData">
        <div v-for="(value, key) in rowData" :key="key" class="mb-1">
          <strong>{{ key }}:</strong> {{ value }}
        </div>
      </div>
      <button @click="goBack">Back to Table</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ["id"],
    data() {
      return {
        rowData: null,
      };
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
    },
  };
  </script>