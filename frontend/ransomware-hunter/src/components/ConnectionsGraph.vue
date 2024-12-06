<template>
  <div class="graphContent">
    <h2 id="graphTitle">Beacon Connection Frequency</h2>

    <!-- Dropdown to select time unit for the graph (All, Hours, or Days) -->
    <div class="mb-1">
      <select id="selectedTU" ref="selectedTimeUnit" @change="updateGraph">
        <option disabled selected>Select a view</option>
        <option value="a">All</option>
        <option value="h">Hours</option>
        <option value="d">Days</option>
      </select>
    </div>

    <!-- Display the selected date for the graph -->
    <h3>{{ selectedDate }}</h3>

    <!-- Container for the D3 graph -->
    <div id="plotContainer" ref="plotContainer" style="width: 100%; height: 400px;"></div>

    <!-- Message for selecting a day view -->
    <h3 v-if="selectedTimeUnit == 'd'">Click on a bar to view hourly frequency of the selected day</h3>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  // Accept data as props
  props: { rowData: [Object, Array] },
  
  data() {
    return {
      selectedTimeUnit: "h", // Default to hours
      selectedDate: null, // Store the selected date when a bar is clicked
    };
  },

  mounted() {
    // Prepare data when the component is mounted
    this.prepareData();
  },

  methods: {
    // Handle bar click event to select a specific date
    onBarClick(barData) {
      this.selectedDate = barData.date; // Store the clicked date
    },

    // Prepare the data by parsing and grouping the connection times
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

      // Convert timestamps to Date objects
      if(this.rowData == null){
        this.data = dummyData.ConnectionTimes.map((d) => new Date(d));
      }
      else{

        this.data = this.rowData.ConnectionTimes.map((d) => new Date(d));
      }

      // Group data by day
      this.dataDay = Array.from(
        d3.rollup(
          this.data,
          (v) => v.length, // Frequency of each day
          (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}` // Format as YYYY-MM-DD
        ),
        ([date, frequency]) => ({
          date, // Formatted date
          frequency,
        })
      );

      // Group data by hour
      this.dataHour = Array.from(
        d3.rollup(
          this.data,
          (v) => v.length, // Frequency of each hour
          (d) => `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}-${d.getUTCHours()}` // Format as YYYY-MM-DD-HH
        ),
        ([hour, frequency]) => ({
          time: hour, // Formatted hour
          frequency,
        })
      );

      // Initialize the graph with the default time unit (hours)
      this.updateGraph();
    },

    // Update the graph based on the selected time unit
    updateGraph() {
      this.selectedTimeUnit = this.$refs.selectedTimeUnit.value; // Get selected time unit from the dropdown

      let dataToUse;
      let xScale;

      // Handle 'All' option by clearing the selected date
      if (this.selectedTimeUnit === "a") {
        this.selectedDate = null;
      }

      // If 'Days' is selected, use day-based data
      if (this.selectedTimeUnit === "d") {
        this.selectedDate = null;
        dataToUse = this.dataDay;
        xScale = d3.scaleBand()
          .domain(dataToUse.map((d) => d.date)) // X-axis based on days
          .range([50, 600])
          .padding(0.1);
      } else {
        // If 'Hours' is selected, use hour-based data and filter by date if needed
        if (this.selectedDate) {
          const filteredData = this.dataHour.filter((d) =>
            d.time.startsWith(this.selectedDate) // Filter by the selected date
          );
          dataToUse = filteredData;
        } else {
          dataToUse = this.dataHour; // Use all hour data
        }
        xScale = d3.scaleBand()
          .domain(dataToUse.map((d) => d.time)) // X-axis based on hours
          .range([50, 600])
          .padding(0.1);
      }

      // Define Y-axis scale based on frequency data
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataToUse, (d) => d.frequency)]) // Scale based on max frequency
        .nice()
        .range([400 - 40, 40]);

      // Create the SVG container for the graph
      const svg = d3.select(this.$refs.plotContainer).html("").append("svg")
        .attr("width", 700)
        .attr("height", 400);

      // Draw bars representing the data
      svg.selectAll("rect")
        .data(dataToUse)
        .join("rect")
        .attr("x", (d) => xScale(d.date || d.time)) // X-position based on date or time
        .attr("y", (d) => yScale(d.frequency)) // Y-position based on frequency
        .attr("width", xScale.bandwidth()) // Bar width based on xScale bandwidth
        .attr("height", (d) => 400 - 40 - yScale(d.frequency)) // Bar height
        .attr("fill", "steelblue")
        .on("click", (event, d) => {
          if (this.selectedTimeUnit === "d") {
            // If a day bar is clicked, switch to the hourly view
            this.selectedDate = d.date; // Set selected date
            this.$refs.selectedTimeUnit.value = "h"; // Change dropdown to hours
            this.updateGraph(); // Re-render the graph with the new time unit
          }
        });

      // Append X-axis to the graph, formatting date and time
      svg.append("g")
        .attr("transform", `translate(0, ${400 - 40})`)
        .call(d3.axisBottom(xScale).tickFormat((d) => {
          const dateParts = d.split('-'); // Split date and time parts
          const date = dateParts.slice(0, 3).join('-'); // Date part
          const time = dateParts[3] ? `${dateParts[3]}:00` : ""; // Time part (optional)
          return `\n${date} \n${time}`;
        }))
        .selectAll("text")
        .style("white-space", "pre") // Allow line breaks in axis labels
        .call((text) => {
          text.each(function (d) {
            const t = d3.select(this);
            const lines = t.text().split("\n");
            t.text(""); // Clear existing text

            // Add a tspan for each part (empty line, date, time)
            t.append("tspan").text("").attr("x", 0).attr("dy", "1em");
            t.append("tspan").text(lines[1]).attr("x", 0).attr("dy", "1.2em");
            t.append("tspan").text(lines[2]).attr("x", 0).attr("dy", "1.2em");
          });
        });

      // Append Y-axis to the graph
      svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale).tickFormat((d) => {
          return d % 1 === 0 ? d : ''; // Only display whole numbers on Y-axis
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
