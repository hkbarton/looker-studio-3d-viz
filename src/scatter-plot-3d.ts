import { subscribeToData, objectTransform } from "@google/dscc";
import { demoData } from "./three-chart/demo_data";
import { drawViz } from "./scatter-plot-3d-internal";

// Subscribe to data and style changes. Use the table format for data.
// TODO remove mock data
subscribeToData(() => drawViz(demoData.youtubeSubscriber), {
  transform: objectTransform,
});
