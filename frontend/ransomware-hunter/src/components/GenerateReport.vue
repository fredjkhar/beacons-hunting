<template>
  <div class="content">
    <h1>Generate Report</h1>

    <br>

    <p>Pick a start and end date to generate a report for a specific date/time range</p>
    <p>Or leave blank to generate a report from the past 24 hours</p>

    <div class="date-time-box">
      <div class="date-time">
        <label>Start date</label>
        <input type="datetime-local" v-model="startDate">
      </div>

      <div class="date-time">
        <label>End date</label>
        <input type="datetime-local" v-model="endDate">
      </div>
    </div>

    <button @click="generateReport()">Generate</button>
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
      restultData: [],
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
    console.log(this.startDate)
    console.log(this.endDate)
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
    async generateReport() {
      // console.log("Generating report from", this.startDate, "to", this.endDate);

      let backendData;
      if (this.startDate == null || this.endDate == null) {
        backendData = await fetchBackendData(
          "http://backend:8000/api/get/"
        );
      }
      else {
        backendData = await fetchBackendDataWithDates(
          "http://backend:8000/api/get/",
          this.startDate,
          this.endDate
        );
      }
      this.data = backendData.map((item, index) => {
        return {
          id: index + 1, // Start IDs from 1
          ...item,
        };
      });

      // Store the data in localStorage
      localStorage.setItem("tableData", JSON.stringify(this.data));

      console.log(this.data)
    },
  },
};
</script>

<style>
.content {
  display: flex;
  /* Enable Flexbox layout */
  flex-direction: column;
  /* Stack children vertically */
  /* justify-content: center; Center vertically */
  align-items: center;
  /* Center horizontally */
  text-align: center;
}

h1 {
  margin-top: 0;
}

.date-time-box {
  background-color: #f4f4f4;
  color: #333;
  padding: 20px;
  width: 30vw;
  margin: 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #333;
  color: #f2f2f2;
  font-weight: bold;
}

/* General styling for datetime-local input */
input[type="datetime-local"] {
  width: 100%;
  /* Adjust width */
  padding: 10px;
  /* Inner padding for better spacing */
  font-size: 16px;
  /* Adjust font size */
  border: 2px solid #333;
  /* Border color and thickness */
  border-radius: 5px;
  /* Rounded corners */
  background-color: #f9f9f9;
  /* Background color */
  color: #333;
  /* Text color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* Optional: Shadow for better visuals */
  outline: none;
  /* Remove the default blue border when focused */
}

/* Change appearance when focused */
input[type="datetime-local"]:focus {
  border-color: #333;
  box-shadow: 0 0 5px rgba(4, 170, 109, 0.5);
  /* Subtle glow effect */
}

/* Styling placeholder text (if present) */
input[type="datetime-local"]::placeholder {
  color: #999;
  /* Lighter gray for placeholder */
  font-style: italic;
  /* Optional: Italic placeholder */
}

/* Disabled state */
input[type="datetime-local"]:disabled {
  background-color: #e0e0e0;
  /* Gray background for disabled input */
  color: #999;
  /* Gray text color */
  cursor: not-allowed;
  /* Change cursor to indicate non-interactivity */
}
</style>
