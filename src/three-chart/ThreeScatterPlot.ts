import * as THREE from "three"; // from //third_party/javascript/threejs/r134/typings

import { Chart, ChartObject } from "./Chart";
import { AXES_MARGIN, AXES_UNIT_SIZE, createAxes } from "./utils/axes_helper";
import { three } from "./utils/three_shim";

const CATEGORY_COLORS = [0x4c91c1, 0xf0882d, 0xdc3545];
const CATEGORY_COLORS_FOCUS = [0x2df4e0, 0xf8d10e, 0xdc3545];

/**
 * 3D Scatter Plot chart
 */
export class ThreeScatterPlot extends Chart {
  private chartObjects: ChartObject[] = [];
  private selectedChartObject: ChartObject | null = null;

  renderChart(): ChartObject[] {
    this.chartObjects = [];

    if (!this.config.data) {
      return this.chartObjects;
    }

    const { data, dimensions } = this.config.data;
    if (dimensions.length < 3) {
      // draw error
      throw new Error("too little dimensions");
    }
    // distintic values of dimensions x, y and z, and category values
    const dx = dimensions[0];
    const dy = dimensions[1];
    const dz = dimensions[2];
    const dc = dimensions.length > 3 ? dimensions[3] : null;
    const dxValues = new Set<string>(),
      dyValues = new Set<string>(),
      dzValues = new Set<string>(),
      dcValues = new Set<string>();
    for (const item of data) {
      dxValues.add(String(item[dx]));
      dyValues.add(String(item[dy]));
      dzValues.add(String(item[dz]));
      if (dc) {
        dcValues.add(String(item[dc]));
      }
    }

    // draw axes
    const { xValueByIdx, yValueByIdx, zValueByIdx } = createAxes(
      this.scene,
      Array.from(dxValues),
      Array.from(dyValues),
      Array.from(dzValues)
    );

    const defaultMaterial = new three.MeshPhongMaterial({
      color: CATEGORY_COLORS[0],
    });
    const defaultFocusMaterial = new three.MeshPhongMaterial({
      color: CATEGORY_COLORS_FOCUS[0],
    });
    const materialByCategory: Record<string, THREE.MeshPhongMaterial> = {};
    const focusMateriaByCategory: Record<string, THREE.MeshPhongMaterial> = {};
    let colorIdx = 0;
    for (const category of dcValues) {
      materialByCategory[category] = new three.MeshPhongMaterial({
        color: CATEGORY_COLORS[colorIdx],
      });
      focusMateriaByCategory[category] = new three.MeshPhongMaterial({
        color: CATEGORY_COLORS_FOCUS[colorIdx],
      });
      colorIdx++;
    }
    for (const item of data) {
      const plotGeometry = new three.SphereGeometry(0.3, 64, 32);
      const plotMaterial = dc
        ? materialByCategory[String(item[dc])]
        : defaultMaterial;
      const plotFocusMaterial = dc
        ? focusMateriaByCategory[String(item[dc])]
        : defaultFocusMaterial;
      const plot = new three.Mesh(plotGeometry, plotMaterial);
      plot.position.set(
        xValueByIdx[String(item[dx])] * AXES_UNIT_SIZE + AXES_MARGIN,
        yValueByIdx[String(item[dy])] * AXES_UNIT_SIZE + AXES_MARGIN,
        zValueByIdx[String(item[dz])] * AXES_UNIT_SIZE + AXES_MARGIN
      );
      this.chartObjects.push({
        mesh: plot,
        data: item,
        drawingInfo: {
          material: plotMaterial,
          focusMaterial: plotFocusMaterial,
        },
      });
      this.scene.add(plot);
    }

    return this.chartObjects;
  }

  private removeHelper3DObjectsFromChartObj(obj: ChartObject): void {
    if (obj.drawingInfo?.helper3DObjects) {
      for (const obj3D of obj.drawingInfo.helper3DObjects) {
        obj3D.removeFromParent();
      }
    }
    if (!obj.drawingInfo) {
      obj.drawingInfo = {};
    }
    obj.drawingInfo.helper3DObjects = [];
  }

  private addHelper3DObjectToChartObj(
    obj: ChartObject,
    helperObj: THREE.Object3D
  ): void {
    if (!obj.drawingInfo) {
      obj.drawingInfo = {};
    }
    if (!obj.drawingInfo.helper3DObjects) {
      obj.drawingInfo.helper3DObjects = [];
    }
    obj.drawingInfo.helper3DObjects.push(helperObj);
  }

  onChartObjectSelected(obj: ChartObject | null): void {
    if (obj !== this.selectedChartObject) {
      if (this.selectedChartObject) {
        // unset material
        if (this.selectedChartObject.drawingInfo?.material) {
          this.selectedChartObject.mesh.material =
            this.selectedChartObject.drawingInfo.material;
        }
        // remove helper lines
        this.removeHelper3DObjectsFromChartObj(this.selectedChartObject);
      }
      this.selectedChartObject = obj;
      if (this.selectedChartObject) {
        // set focus material
        if (this.selectedChartObject.drawingInfo?.focusMaterial) {
          this.selectedChartObject.mesh.material =
            this.selectedChartObject.drawingInfo.focusMaterial;
        }
        // draw helper lines
        const helperLineMaterial = new three.LineBasicMaterial({
          color: 0xff0000,
        });

        // x helper line
        const xPoints = [
          new three.Vector3(
            this.selectedChartObject.mesh.position.x,
            this.selectedChartObject.mesh.position.y,
            this.selectedChartObject.mesh.position.z
          ),
          new three.Vector3(
            0,
            this.selectedChartObject.mesh.position.y,
            this.selectedChartObject.mesh.position.z
          ),
        ];
        const xHelperLineGeometry = new three.BufferGeometry().setFromPoints(
          xPoints
        );
        const xHelperLine = new three.Line(
          xHelperLineGeometry,
          helperLineMaterial
        );

        // y helper line
        const yPoints = [
          new three.Vector3(
            this.selectedChartObject.mesh.position.x,
            this.selectedChartObject.mesh.position.y,
            this.selectedChartObject.mesh.position.z
          ),
          new three.Vector3(
            this.selectedChartObject.mesh.position.x,
            0,
            this.selectedChartObject.mesh.position.z
          ),
        ];
        const yHelperLineGeometry = new three.BufferGeometry().setFromPoints(
          yPoints
        );
        const yHelperLine = new three.Line(
          yHelperLineGeometry,
          helperLineMaterial
        );

        // z helper line
        const zPoints = [
          new three.Vector3(
            this.selectedChartObject.mesh.position.x,
            this.selectedChartObject.mesh.position.y,
            this.selectedChartObject.mesh.position.z
          ),
          new three.Vector3(
            this.selectedChartObject.mesh.position.x,
            this.selectedChartObject.mesh.position.y,
            0
          ),
        ];
        const zHelperLineGeometry = new three.BufferGeometry().setFromPoints(
          zPoints
        );
        const zHelperLine = new three.Line(
          zHelperLineGeometry,
          helperLineMaterial
        );

        this.removeHelper3DObjectsFromChartObj(this.selectedChartObject);
        this.addHelper3DObjectToChartObj(this.selectedChartObject, xHelperLine);
        this.addHelper3DObjectToChartObj(this.selectedChartObject, yHelperLine);
        this.addHelper3DObjectToChartObj(this.selectedChartObject, zHelperLine);
        this.scene.add(xHelperLine);
        this.scene.add(yHelperLine);
        this.scene.add(zHelperLine);
      }
    }
  }
}
