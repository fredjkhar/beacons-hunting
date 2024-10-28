<template>
    <h1>Result Table</h1>

    <div name="whitelist">
        <input type="text" id="whitelistText" v-model="whitelistText">
        <button @click="submitWhitelist()">Whitelist</button>
    </div>

    <div v-if="rowSelected == false">
        <br /><br />
        <table v-if="tableData.length" class="result_table">
            <thead>
                <tr>
                    <th v-for="(header, index) in tableData[0]" :key="index" @click="handleSort(index)">
                        {{ header }}
                        <span v-if="sortColumn === index">
                            {{ sortAsc ? '▲' : '▼' }}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in sortedTableData" :key="rowIndex" @click="rowClicked(row)">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex" v-if="checkWhitelist(row)">{{ cell }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <RowExpandView v-if="rowSelected" :row="selectedRow" @closeView="closeRowExpandView"/>
</template>

<script>
import RowExpandView from './RowExpandView.vue';
import { fetchCSVData, parseCSV, getSortedTableData, sortTable } from './ResultTable.js';

export default {
    components: {
        RowExpandView
    },
    data() {
        return {
            whitelistText: '',
            whitelist: null,
            tableData: [], // Stores the parsed CSV data
            rowSelected: false,
            selectedRow: null,
            sortColumn: null, // Tracks the index of the column to sort by
            sortAsc: true,    // Tracks sorting direction: true = ascending, false = descending
        };
    },
    async mounted() {
        const csvData = await fetchCSVData('./sheets/final_results.csv');
        this.tableData = parseCSV(csvData);
    },
    // automaticaly updates the values of sorted table
    computed: {
        sortedTableData() {
            return getSortedTableData(this.tableData, this.sortColumn, this.sortAsc); // Pass the data to the external function
        }
    },
    methods: {
        rowClicked(row) {
            if (row != null) {
                this.selectedRow = row;
                this.rowSelected = true;
            }
        },
        closeRowExpandView() {
            this.rowSelected = false;
        },
        handleSort(index) {
            const { sortColumn, sortAsc } = sortTable(index, this.sortColumn, this.sortAsc);
            this.sortColumn = sortColumn;
            this.sortAsc = sortAsc;
        },
        submitWhitelist(){
            this.whitelist = this.whitelistText;
            this.handleSort();
        },
        // checkWhitelist(row){
        //     // If whitelist is empty or not set, display the row
        //     if (!this.whitelist) return true;
        //     console.log(this.whitelist + "|||||" + row)

        //     if(row != null || row != ""){
        //         if(row.includes(this.whitelist)){
        //             return false;
        //         }
        //         else{
        //             return true;
        //         }
        //     }
        // }
        checkWhitelist(row) {
            // If whitelist is empty or not set, display the row
            if (!this.whitelist) return true;

            console.log(`${this.whitelist} ||||| ${JSON.stringify(row)}`);

            // Check each cell in the row
            return !row.some(cell => {
                if (typeof cell === 'string') {
                    // Check if the string contains the whitelist text
                    return cell.includes(this.whitelist);
                } else if (Array.isArray(cell)) {
                    // Check if any item in the array contains the whitelist text
                    return cell.some(item => item.includes(this.whitelist));
                }
                return false; // If cell is not a string or array, it doesn't contain the text
            });
        }
    }
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

.result_table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.result_table th {
    background-color: #0f2a54;
    color: white;
}
</style>