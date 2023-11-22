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
    const depId = "font_helvetiker_bold";
    const depUrl =
      "https://storage.googleapis.com/testingviz/ls-3pviz-demo/fonts/helvetiker_bold.typeface.json";
    console.log(
      "get external data",
      JSON.parse(data.externalData[`${depId}[${depUrl}]`])
    );
  } else {
    console.log("get platform data", data);
  }
}, devLib.tableTransform);
