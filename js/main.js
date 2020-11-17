"use strict";

import {
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  Scene,
  DirectionalLight,
  Vector3,
  AxesHelper,
  HemisphereLight,
  DirectionalLightHelper,
  HemisphereLightHelper,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  FogExp2,
  TextureLoader,
  CubeTextureLoader,
  Vector4,
  Box3,
  Raycaster,
  ObjectSpaceNormalMap,
  Vector2,
  LOD,
} from "./lib/three.module.js";
import Utilities from "./lib/Utilities.js";
import Ocean from "./ocean/Ocean.js";
import MouseLookController from "./controls/MouseLookController.js";
import Island from "./terrain/Island.js";
import Boat from "./objects/boat.js";
import Clouds from "./objects/Clouds.js";
import Trees from "./objects/Trees.js";
import Rocket from "./objects/Rocket.js";
import LaunchPlatform from "./objects/LaunchPlatform.js";
import Moon from "./objects/Moon.js";
import {EffectComposer} from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';


async function main() {
  const scene = new Scene();

  // const axesHelper = new AxesHelper(35);
  // axesHelper.position.y = 25;
  // scene.add(axesHelper);

  // scene.fog = new FogExp2(0x808080, 0.0035);

  /**
   * Initialize the camera
   */
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10001;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 150;
  camera.position.y = 60;
  camera.rotation.x -= Math.PI * 0.1;

  
  /**
   * Initialize renderer
   */
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  /**
   * Handle window resize:
   *  - update aspect ratio.
   *  - update projection matrix
   *  - update renderer size
   */
  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  /**
   * Add skybox
  */
 const skyLoader = new CubeTextureLoader();
 const texture = skyLoader.load([
        'resources/skybox/right.jpg',
        'resources/skybox/left.jpg',
        'resources/skybox/top.jpg',
        'resources/skybox/bottom.jpg',
        'resources/skybox/front.jpg',
        'resources/skybox/back.jpg'
       ]);

  scene.background = texture;

  /**
   * Add canvas element to DOM.
   */
  document.body.appendChild(renderer.domElement);

  /**
   * Add hemishpere light
   */
  const hemiLight = new HemisphereLight(0xffffbb, 0x080820, 1);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 100, 0);
  scene.add(hemiLight);

  // const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);
  
  /**
   * Add directional light
   */
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.color.setHSL(0.6, 0.75, 0.95);
  directionalLight.position.set(5.5, 5.75, -10);
  directionalLight.position.multiplyScalar(50);
  directionalLight.name = "dirlight";
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 3500;
  directionalLight.shadow.bias = -0.0001;
  let d = 500;

  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  // let dlh = new DirectionalLightHelper(directionalLight, 30, 0x000000);
  // scene.add(dlh);

   directionalLight.target.position.set(0, 20, -10);
   scene.add(directionalLight.target);

  /**
   * Add island terrain
   */
  const heightmapImage = await Utilities.loadImage(
    "resources/images/heightmaps/mask_with_height.png"
    // "resources/images/heightmaps/noise_combined.png"
  );
  const terrainWidth = 300;

  const terrainTextureInfo = [
    {
      url: "resources/textures/snowy_rock_01.png",
      uCoord: 1500 / terrainWidth,
      vCoord: 1500 / terrainWidth,
    },
    {
      url: "resources/textures/grass_02.png",
      uCoord: 5000 / terrainWidth,
      vCoord: 5000 / terrainWidth,
    },
  ];

  const terrainTextures = [];
  terrainTextureInfo.forEach((info) => {
    terrainTextures.push(
      Utilities.loadAndWrapTexture(info.url, info.uCoord, info.vCoord)
    );
  });

  const terrainSplatMaps = [];
  const splatMapUrls = ["resources/images/splatmap_01.png"];

  splatMapUrls.forEach((url) =>
    terrainSplatMaps.push(Utilities.loadTexture(url))
  );

  const terrain = new Island(heightmapImage, terrainWidth, terrainTextures, terrainSplatMaps);

  scene.add(terrain);

  /**
   * Add ocean as child of the terrain
   */
  const oceanTextureUrl = "resources/textures/waternormals.jpg";
  const ocean = new Ocean(10000, 10000, oceanTextureUrl);
  terrain.add(ocean);

  // /** 
  //  * Add the sky
  //  */
  // const skyClass = new Skyclass(directionalLight);
  // const sky = skyClass.sky;
  // scene.add(sky);


  //A node for objects to orbit around.
  const orbitNode = new Mesh(new SphereGeometry(), new MeshBasicMaterial());
  scene.add(orbitNode);

  /**
   * Add boat
   */
  const boat = new Boat(orbitNode);
  const boatModelUrl = "resources/models/boat/gltf/boat.glb";
  boat.loadModel(boatModelUrl);
 
  /**
   * Add clouds to the scene.
   */
  const clouds = new Clouds(scene);
  clouds.generateBillboardClouds();

  /**
   * Generate and add trees.
   */
  const treesUrl = "resources/models/kenney_nature_kit/tree_thin.glb";
  const trees = new Trees(scene, treesUrl, terrain.geometry);
  const treeGrid = [terrainWidth, terrainWidth];
  const minDist = 4;
  const maxDist = 8;
  const minHeight = 3;
  const maxHeight = 6;
  trees.generateTrees(treeGrid, minDist, maxDist, minHeight, maxHeight);
  // const treeSpriteUrl = "resources/textures/tree-sprite.png";
  // trees.generateTreeSprites(treeGrid, minDist, maxDist, minHeight, maxHeight, treeSpriteUrl);


   /**
    * Add a platform
    */
   const platformTextureUrl = "resources/textures/scratched-steel.jpg";
   const platformTexture = new TextureLoader().load(platformTextureUrl);
   const platformXpos = -105;
   const platformZpos = 15;
   const platform = new LaunchPlatform(scene, terrain.geometry, platformTexture, platformXpos, platformZpos);
   scene.add(platform);
   platform.generatePlatformLegs();

   /**
    * Add moon to the scene using LOD
    */
   const moonTextureUrl = "resources/textures/moon/texture.jpg";
   const moonTexture = new TextureLoader().load(moonTextureUrl);
   const bumpMapUrl = "resources/textures/moon/bump_map.jpg";
   const bumpMap = new TextureLoader().load(bumpMapUrl);

   const moonRadius = 100;
   const moonPos = [36, 725, -553];

   const moonLod = new LOD();
   const segmentsAndLengths = [
     [64, 1 - moonPos[2]],
     [32, 100 - moonPos[2]],
     [16, 350 - moonPos[2]],
     [8, 450 - moonPos[2]],
     [4, 750 - moonPos[2]]
   ]

   for(let i = 0; i < segmentsAndLengths.length; i++){
     const segments = segmentsAndLengths[i][0]
     const moonMesh = new Moon({
      texture: moonTexture,
      radius: moonRadius,
      widthSegments:segments, 
      heightSegments: segments,
      positions: moonPos,
      bumpMap: bumpMap,
     })
     moonLod.addLevel(moonMesh, segmentsAndLengths[i][1]);
   }

   scene.add(moonLod);

   /**
   * Add rocket to the scene
   */
  const rocketModelUrl = "resources/models/Space_Rocket_SaturnV/SaturnV/3d-files/saturn-rocket.glb";
  const rocket = new Rocket(platform);
  rocket.generateModel(rocketModelUrl);

  /**
   * Set up camera controller:
   */
  const mouseLookController = new MouseLookController(camera);

  // We attach a click lister to the canvas-element so that we can request a pointer lock.
  // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
  const canvas = renderer.domElement;

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  let yaw = 0;
  let pitch = 0;
  const mouseSensitivity = 0.001;

  function updateCamRotation(event) {
    yaw += event.movementX * mouseSensitivity;
    pitch += event.movementY * mouseSensitivity;
  }

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === canvas) {
      canvas.addEventListener("mousemove", updateCamRotation, false);
    } else {
      canvas.removeEventListener("mousemove", updateCamRotation, false);
    }
  });

  let move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    speed: 0.05,
  };

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyW") {
      move.forward = true;
      e.preventDefault();
    } else if (e.code === "KeyS") {
      move.backward = true;
      e.preventDefault();
    } else if (e.code === "KeyA") {
      move.left = true;
      e.preventDefault();
    } else if (e.code === "KeyD") {
      move.right = true;
      e.preventDefault();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "KeyW") {
      move.forward = false;
      e.preventDefault();
    } else if (e.code === "KeyS") {
      move.backward = false;
      e.preventDefault();
    } else if (e.code === "KeyA") {
      move.left = false;
      e.preventDefault();
    } else if (e.code === "KeyD") {
      move.right = false;
      e.preventDefault();
    }
  });

  const velocity = new Vector3(0.0, 0.0, 0.0);

  let then = performance.now();

  let splineIndex = 0;
  let reachedTop = false;

  const composer = new EffectComposer( renderer );
  composer.addPass(new RenderPass( scene, camera ));


  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass)



  function loop(now) {
    const delta = now - then;
    then = now;

    const moveSpeed = move.speed * delta;

    velocity.set(0.0, 0.0, 0.0);

    if (move.left) {
      velocity.x -= moveSpeed;
    }

    if (move.right) {
      velocity.x += moveSpeed;
    }

    if (move.forward) {
      velocity.z -= moveSpeed;
    }

    if (move.backward) {
      velocity.z += moveSpeed;
    }

    // update controller rotation.
    mouseLookController.update(pitch, yaw);
    yaw = 0;
    pitch = 0;

    // apply rotation to velocity vector, and translate moveNode with it.
    velocity.applyQuaternion(camera.quaternion);
    camera.position.add(velocity);

    //Make the rocket flyyyy
    if(rocket.model){

      if(!reachedTop){
        splineIndex++;
      }else {
        splineIndex--;
      }
      if(splineIndex > 1100){
        reachedTop = true;
      }
      if(splineIndex <= 0){
        reachedTop = false;
      }
      rocket.animate(splineIndex/1000);
    }

    moonLod.children.forEach(m => m.rotateMoon([0.0, 0.0025, 0.0]))

    //Animate the ocean
    ocean.animateOcean();

    //Rotate the orbitNode => rotate the boat.
    orbitNode.rotation.y += 0.001;

    //Rotate the moon
    // moon.rotateMoon([0.0, 0.0025, 0.0]);

    // render scene:
    if(splineIndex < 100){
      composer.render()
    }else {
      renderer.render(scene, camera);
    }

    requestAnimationFrame(loop);
  }

  loop(performance.now());
}


main(); // Start
