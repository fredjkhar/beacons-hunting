<template>
    <div>
        <h1>Generate Report</h1>

        <label>Start date</label>
        <input type="datetime-local" v-model="startDate">

        <br />

        <label>End date</label>
        <input type="datetime-local" v-model="endDate">

        <br />

        <button @click="generateReport()">Generate</button>
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
                startDate: '', // Holds the start date
                endDate: '', // Holds the end date
                data: [],
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
                console.log("Generating report from", this.startDate, "to", this.endDate);

                const backendData = await fetchBackendData(
                    "http://34.67.212.1:8000/api/get/"  
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

                console.log(this.data)

                // Add logic for generating the report
                // api/get with start and end dates // This will replace the api/get in the ResultTable page
                // store in localStorage
                // route to Result Table
            },
        },
    };
</script>

<style>

</style>