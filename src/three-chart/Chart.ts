import * as THREE from "three";
import { three } from "./utils/three_shim";

/**
 * Chart config
 */
export interface ChartConfig {
  container: Element;
  options?: { lights?: THREE.Light[] };
  data?: {
    data: Array<Record<string, string | number | boolean>>;
    dimensions: string[];
    measures: string[];
    labels?: string[];
  };
}

/**
 * Chart object
 */
export interface ChartObject {
  mesh: THREE.Mesh;
  data: Record<string, string | number | boolean>;
  drawingInfo?: {
    material?: THREE.Material;
    focusMaterial?: THREE.Material;
    helper3DObjects?: THREE.Object3D[];
  };
}

/**
 * Base Chart class
 */
export abstract class Chart {
  protected renderer: THREE.WebGLRenderer;
  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;

  constructor(protected config: ChartConfig) {
    const geoConfig = { width: 600, height: 400 };
    const { container } = config;
    this.renderer = new three.WebGLRenderer();
    this.renderer.setSize(geoConfig.width, geoConfig.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xcccccc, 1);
    container.appendChild(this.renderer.domElement);

    const initEyePosition = [25, 15, 20] as const;
    // create default camera and orbit control
    this.camera = new three.PerspectiveCamera(
      75, // FOV
      geoConfig.width / geoConfig.height, // aspect
      0.1, // near
      1000 // far
    );
    this.camera.position.set(...initEyePosition);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    const controls = new three.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    controls.update();

    // create scene and light
    this.scene = new three.Scene();

    if (config.options && config.options.lights) {
      for (const configLight of config.options.lights) {
        this.scene.add(configLight);
      }
    } else {
      const defaultLight = new three.DirectionalLight(
        0x404040 /*color*/,
        4 /*intensity*/
      );
      defaultLight.position.set(...initEyePosition);
      defaultLight.castShadow = true;
      this.scene.add(defaultLight);
      const light2 = new three.DirectionalLight(0x404040, 4);
      const light2Pos = initEyePosition.map((v) => -1 * v);
      light2.position.set(light2Pos[0], light2Pos[1], light2Pos[2]);
      light2.castShadow = true;
      this.scene.add(light2);
    }
    const chartObjects = this.renderChart();

    // Selection handler
    const raycaster = new three.Raycaster();
    const pointer = new three.Vector2();
    this.renderer.domElement.addEventListener("pointermove", (event) => {
      if (!event.target) return;
      const { left, top } = (
        event.target as HTMLElement
      ).getBoundingClientRect();
      pointer.x = ((event.clientX - left) / geoConfig.width) * 2 - 1;
      pointer.y = -((event.clientY - top) / geoConfig.height) * 2 + 1;
      raycaster.setFromCamera(pointer, this.camera);
      let selected: ChartObject | null = null;
      for (const object of chartObjects) {
        if (raycaster.intersectObject(object.mesh).length) {
          selected = object;
        }
      }
      this.onChartObjectSelected(selected);
    });

    requestAnimationFrame(this.render.bind(this));
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  abstract renderChart(): ChartObject[];

  abstract onChartObjectSelected(obj: ChartObject | null): void;
}
