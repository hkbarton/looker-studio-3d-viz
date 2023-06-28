import { subscribeToData, objectTransform } from "@google/dscc";
import { drawViz } from "./pie-chart-internal";

subscribeToData(() => drawViz(), {
  transform: objectTransform,
});
