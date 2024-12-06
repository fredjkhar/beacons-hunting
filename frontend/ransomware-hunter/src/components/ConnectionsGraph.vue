<template>
  <div class="graphContent">
    <h2 id="graphTitle">Beacon Connection Frequency</h2>
    <div class="mb-1">
      <select id="selectedTU" ref="selectedTimeUnit" @change="updateGraph">
        <option disabled selected>Select a view</option>
        <option value="a">All</option>
        <option value="h">Hours</option>
        <option value="d">Days</option>
      </select>
    </div>
    <h3>{{ selectedDate }}</h3>
    <div id="plotContainer" ref="plotContainer" style="width: 100%; height: 400px;"></div>
    <h3 v-if="selectedTimeUnit == 'd'">Click on a bar to view hourly frequency of the selected day</h3>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: { rowData: [Object, Array] },
  data() {
    return {
      selectedTimeUnit: "h", // Default to hours
      selectedDate: null, // Store the selected date when a bar is clicked
    };
  },
  mounted() {
    this.prepareData();
  },
  methods: {
    onBarClick(barData) {
    // Handle the bar click event
    this.selectedDate = barData.date;
  },
    prepareData() {
      const dummyData = {
        ConnectionTimes: [
          "2024-11-15T00:00:00.000Z",
          "2024-11-15T01:00:00.000Z",
          "2024-11-15T01:00:00.000Z",
          "2024-11-15T01:00:00.000Z",
          "2024-11-15T02:00:00.000Z",
          "2024-11-15T02:00:00.000Z",
          "2024-11-15T04:00:00.000Z",
          "2024-11-15T04:00:00.000Z",
          "2024-11-15T06:00:00.000Z",
          "2024-11-15T06:00:00.000Z",
          "2024-11-16T04:00:00.000Z",
          "2024-11-16T06:00:00.000Z",
          "2024-11-16T06:00:00.000Z",
        ],
      };

      // Convert to Date objects
      this.data = dummyData.ConnectionTimes.map((d) => new Date(d));

      // Group data by day
      this.dataDay = Array.from(
        d3.rollup(
          this.data,
          (v) => v.length,
          (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`
        ),
        ([date, frequency]) => ({
          date, // Formatted as YYYY-MM-DD
          frequency,
        })
      );

      // Group data by hour
      this.dataHour = Array.from(
        d3.rollup(
          this.data,
          (v) => v.length,
          (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}-${d.getUTCHours()}`
        ),
        ([hour, frequency]) => ({
          time: hour, // Formatted as YYYY-MM-DD-HH
          frequency,
        })
      );

      // Initialize the graph with the default time unit (hours)
      this.updateGraph();
    },
    updateGraph() {
      // Get the selected time unit from dropdown
      this.selectedTimeUnit = this.$refs.selectedTimeUnit.value;

      // Select the appropriate data based on the time unit
      let dataToUse;
      let xScale;

      // Check for 'All' option
      if (this.selectedTimeUnit === "a") {
        this.selectedDate = null; // Clear selected date
      }

      if (this.selectedTimeUnit === "d") {
        // Use day data
        this.selectedDate = null;
        dataToUse = this.dataDay;
        xScale = d3.scaleBand()
          .domain(dataToUse.map((d) => d.date)) // Use formatted "YYYY-MM-DD"
          .range([50, 600])
          .padding(0.1);
      } else {
        // Use hour data, filter by selected date if set
        if (this.selectedDate) {
          const filteredData = this.dataHour.filter((d) =>
            d.time.startsWith(this.selectedDate) // Filter by selected day
          );
          dataToUse = filteredData;
        } else {
          // Use all hour data if no date is selected
          dataToUse = this.dataHour;
        }
        xScale = d3.scaleBand()
          .domain(dataToUse.map((d) => d.time)) // Use formatted "YYYY-MM-DD-HH"
          .range([50, 600])
          .padding(0.1);
      }

      // Y-axis scale based on frequency data
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataToUse, (d) => d.frequency)])
        .nice()
        .range([400 - 40, 40]);

      // Create the SVG container
      const svg = d3.select(this.$refs.plotContainer).html("").append("svg")
        .attr("width", 700)
        .attr("height", 400);

      // Draw the bars
      svg.selectAll("rect")
        .data(dataToUse)
        .join("rect")
        .attr("x", (d) => xScale(d.date || d.time)) // Use formatted "YYYY-MM-DD" or "YYYY-MM-DD-HH"
        .attr("y", (d) => yScale(d.frequency))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => 400 - 40 - yScale(d.frequency))
        .attr("fill", "steelblue")
        .on("click", (event, d) => {
          if (this.selectedTimeUnit === "d") {
            // When a day bar is clicked, switch to the hour view
            this.selectedDate = d.date; // Store the selected date
            this.$refs.selectedTimeUnit.value = "h"
            this.updateGraph(); // Update the graph with the new time unit
          }
        });

      // Append the X-axis (display only hours in day view)
      svg.append("g")
        .attr("transform", `translate(0, ${400 - 40})`)
        .call(d3.axisBottom(xScale).tickFormat((d) => {
          // Split the date-time string into its components
          const dateParts = d.split('-');
          const date = dateParts.slice(0, 3).join('-'); // Date part (YYYY-MM-DD)
          if(dateParts[3] != null){
            const time = dateParts[3] + ":00"; // Time part (HH:00)
            return `\n${date} \n${time}`;
          }
          else{
            const time = "";
            return `\n${date} \n${time}`;
          }

          // Format the x-axis tick text
           // Add an empty line before the date
        }))
        .selectAll("text")
        .style("white-space", "pre") // Ensure line breaks are respected
        .call((text) => {
          // Add a tspan for the empty line, date, and time
          text.each(function (d) {
            const t = d3.select(this);
            const lines = t.text().split("\n");
            t.text(""); // Clear existing text

            // Add an empty line (first tspan)
            t.append("tspan")
              .text("") // Empty line before the date
              .attr("x", 0)
              .attr("dy", "1em"); // Slight vertical shift for the empty line

            // Add the date (second tspan)
            t.append("tspan")
              .text(lines[1]) // Date
              .attr("x", 0)
              .attr("dy", "1.2em"); // Second line (date)

            // Add the time (third tspan)
            t.append("tspan")
              .text(lines[2]) // Time
              .attr("x", 0)
              .attr("dy", "1.2em"); // Third line (time)
          });
        });


      // Append the Y-axis (only show whole number ticks)
      svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale).tickFormat((d) => {
          return d % 1 === 0 ? d : ''; // Only show whole numbers
        }));
    }


  },
};
</script>

<style scoped>
.graphContent {
  margin: 20px;
}

#graphTitle {
  text-align: center;
}

.mb-1 {
  margin-bottom: 10px;
}
</style>
