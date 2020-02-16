import React, { useRef, useEffect, memo } from "react";
import { Object3D, AxesHelper } from "three";
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
  createFontLine
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

  let mobileControls: null | DeviceOrientationControls;

  if (isMobile) {
    mobileControls = new DeviceOrientationControls(camera);
    mobileControls.deviceOrientation = 0;
  }

  const renderScene = () => {
    composer.render(scene, camera);
  };

  const animate = () => {
    isMobile && mobileControls && mobileControls.update();
    frameId = window.requestAnimationFrame(animate);
    renderScene();
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

  const { renderer } = composer;

  scene.add(new AxesHelper(5000));
  new OrbitControls(camera, renderer.domElement);

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
        mobileControls?.connect();
        start();
      }
      return () => {
        mobileControls?.disconnect();
        mobileControls?.dispose();
        stop();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMobile]
  );

  return <div ref={divRef} className="three-container"></div>;
};

export default memo(ThreeScene);
