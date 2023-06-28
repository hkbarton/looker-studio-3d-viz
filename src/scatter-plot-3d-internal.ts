import { ThreeScatterPlot } from "./three-chart/ThreeScatterPlot";

export function drawViz(data: any) {
  // Container setup.
  const html = document.querySelector("html");
  if (html && html.style) {
    html.style.height = "100%";
  }
  const body = document.querySelector("body");
  if (body && body.style) {
    body.style.height = "100%";
  }
  let container = document.getElementById("container");
  if (container) {
    container.textContent = "";
  } else {
    container = document.createElement("div");
    container.id = "container";
    container.style.width = "100%";
    container.style.height = "100%";
    document.body.appendChild(container);
  }

  // Render the viz.
  new ThreeScatterPlot({
    container,
    data,
  });
}
