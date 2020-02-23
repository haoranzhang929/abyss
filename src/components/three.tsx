import React, { useRef, useEffect, useState, memo } from "react";
import {
  Object3D,
  Geometry,
  WebGLRenderer,
  AudioListener,
  AudioLoader,
  AudioAnalyser,
  Audio
} from "three";
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

import { colorPalette } from "../threejs/config";

const { NIGHT_OWL_BLUE } = colorPalette;

let frameId: number | null;

// Three Scene init setup start
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

const textGeometry = loadText();
const textMesh = createFontMesh(textGeometry);

const textLine = createFontLine(textGeometry);

const textObj = new Object3D().add(textMesh, textLine);
textObj.position.set(-150, -90, 0);
scene.add(textObj);

const audioLoader = new AudioLoader();
const listener = new AudioListener();
const sound = new Audio(listener);
const analyser = new AudioAnalyser(sound, 64);

const camera = setupCamera(window.innerWidth, window.innerHeight);
camera.add(listener);

const godRaysEffect = new GodRaysEffect(camera, circle, {
  resolutionScale: 1,
  density: 0.9,
  decay: 0.95,
  weight: 0.4,
  samples: 100
});

const renderPass = new RenderPass(scene, camera);
const effectPass = new EffectPass(camera, smaaEffect, godRaysEffect);
effectPass.renderToScreen = true;
const composer = new EffectComposer(setupRenderer(window.innerWidth, window.innerHeight));
composer.addPass(renderPass);
composer.addPass(effectPass);

const renderer = composer.renderer as WebGLRenderer;

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enablePan = false;
orbitControls.maxDistance = 1500;
orbitControls.minDistance = 200;
orbitControls.rotateSpeed = 0.4;
orbitControls.zoomSpeed = 0.6;

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
// Three Scene init setup end

const ThreeScene = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isMesh] = useState(true);
  const [isAudioLoaded, setAudioLoadingStatus] = useState(false);

  textMesh.visible = isMesh;
  textLine.visible = !isMesh;

  const divRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  let controls: null | DeviceOrientationControls;

  if (isMobile) {
    controls = new DeviceOrientationControls(camera);
    controls.deviceOrientation = 0;
  }

  const onWindowResize = (width: number, height: number) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    composer.setSize(width, height);
  };

  const animate = () => {
    isMobile && controls && controls.update();
    frameId = window.requestAnimationFrame(animate);

    analyser.getFrequencyData();

    starsMove();
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

  useEffect(() => {
    isClicked &&
      !isAudioLoaded &&
      audioLoader.load(
        `${process.env.PUBLIC_URL}/BlueBoi.mp3`,
        buffer => {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          setAudioLoadingStatus(true);
          sound.play();
        },
        xhr => {
          const loadingStatus = (xhr.loaded / xhr.total) * 100;
          console.info(`Audio Loading: ${Math.floor(loadingStatus)}%`);
          if (loadingStatus === 100) {
            console.log("Loading Complete");
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked]);

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

  return (
    <>
      {!isAudioLoaded ? (
        <div className="overlay">
          <div className="overlay--container">
            <q className="quote">
              If you gaze long enough into an abyss, the abyss will gaze back into you.
            </q>
            <small className="author"> -- Friedrich Nietzsche</small>
            {!isClicked && (
              <button
                className="start-button"
                onClick={() => {
                  setIsClicked(true);
                }}
              >
                Start
              </button>
            )}
            {isClicked && (
              <div className="lds-facebook">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
            <small className="hint">
              {isMobile ? "Touch/Pinch or move your device around " : "Darg/Zoom your mouse "}
              to explore
            </small>
          </div>
        </div>
      ) : null}
      <div ref={divRef} className="three-container"></div>
    </>
  );
};

export default memo(ThreeScene);
