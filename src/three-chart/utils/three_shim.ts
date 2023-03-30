// create shim of three.js, so we can load three.js from different souce
// without change actual charts code if needed
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";

export const three = {
  ...THREE,
  OrbitControls,
  Font,
  FontLoader,
};
