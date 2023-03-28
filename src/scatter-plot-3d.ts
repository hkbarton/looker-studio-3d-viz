import { ThreeScatterPlot } from "./three-chart/ThreeScatterPlot";

export function drawViz(data: any) {
  // Container setup.
  let container = document.getElementById("container");
  if (container) {
    container.textContent = "";
  } else {
    container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);
  }

  // Render the viz.
  new ThreeScatterPlot({
    container,
    data,
  });
}
