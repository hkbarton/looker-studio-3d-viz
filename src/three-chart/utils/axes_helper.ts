// threejs typeing import only from
import * as THREE from "three";

import { three } from "./three_shim";
import { fontHelvetikerBold } from "../fonts/helvetiker_bold.typeface";

/**
 * axes margin
 */
export const AXES_MARGIN = 1;
/**
 * axes unit size
 */
export const AXES_UNIT_SIZE = 3;

function createAxisMovingAlongWith(
  scene: THREE.Scene,
  targetAxisValues: string[],
  movingAlongValues: string[],
  targetPointVectorMask: number[],
  maPointVectorMask: number[],
  borderMaterial: THREE.LineBasicMaterial,
  helperLineMaterial: THREE.LineBasicMaterial
) {
  const maAxisValueByIdx: Record<string, number> = {};
  for (let maIdx = 0; maIdx <= movingAlongValues.length; maIdx++) {
    const targetPoints: THREE.Vector3[] = [];
    let lineMaterial;
    let targetPointsMA;
    if (maIdx === 0) {
      lineMaterial = borderMaterial;
      targetPointsMA =
        (movingAlongValues.length - 1) * AXES_UNIT_SIZE + 2 * AXES_MARGIN;
    } else {
      lineMaterial = helperLineMaterial;
      targetPointsMA =
        (movingAlongValues.length - maIdx) * AXES_UNIT_SIZE + AXES_MARGIN;
      maAxisValueByIdx[movingAlongValues[maIdx - 1]] =
        movingAlongValues.length - maIdx;
    }
    for (let tIdx = 0; tIdx <= targetAxisValues.length; tIdx++) {
      if (tIdx === 0) {
        const targetAxisVal =
          (targetAxisValues.length - 1) * AXES_UNIT_SIZE + 2 * AXES_MARGIN;
        targetPoints.push(
          new three.Vector3(
            targetAxisVal * targetPointVectorMask[0] +
              targetPointsMA * maPointVectorMask[0],
            targetAxisVal * targetPointVectorMask[1] +
              targetPointsMA * maPointVectorMask[1],
            targetAxisVal * targetPointVectorMask[2] +
              targetPointsMA * maPointVectorMask[2]
          )
        );
      } else {
        const targetAxisVal =
          (targetAxisValues.length - tIdx) * AXES_UNIT_SIZE + AXES_MARGIN;
        targetPoints.push(
          new three.Vector3(
            targetAxisVal * targetPointVectorMask[0] +
              targetPointsMA * maPointVectorMask[0],
            targetAxisVal * targetPointVectorMask[1] +
              targetPointsMA * maPointVectorMask[1],
            targetAxisVal * targetPointVectorMask[2] +
              targetPointsMA * maPointVectorMask[2]
          )
        );
      }
    }
    targetPoints.push(
      new three.Vector3(
        targetPointsMA * maPointVectorMask[0],
        targetPointsMA * maPointVectorMask[1],
        targetPointsMA * maPointVectorMask[2]
      )
    );
    const targetGeometry = new three.BufferGeometry().setFromPoints(
      targetPoints
    );
    const targetAxis = new three.Line(targetGeometry, lineMaterial);
    scene.add(targetAxis);
  }
  return maAxisValueByIdx;
}

/**
 * create x,y,z axes, their help lines and label
 */
export function createAxes(
  scene: THREE.Scene,
  xValues: string[],
  yValues: string[],
  zValues: string[]
) {
  // draw axes
  const borderLineMaterial = new three.LineBasicMaterial({ color: 0x000000 });
  const helperLineMaterial = new three.LineBasicMaterial({ color: 0xaaaaaa });
  // draw x axis and its helper line moving along z
  const zValueByIdx = createAxisMovingAlongWith(
    scene,
    xValues,
    zValues,
    [1, 0, 0],
    [0, 0, 1],
    borderLineMaterial,
    helperLineMaterial
  );
  // draw z axis and its helper line moving along x
  const xValueByIdx = createAxisMovingAlongWith(
    scene,
    zValues,
    xValues,
    [0, 0, 1],
    [1, 0, 0],
    borderLineMaterial,
    helperLineMaterial
  );
  // draw x axis and its helper line moving along the y
  const yValueByIdx = createAxisMovingAlongWith(
    scene,
    xValues,
    yValues,
    [1, 0, 0],
    [0, 1, 0],
    borderLineMaterial,
    helperLineMaterial
  );
  // draw y axis and its helper line moving along the x
  createAxisMovingAlongWith(
    scene,
    yValues,
    xValues,
    [0, 1, 0],
    [1, 0, 0],
    borderLineMaterial,
    helperLineMaterial
  );
  // draw z axis and its helper line moving along the y
  createAxisMovingAlongWith(
    scene,
    zValues,
    yValues,
    [0, 0, 1],
    [0, 1, 0],
    borderLineMaterial,
    helperLineMaterial
  );
  // draw y axis and its helper line moving along the z
  createAxisMovingAlongWith(
    scene,
    yValues,
    zValues,
    [0, 1, 0],
    [0, 0, 1],
    borderLineMaterial,
    helperLineMaterial
  );

  // draw axes label
  const loader = new three.FontLoader();
  loader.load(
    "https://storage.googleapis.com/testingviz/ls-3pviz-demo/fonts/helvetiker_bold.typeface.json",
    (font) => {
      const labelMaterial = new three.MeshBasicMaterial({
        color: 0x333333,
        side: three.DoubleSide,
      });
      // draw z axis label
      for (const zValue of zValues) {
        const labelShape = font.generateShapes(zValue, 0.4);
        const labelGeometry = new three.ShapeGeometry(labelShape);
        labelGeometry.rotateX(-1.3);
        const label = new three.Mesh(labelGeometry, labelMaterial);
        label.position.set(
          (xValues.length - 1) * AXES_UNIT_SIZE + 2.5 * AXES_MARGIN,
          0,
          zValueByIdx[zValue] * AXES_UNIT_SIZE + AXES_MARGIN
        );
        scene.add(label);
      }
      // draw x axis label
      for (const xValue of xValues) {
        const labelShape = font.generateShapes(xValue, 0.4);
        const labelGeometry = new three.ShapeGeometry(labelShape);
        labelGeometry.rotateX(-1.3);
        labelGeometry.rotateY(0.8);
        labelGeometry.computeBoundingBox();
        const label = new three.Mesh(labelGeometry, labelMaterial);
        label.position.set(
          xValueByIdx[xValue] * AXES_UNIT_SIZE + AXES_MARGIN,
          0,
          (zValues.length - 1) * AXES_UNIT_SIZE +
            2.5 * AXES_MARGIN +
            (labelGeometry.boundingBox?.max.x || 0)
        );
        scene.add(label);
      }
      // draw y axis label
      for (const yValue of yValues) {
        const labelShape = font.generateShapes(yValue, 0.4);
        const labelGeometry = new three.ShapeGeometry(labelShape);
        const label = new three.Mesh(labelGeometry, labelMaterial);
        label.position.set(
          (xValues.length - 1) * AXES_UNIT_SIZE + 2.5 * AXES_MARGIN,
          yValueByIdx[yValue] * AXES_UNIT_SIZE + AXES_MARGIN,
          0
        );
        scene.add(label);
      }
    }
  );

  return { xValueByIdx, yValueByIdx, zValueByIdx };
}
