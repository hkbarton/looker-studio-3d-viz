import { drawViz } from "./scatter-plot-3d";
import { demoData } from "./three-chart/demo_data";

declare global {
  interface Window {
    google: {
      lookerstudio: any;
    };
  }
}

const devLib = window.google.lookerstudio;

// TODO remove mock data
devLib.registerVisualization((data: any) => {
  drawViz(demoData.youtubeSubscriber);
  console.log(data);
}, devLib.tableTransform);
