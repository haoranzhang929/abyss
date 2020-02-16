import React, { useRef, useEffect, memo } from "react";
import { Object3D, Geometry } from "three";
import { GodRaysEffect, RenderPass, EffectPass, EffectComposer, SMAAEffect } from "postprocessing";
import { isMobile } from "react-device-detect";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls.js";

import useWindowSize from "../hooks/useWindowSize";

import "../style/three.css";

import {
  setupRenderer,
  setupCamera,
  setupScene,
  setupLights,
  setupCircle,
  loadText,
  createFontMesh,
  createFontLine,
  setupStars,
  ExtendedVector3
} from "../threejs";

let frameId: number | null;

const NIGHT_OWL_BLUE = "#000c1d";

const scene = setupScene(NIGHT_OWL_BLUE);

const lights = setupLights();
scene.add(...lights);

const circle = setupCircle();
scene.add(circle);

const areaImage = new Image();
areaImage.src = SMAAEffect.areaImageDataURL;
const searchImage = new Image();
searchImage.src = SMAAEffect.searchImageDataURL;
const smaaEffect = new SMAAEffect(searchImage, areaImage, 1);

const stars = setupStars();
scene.add(stars);

const ThreeScene = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  const camera = setupCamera(width, height);

  const godRaysEffect = new GodRaysEffect(camera, circle, {
    resolutionScale: 1,
    density: 0.8,
    decay: 0.95,
    weight: 0.6,
    samples: 100
  });

  const renderPass = new RenderPass(scene, camera);
  const effectPass = new EffectPass(camera, smaaEffect, godRaysEffect);
  effectPass.renderToScreen = true;
  const composer = new EffectComposer(setupRenderer(width, height));
  composer.addPass(renderPass);
  composer.addPass(effectPass);

  const textGeometry = loadText();
  const textMesh = createFontMesh(textGeometry);
  textMesh.visible = true;
  const textLine = createFontLine(textGeometry);
  textLine.visible = false;
  const textObj = new Object3D().add(textMesh, textLine);
  textObj.position.set(-150, -90, 0);
  scene.add(textObj);

  let controls: null | DeviceOrientationControls;

  if (isMobile) {
    controls = new DeviceOrientationControls(camera);
    controls.deviceOrientation = 0;
  }

  const { renderer } = composer;

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enablePan = false;
  orbitControls.maxDistance = 1500;
  orbitControls.minDistance = 200;
  orbitControls.rotateSpeed = 0.4;
  orbitControls.zoomSpeed = 0.4;

  const renderScene = () => {
    composer.render(scene, camera);
  };

  const starsMove = () => {
    const starGeo = stars.geometry as Geometry;
    starGeo.vertices.forEach((star: unknown) => {
      const eStar = star as ExtendedVector3;
      eStar.velocity += 0.05 + Math.random() * 0.01;
      eStar.z += eStar.velocity;
      if (eStar.z > 1500) {
        eStar.z = -1500;
        eStar.velocity = 0;
      }
    });
    starGeo.verticesNeedUpdate = true;
    stars.rotation.z -= 0.0005;
  };

  const animate = () => {
    isMobile && controls && controls.update();
    frameId = window.requestAnimationFrame(animate);
    renderScene();
    starsMove();
  };

  const start = () => {
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
  };

  const stop = () => {
    frameId && cancelAnimationFrame(frameId);
    frameId = null;
  };

  const onWindowResize = (width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    composer.setSize(width, height);
  };

  useEffect(() => {
    onWindowResize(width, height);

    if (!isMobile) {
      start();
    }

    const divEl = divRef.current;
    divEl?.appendChild(renderer.domElement);

    return () => {
      stop();
      divEl?.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(
    () => {
      if (isMobile) {
        controls?.connect();
        start();
      }
      return () => {
        controls?.disconnect();
        controls?.dispose();
        stop();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );

  return <div ref={divRef} className="three-container"></div>;
};

export default memo(ThreeScene);
