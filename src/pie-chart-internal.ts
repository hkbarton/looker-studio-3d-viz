import "./google-chart/loader.js";

declare var google: any;

export function drawViz() {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    let container = document.getElementById("pieContainer");
    if (container) {
      container.textContent = "";
    } else {
      container = document.createElement("div");
      container.id = "pieContainer";
      container.style.width = "100%";
      container.style.height = "100%";
      document.body.appendChild(container);
    }

    // Define the chart to be drawn.
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Element");
    data.addColumn("number", "Percentage");
    data.addRows([
      ["Nitrogen", 0.78],
      ["Oxygen", 0.21],
      ["Other", 0.01],
    ]);

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(
      document.getElementById("pieContainer")
    );
    chart.draw(data, null);
  }
}
