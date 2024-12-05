<template>
  <div class="graphContent">
    <h2 id="graphTitle">Beacon Connection Frequency</h2>
    <div v-show="false" class="mb-1">
      <select ref="selected-time-unit">
        <option disabled selected>Select a view</option>
        <option value="h">Hours</option>
        <option value="m">Minutes</option>
        <option value="s">Seconds</option>
      </select>
    </div>
    <svg></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: { rowData: Object || Array },
  mounted() {
    console.log(this.rowData)

    const width = 1000; // Fixed width
    const height = window.innerHeight * 0.5; // Set height to 50vh
    const marginTop = 25;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 50;
    const barOffset = 4;

    const _NUM_MINUTES_SECONDS = 60;
    const _NUM_HOURS = 24;

    let timeUnit = "m"; // Can be h/m/s
    let unitToNum = {
      h: _NUM_HOURS,
      m: _NUM_MINUTES_SECONDS,
      s: _NUM_MINUTES_SECONDS,
    };

    // Dummy data for testing
    let dummyTestData = {
      "source.ip": "0:0:0:0:0:0:0:1",
      "destination.ip": "0:0:0:0:0:0:0:1",
      TotalConnections: 25,
      ConnectionTimes: [
        "2024-11-15T00:00:00.000Z",
        "2024-11-15T01:00:00.000Z",
        "2024-11-15T02:00:00.000Z",
        // Other connection times...
      ],
      "Skew score": 1,
      "MAD score": 1,
      "Count score": 1,
      Score: 1,
    };

    const connectionTimes = this.rowData.ConnectionTimes.map((val) => new Date(val));
    const dates = [];

    for (let connectionTime of connectionTimes) {
      let date = connectionTime.toDateString();
      let dateIndex = dates.findIndex((connectionsDate) => connectionsDate.date === date);
      if (dateIndex == -1) {
        dates.push({ date: date, connections: [connectionTime] });
      } else {
        dates[dateIndex].connections.push(connectionTime);
      }
    }

    const selectedDateIndex = 0;
    const selectedDateTimes = dates[selectedDateIndex].connections;
    const selectedDate = dates[selectedDateIndex].date;

    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");

    let binFunc = {
      h: (d) => d3.utcHour.round(d).getHours(),
      m: (d) => d3.utcMinute.round(d).getMinutes(),
      s: (d) => d3.utcSecond.round(d).getSeconds(),
    };

    const bins = d3
      .bin()
      .thresholds(() => {
        let arr = [];
        for (let i = 0; i < unitToNum[timeUnit] + 1; i++) {
          arr[i] = i;
        }
        return arr;
      })
      .domain([0, unitToNum[timeUnit]])
      .value(binFunc[timeUnit])(selectedDateTimes);

    // Adjust scales based on the updated height
    const x = d3.scaleLinear().domain([0, unitToNum[timeUnit]]).rangeRound([marginLeft, width - marginRight]);
    x.ticks(unitToNum[timeUnit]);

    const y = d3.scaleLinear().domain([0, d3.max(bins, (d) => d.length)]).rangeRound([height - marginBottom, marginTop]);

    g.append("g")
      .attr("transform", "translate(0," + (height - marginBottom) + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y));

    // Y-axis label
    g.append("g")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("x", -20)
      .attr("dy", "1em")
      .attr("text-anchor", "end")
      .text("Frequency");

    // X-axis label
    g.append("g")
      .append("text")
      .attr("fill", "#000")
      .attr("y", 15)
      .attr("x", "50")
      .text("Time, in minutes");

    // Add bars to the graph
    g.append("g")
      .selectAll()
      .data(bins)
      .join("rect")
      .attr("fill", (d) => (d.x0 % 2 === 1 ? "steelblue" : "#38678f"))
      .attr("x", (d) => x(d.x0) + barOffset)
      .attr("width", (d) => x(d.x1) - x(d.x0) - barOffset * 2)
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));
  },
};
</script>

<style scoped>
</style>
