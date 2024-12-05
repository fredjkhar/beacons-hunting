<template>
  <div class="content">
    <h1>Generate Report</h1>

    <br>

    <div class="generator-container">
      <!-- Content displayed when not loading -->
      <div v-show="!loading">
        <p>Pick a start and end date to generate a report for a specific date/time range</p>
        <p>Or leave blank to generate a report from the past 24 hours</p>

        <div class="date-time-box">
          <div class="date-time">
            <label>Start date</label>
            <input type="datetime-local" v-model="startDate" />
          </div>

          <div class="date-time">
            <label>End date</label>
            <input type="datetime-local" v-model="endDate" />
          </div>
        </div>

        <button @click="generateReport()" :disabled="!isDateRangeValid()">Generate</button>
      </div>

      <!-- Loader displayed when loading -->
      <div v-show="loading" class="loader-container">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchBackendData,
  fetchBackendDataWithDates,
  getSortedTableData,
  toggleSort,
} from "./ResultTable.js";

export default {
  data() {
    return {
      startDate: '', // Holds the start date
      endDate: '', // Holds the end date
      resultData: [],
      loading: false,
    };
  },
  async mounted() {
    // Set the default dates
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    // Format dates to match the `datetime-local` input requirements
    this.endDate = this.formatDate(now);
    this.startDate = this.formatDate(yesterday);
    // console.log(this.startDate)
    // console.log(this.endDate)
  },
  methods: {
    // Formats a date to `YYYY-MM-DDTHH:mm` for `datetime-local`
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    isDateRangeValid() {
      return new Date(this.startDate) <= new Date(this.endDate);
    },
    async generateReport() {
      this.loading = true;
      try {
          let backendData;
          if (!this.startDate || !this.endDate) {
              backendData = await fetchBackendData("http://34.67.212.1:8000/api/get/");
          } else {
              backendData = await fetchBackendDataWithDates(
                  "http://34.67.212.1:8000/api/get/",
                  this.startDate,
                  this.endDate
              );
          }
          this.resultData = backendData.map((item, index) => ({
              id: index + 1,
              ...item,
          }));
          localStorage.setItem("tableData", JSON.stringify(this.resultData));
      } catch (error) {
          console.error("Error fetching data:", error);
          alert("Failed to generate report. Please try again.");
      } finally {
          this.loading = false;
          if(this.resultData.length != 0) {
            this.$router.push("/report");
          }
      }
    }
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

h1 {
  margin-top: 0;
}

.generator-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-time-box {
  background-color: #f4f4f4;
  color: #333;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #333;
  color: #f2f2f2;
  font-weight: bold;
}

input[type="datetime-local"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #333;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
}

input[type="datetime-local"]:focus {
  border-color: #333;
  box-shadow: 0 0 5px rgba(4, 170, 109, 0.5);
}

input[type="datetime-local"]:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.spinner {
  width: 56px;
  height: 56px;
  display: grid;
  border: 4.5px solid #0000;
  border-radius: 50%;
  border-right-color: #333333;
  animation: spinner-a4dj62 1s infinite linear;
}

.spinner::before,
.spinner::after {
  content: "";
  grid-area: 1/1;
  margin: 2.2px;
  border: inherit;
  border-radius: 50%;
  animation: spinner-a4dj62 2s infinite;
}

.spinner::after {
  margin: 8.9px;
  animation-duration: 3s;
}

@keyframes spinner-a4dj62 {
  100% {
    transform: rotate(1turn);
  }
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Matches the height of the parent */
}
</style>