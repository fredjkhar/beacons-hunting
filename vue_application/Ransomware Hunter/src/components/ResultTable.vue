<template>
    <h1>Result Table</h1>

    <div v-if="rowSelected == false">
        <!-- To pick a csv file -->
        <!-- <input type="file" @change="handleFileUpload" accept=".csv" /> -->
        <br /><br />
        <table v-if="tableData.length" class="result_table">
        <thead>
            <tr>
            <th v-for="(header, index) in tableData[0]" :key="index">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in tableData.slice(1)" :key="rowIndex" @click="rowClicked(row)">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
            </tr>
        </tbody>
        </table>
    </div>

    <RowExpandView v-if="rowSelected" :row="selectedRow" @closeView="closeRowExpandView"/>
</template>

<!-- To pick a csv file -->
<!-- <script>
import RowExpandView from './RowExpandView.vue';

export default {
    components: {
        RowExpandView
    },
    data() {
        return {
        tableData: [], // Stores the parsed CSV data
        rowSelected: false,
        selectedRow: null,
        };
    },
    methods: {
        handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            this.tableData = this.parseCSV("./sheets/final_results - Copy.csv");
        };
        reader.readAsText(file);
        },

        parseCSV(csv) {
        const rows = csv.split("\n"); // Split by new lines to get rows
        return rows.map((row) => row.split(",")); // Split each row by comma
        },

        rowClicked(row){
            console.log("Row clicked =", row);
            this.selectedRow = row;
            this.rowSelected = true;
        }
    },
};
</script> -->

<!-- CSV in public/sheets -->
<script>
import RowExpandView from './RowExpandView.vue';
export default {
    components: {
        RowExpandView
    },
    data() {
        return {
        tableData: [], // Stores the parsed CSV data
        rowSelected: false,
        selectedRow: null,
        };
    },
    mounted() {
        // Call the function to fetch and load the CSV when the component is mounted
        this.fetchCSVData();
    },
    methods: {
        async fetchCSVData() {
        try {
            const response = await fetch('./sheets/final_results - Copy.csv');
            if (!response.ok) {
                throw new Error('Failed to load the CSV file');
            }
            const csv = await response.text();
            this.tableData = this.parseCSV(csv);
        } catch (error) {
            console.error(error.message);
        }
        },
        parseCSV(csv) {
            const rows = csv.split('\n').map((row) => row.trim());
            return rows.map((row) => row.split(',').map((cell) => cell.trim()));
        },
        rowClicked(row) {
            console.log('Row clicked =', row);
            this.selectedRow = row;
            this.rowSelected = true;
        },
        closeRowExpandView() {
          this.rowSelected = false; // Close the view when the event is emitted
        },
    },
};
</script>


<style scoped>
.result_table {
  border-collapse: collapse;
  width: 98vw; /* Full viewport width */
  table-layout: fixed; /* Ensures equal column width */
}

.result_table tr, td {
  text-align: left;
  padding: 8px;
  overflow: hidden; /* Hide overflow */
  white-space: nowrap; /* Prevent wrapping */
}

.result_table tr:nth-child(even){
  background-color: #f2f2f2;
}

.result_table th {
  background-color: #0f2a54;
  color: white;
}
</style>
