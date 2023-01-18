import { subscribeToData, objectTransform } from "@google/dscc";
import { ThreeScatterPlot } from "./three-chart/ThreeScatterPlot";
import { demoData } from "./three-chart/demo_data";

function drawViz(data: any) {
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
    data: demoData.youtubeSubscriber,
  });
}

// Subscribe to data and style changes. Use the table format for data.
subscribeToData(drawViz, { transform: objectTransform });
