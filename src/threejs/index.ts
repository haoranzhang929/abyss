import {
  Scene,
  Color,
  PerspectiveCamera,
  DirectionalLight,
  WebGLRenderer,
  Mesh,
  LineSegments,
  EdgesGeometry,
  LineBasicMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  AmbientLight,
  HemisphereLight,
  BufferGeometry,
  PointsMaterial,
  Points,
  TextureLoader,
  Float32BufferAttribute
} from "three";
import { FontLoader, FontData } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import fontJson from "../assets/hao.json";
import star from "../assets/star.png";

import { colorPalette } from "./config";

const { WHITE, LIGHT_CREAM, LIGHT_YELLOW, PANTONE_BLUE_2020 } = colorPalette;

export const setupScene = (bgColor: string | number | Color | undefined) => {
  const scene = new Scene();
  scene.background = new Color(bgColor);
  return scene;
};

export const setupCamera = (windowWidth: number, windowHeight: number) => {
  const camera = new PerspectiveCamera(60, windowWidth / windowHeight, 1, 50000);
  camera.position.x = -500;
  camera.position.y = 300;
  camera.position.z = 800;
  return camera;
};

export const setupLights = () => {
  const directionalLight = new DirectionalLight(LIGHT_YELLOW, 3);
  const directionalLight2 = new DirectionalLight(LIGHT_YELLOW, 0.6);
  directionalLight.position.set(0, 200, -2500);
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

export const createFontMesh = (textGeometry: TextGeometry) =>
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

export const createFontLine = (textGeometry: TextGeometry) =>
  new LineSegments(
    new EdgesGeometry(textGeometry),
    new LineBasicMaterial({
      color: WHITE,
      linewidth: 1
    })
  );

export const loadText = () => {
  const textloader = new FontLoader();
  const font = textloader.parse(fontJson as unknown as FontData);
  const geometry = new TextGeometry("皓", {
    font,
    size: 200,
    depth: 20,
    curveSegments: 1
  });
  geometry.computeBoundingBox();
  return geometry;
};

export const setupCircle = () => {
  const circleGeo = new CircleGeometry(400, 50);
  const circleMat = new MeshBasicMaterial({ color: LIGHT_YELLOW });
  const circle = new Mesh(circleGeo, circleMat);
  circle.position.set(0, 200, -2500);
  return circle;
};

export const setupStars = (starCount = 1000) => {
  const starTexture = new TextureLoader().load(star);
  const positions: number[] = [];
  const velocities: number[] = [];
  for (let i = 0; i < starCount; i++) {
    positions.push(
      Math.random() * 3000 - 1500,
      Math.random() * 3000 - 1500,
      Math.random() * 3000 - 1500
    );
    velocities.push(0);
  }
  const starGeo = new BufferGeometry();
  starGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  // store velocities on userData for animation
  (starGeo as BufferGeometry).userData = { velocities };
  const starMaterial = new PointsMaterial({
    color: LIGHT_CREAM,
    size: 5,
    transparent: true,
    map: starTexture
  });
  return new Points(starGeo, starMaterial);
};

export { DitheringEffect } from "./DitheringEffect";
