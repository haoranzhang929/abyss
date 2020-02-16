import {
  Scene,
  Color,
  PerspectiveCamera,
  DirectionalLight,
  WebGLRenderer,
  TextBufferGeometry,
  Mesh,
  LineSegments,
  EdgesGeometry,
  LineBasicMaterial,
  FontLoader,
  CircleGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  AmbientLight,
  HemisphereLight
} from "three";

import fontJson from "../assets/hao.json";

import { colorPalette } from "./config";

const { WHITE, LIGHT_CREAM, LIGHT_YELLOW, PANTONE_BLUE_2020 } = colorPalette;

export const setupScene = (bgColor: string | number | Color | undefined) => {
  const scene = new Scene();
  scene.background = new Color(bgColor);
  return scene;
};

export const setupCamera = (windowWidth: number, windowHeight: number) => {
  const camera = new PerspectiveCamera(60, windowWidth / windowHeight, 1, 50000);
  camera.position.y = -160;
  camera.position.z = 800;
  return camera;
};

export const setupLights = () => {
  const directionalLight = new DirectionalLight(LIGHT_YELLOW, 2);
  const directionalLight2 = new DirectionalLight(LIGHT_YELLOW, 0.6);
  directionalLight.position.set(0, 200, -1000);
  directionalLight2.position.set(0, 200, 3000);
  const ambientLight = new AmbientLight(LIGHT_CREAM, 0.4);
  const hemisphereLight = new HemisphereLight(LIGHT_CREAM, PANTONE_BLUE_2020, 0.8);
  return [directionalLight, directionalLight2, ambientLight, hemisphereLight];
};

export const setupRenderer = (windowWidth: number, windowHeight: number) => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(windowWidth, windowHeight);
  return renderer;
};

export const createFontMesh = (textGeometry: TextBufferGeometry) =>
  new Mesh(
    textGeometry,
    new MeshPhysicalMaterial({
      color: PANTONE_BLUE_2020,
      metalness: 0.5,
      roughness: 0.5,
      opacity: 0.5,
      envMapIntensity: 5
    })
  );

export const createFontLine = (textGeometry: TextBufferGeometry) =>
  new LineSegments(
    new EdgesGeometry(textGeometry),
    new LineBasicMaterial({
      color: WHITE,
      linewidth: 1
    })
  );

export const loadText = () => {
  const textloader = new FontLoader();
  const font = textloader.parse(fontJson);
  const geometry = new TextBufferGeometry("皓", {
    font,
    size: 200,
    height: 20
  });
  geometry.computeBoundingBox();
  return geometry;
};

export const setupCircle = () => {
  const circleGeo = new CircleGeometry(300, 50);
  const circleMat = new MeshBasicMaterial({ color: LIGHT_YELLOW });
  const circle = new Mesh(circleGeo, circleMat);
  circle.position.set(0, 200, -1000);
  return circle;
};
