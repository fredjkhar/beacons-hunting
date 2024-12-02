<template>
  <div>
    <h2 id="graphTitle">Beacon Connection Frequency</h2>
    <h3 id="graphSubTitle">Date: Nov 15 2024, Hourly View</h3>
    <svg></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
export default {
  props: { rowData: Object || Array },
  data() {
    return {};
  },
  mounted() {
    const width = 800;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 45;

    // console.log(this.rowData);
    const rawRowData = {
      "source.ip": "0:0:0:0:0:0:0:1",
      "destination.ip": "0:0:0:0:0:0:0:1",
      TotalConnections: 25,
      ConnectionTimes: [
        "2024-11-15T00:00:00.000Z",
        "2024-11-15T01:00:00.000Z",
        "2024-11-15T02:00:00.000Z",
        "2024-11-15T03:00:00.000Z",
        "2024-11-15T04:00:00.000Z",
        "2024-11-15T05:00:00.000Z",
        "2024-11-15T06:00:00.000Z",
        "2024-11-15T07:00:00.000Z",
        "2024-11-15T08:00:00.000Z",
        "2024-11-15T09:00:00.000Z",
        "2024-11-15T10:00:00.000Z",
        "2024-11-15T11:00:00.000Z",
        "2024-11-15T12:00:00.000Z",
        "2024-11-15T13:00:00.000Z",
        "2024-11-15T14:00:00.000Z",
        "2024-11-15T15:00:00.000Z",
        "2024-11-15T16:00:00.000Z",
        "2024-11-15T17:00:00.000Z",
        "2024-11-15T18:00:00.000Z",
        "2024-11-15T19:00:00.000Z",
        "2024-11-15T20:00:00.000Z",
        "2024-11-15T21:00:00.000Z",
        "2024-11-15T22:00:00.000Z",
        "2024-11-15T23:00:00.000Z",
        "2024-11-16T00:00:00.000Z",
      ],
      "Skew score": 1,
      "MAD score": 1,
      "Count score": 1,
      Score: 1,
    };
    const connectionTimes = rawRowData.ConnectionTimes.map((val) => {
      return new Date(val);
    });
    const dates = [];
    for (let connectionTime of connectionTimes) {
      let date = connectionTime.toDateString();
      let dateIndex = dates.findIndex((connectionsDate) => {
        // console.log(connectionsDate);
        return connectionsDate.date === date;
      });
      if (dateIndex == -1) {
        dates.push({ date: date, connections: [connectionTime] });
      } else {
        dates[dateIndex].connections.push(connectionTime);
      }
    }
    // console.log(rawRowData.ConnectionTimes);
    // console.log(connectionTimes);
    // console.log(dates);

    const selectedDateIndex = 1;
    const selectedDateTimes = dates[selectedDateIndex].connections;
    // console.log(selectedDateTimes);
    // console.log(d3.utcHour.round(selectedDateTimes[0]).getHours());
    // console.log(
    //   d3.utcHour
    //     .round(selectedDateTimes[selectedDateTimes.length - 1])
    //     .getHours()
    // );

    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g");

    // const bins = d3.bin().thresholds(24).values((d) => d3.utcHour.round(d.connectionTime))(selectedDateTimes)
    const bins = d3
      .bin()
      .thresholds(() => { 
        let arr = []
        for (let i = 0; i < 25; i++) { arr[i] = i}
        // console.log(arr)
        return arr;
      })
      .domain([0, 24])
      // .thresholds(25)
      .value((d) => d3.utcHour.round(d).getHours())(selectedDateTimes);
    // console.log(bins);
    // console.log(bins.domain());

    const x = d3
      .scaleLinear()
      .domain([0, 24])
      .rangeRound([marginLeft, width - marginRight]);
    // x.ticks(100)

    // const x = d3
    //   .scaleTime()
    //   .domain([new Date(dates[0].date), new Date(dates[1].date)])
    //   .rangeRound([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, 5])
      .rangeRound([height - marginBottom, marginTop]);

    g.append("g")
      .attr("transform", "translate(0," + (height - marginBottom) + ")")
      .call(d3.axisBottom(x));

    // xAxis.ticks(24)

    g.append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .call(d3.axisLeft(y));

    g.append("g")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("x", -20)
      .attr("dy", "1em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g.append("g")
      .append("text")
      .attr("fill", "#000")
      // .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("dx", "4em")
      // .attr("x", 6)
      // .attr("dx", "0.5em")
      .attr("text-anchor", "end")
      .text("Time");

    // Add a rect for each bin.
    g.append("g")
      .attr("fill", "steelblue")
      .selectAll()
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0) + 5)
      .attr("width", (d) => x(d.x1) - x(d.x0) - 10)
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));
  },
};
</script>
