import { drawViz } from "./scatter-plot-3d";
import { demoData } from "./three-chart/demo_data";

function main() {
  window.addEventListener("resize", () => {
    drawViz(demoData.youtubeSubscriber);
  });
  drawViz(demoData.youtubeSubscriber);
}

main();
