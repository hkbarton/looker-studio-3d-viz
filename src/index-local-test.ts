import { drawViz as draw3DScatterPlot } from "./scatter-plot-3d-internal";
import { drawViz as drawPie } from "./pie-chart-internal";
import { demoData } from "./three-chart/demo_data";

function main() {
  window.addEventListener("resize", () => {
    draw3DScatterPlot(demoData.youtubeSubscriber);
    drawPie();
  });
  draw3DScatterPlot(demoData.youtubeSubscriber);
  drawPie();
}

main();
