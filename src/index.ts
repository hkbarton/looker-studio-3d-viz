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
  if (data.type === "EXTERNAL_DATA") {
    const depUrl =
      "https://storage.googleapis.com/testingviz/ls-3pviz-demo/fonts/helvetiker_bold.typeface.json";
    const externalData = data.externalData[depUrl];
    console.log("get external data", {
      status: externalData.statusCode,
      data: JSON.parse(externalData.response),
    });
  } else {
    console.log("get platform data", data);
  }
}, devLib.tableTransform);
