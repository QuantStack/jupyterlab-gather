import {
  selectAppData,
  selectIsSomeoneScreenSharing
} from '@100mslive/react-sdk';
//@ts-expect-error AR.js doesn't have type definitions
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { hmsActions, hmsStore } from './hms';
class ArCube {
  /**
   * Construct a new arpresent widget.
   */
  constructor(node: HTMLElement) {
    this.node = node;
    this.modelUrl = hmsStore.getState(selectAppData('modelUrl'));

    this.initialize();
    // this.animate();
    window.addEventListener('markerFound', () => {
      // console.log('Marker found');
    });

    window.addEventListener('markerLost', () => {
      // console.log('Marker lost');
    });
  }

  clock: THREE.Clock;
  scene: THREE.Scene;
  camera: THREE.Camera;
  arToolkitSource: any;
  arToolkitContext: any;
  markerRootArray: THREE.Group[];
  markerGroupArray: THREE.Group[];
  patternArray: string[];
  sceneGroup: THREE.Group;
  edgeGroup: THREE.Group;
  gltfLoader: GLTFLoader;
  gltfModel: THREE.Group;
  animations: THREE.AnimationClip[] | undefined;
  mixer: THREE.AnimationMixer;
  renderer: THREE.WebGLRenderer;
  mixerUpdateDelta: number;
  // observer: IntersectionObserver;
  existingWebcam: HTMLVideoElement | null;
  newWebcam: HTMLVideoElement | undefined;
  webcam_loaded: Promise<void>;
  resolve: any;
  deltaTime: number;
  totalTime: number;
  readonly markerControls: any;
  readonly ambientLight: THREE.AmbientLight;
  readonly rotationArray: THREE.Vector3[];
  readonly markerRoot: THREE.Group;
  readonly markerGroup: THREE.Group;
  readonly pointLight: THREE.PointLight;
  readonly loader: THREE.TextureLoader;
  readonly stageMesh: THREE.MeshBasicMaterial;
  readonly stage: THREE.Mesh;
  readonly edgeGeometry: THREE.CylinderGeometry;
  readonly edgeCenters: THREE.Vector3[];
  readonly edgeRotations: THREE.Vector3[];
  readonly okToLoadModel: boolean;
  readonly animationRequestId: number | undefined;
  readonly now: number;
  readonly then: number;
  readonly elapsed: number;
  readonly fpsInterval: number;
  //   readonly webcamFromArjs: HTMLElement | null;
  readonly node: HTMLElement;
  renderTarget: THREE.WebGLRenderTarget;
  modelUrl: string;

  initialize() {
    this.scene = new THREE.Scene();

    console.log('first');
    // const selector = selectAppData('modelUrl');
    console.log('mid');
    // hmsStore.subscribe(this.loadModel, selector);
    console.log('sec');

    // promise to track if AR.js has loaded the webcam
    this.webcam_loaded = new Promise(resolve => {
      this.resolve = resolve;
    });

    window.addEventListener('arjs-video-loaded', (e: any) => {
      e.detail.component.style.display = 'none';
      this.resolve();
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    this.camera = new THREE.Camera();
    this.scene.add(this.camera);

    // const canvas = document.getElementById('target') as HTMLCanvasElement;

    // const offscreen = canvas?.transferControlToOffscreen();
    // if (!canvas?.transferControlToOffscreen) {
    //   console.log('no support');
    // }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      // canvas: canvas,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false
    });

    this.renderer.setClearColor(new THREE.Color('lightgrey'), 0);

    //Not render target things
    const isScreenShareOn = hmsStore.getState(selectIsSomeoneScreenSharing); //useHMSStore(selectIsSomeoneScreenSharing);

    if (isScreenShareOn) {
      console.log('iffing');
      const container = document.getElementById('screen-share-container');
      container?.appendChild(this.renderer.domElement);
    } else {
      // Renderer target things
      console.log('elsing');
      this.renderTarget = new THREE.WebGLRenderTarget();
      this.renderTarget.setSize(1280, 720);
      this.renderer.setRenderTarget(this.renderTarget);
    }

    // this.renderer.setSize(1280, 720, false);
    // this.renderer.domElement.style.position = 'absolute';

    // this.renderer.domElement.style.top = '0px';
    // this.renderer.domElement.style.left = '0px';

    this.clock = new THREE.Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

    hmsActions.setAppData('renderer', this.renderer);

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam'
    });

    this.arToolkitSource.init();

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////

    // create atToolkitContext
    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl:
        THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
      detectionMode: 'mono'
    });

    // copy projection matrix to camera when initialization complete
    this.arToolkitContext.init(() => {
      this.camera.projectionMatrix.copy(
        this.arToolkitContext.getProjectionMatrix()
      );
    });

    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    this.markerRootArray = [];
    this.markerGroupArray = [];
    this.patternArray = [
      'letterA',
      'letterB',
      'letterC',
      'letterD',
      'letterF',
      'kanji'
    ];

    const rotationArray = [
      new THREE.Vector3(-Math.PI / 2, 0, 0),
      new THREE.Vector3(0, -Math.PI / 2, Math.PI / 2),
      new THREE.Vector3(Math.PI / 2, 0, Math.PI),
      new THREE.Vector3(-Math.PI / 2, Math.PI / 2, 0),
      new THREE.Vector3(Math.PI, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ];

    for (let i = 0; i < 6; i++) {
      const markerRoot = new THREE.Group();
      this.markerRootArray.push(markerRoot);
      this.scene.add(markerRoot);
      const markerControls = new THREEx.ArMarkerControls(
        this.arToolkitContext,
        markerRoot,
        {
          type: 'pattern',
          patternUrl:
            THREEx.ArToolkitContext.baseURL +
            'examples/marker-training/examples/pattern-files/pattern-' +
            this.patternArray[i] +
            '.patt'
        }
      );

      const markerGroup = new THREE.Group();
      this.markerGroupArray.push(markerGroup);
      markerGroup.position.y = -1.25 / 2;
      markerGroup.rotation.setFromVector3(rotationArray[i]);

      markerRoot.add(markerGroup);
    }

    ////////////////////////////////////////////////////////////
    // setup scene
    ////////////////////////////////////////////////////////////

    this.sceneGroup = new THREE.Group();
    // a 1x1x1 cube model with scale factor 1.25 fills up the physical cube
    this.sceneGroup.scale.set(1.75 / 2, 1.75 / 2, 1.75 / 2);

    // reversed cube
    this.sceneGroup.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshBasicMaterial({
          color: '#1a1b26',
          side: THREE.BackSide
        })
      )
    );

    // cube edges
    this.edgeGroup = new THREE.Group();
    const edgeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 32);

    const edgeCenters = [
      new THREE.Vector3(0, -1, -1),
      new THREE.Vector3(0, 1, -1),
      new THREE.Vector3(0, -1, 1),
      new THREE.Vector3(0, 1, 1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(-1, -1, 0),
      new THREE.Vector3(1, -1, 0),
      new THREE.Vector3(-1, 1, 0),
      new THREE.Vector3(1, 1, 0)
    ];

    const edgeRotations = [
      new THREE.Vector3(0, 0, Math.PI / 2),
      new THREE.Vector3(0, 0, Math.PI / 2),
      new THREE.Vector3(0, 0, Math.PI / 2),
      new THREE.Vector3(0, 0, Math.PI / 2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.PI / 2, 0, 0),
      new THREE.Vector3(Math.PI / 2, 0, 0),
      new THREE.Vector3(Math.PI / 2, 0, 0),
      new THREE.Vector3(Math.PI / 2, 0, 0)
    ];

    for (let i = 0; i < 12; i++) {
      const edge = new THREE.Mesh(
        edgeGeometry,
        new THREE.MeshLambertMaterial({
          color: '#262626'
        })
      );
      edge.position.copy(edgeCenters[i]);
      edge.rotation.setFromVector3(edgeRotations[i]);

      this.edgeGroup.add(edge);
    }

    this.sceneGroup.add(this.edgeGroup);

    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
    }

    console.log('bet');

    this.loadModel();

    console.log('post bet');
    const pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(0.5, 3, 2);
    this.scene.add(pointLight);

    // this.setUpVideo();
  }

  loadModel() {
    this.modelUrl = hmsStore.getState(selectAppData('modelUrl'));

    console.log('load model', this.modelUrl);
    // remove old model first
    if (this.gltfModel) {
      this.removeFromScene(this.gltfModel);
    }

    // load model

    this.gltfLoader.load(
      this.modelUrl,
      gltf => {
        const scale = 1.0;
        this.gltfModel = gltf.scene;
        this.gltfModel.scale.set(scale, scale, scale);
        this.gltfModel.position.fromArray([0, -1, 0]);

        this.animations = gltf.animations;
        this.mixer = new THREE.AnimationMixer(this.gltfModel);

        if (this.animations) {
          this.animations.forEach(clip => {
            this.mixer.clipAction(clip).play();
          });
        }

        this.sceneGroup.add(this.gltfModel);
      },
      () => {
        console.log('model loading');
      },
      error => {
        console.log('Error loading model', error);
      }
    );
  }

  removeFromScene(object3d: THREE.Object3D) {
    this.sceneGroup.remove(object3d);
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // console.log('canvas.width in resize', canvas.width);
    // console.log('width in resize', width);
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer.setSize(width, height, false);
      // this.camera.aspect = width / height;
      // this.camera.updateProjectionMatrix();

      // update any render target sizes here
    }
  }

  render() {
    // this.renderer.setRenderTarget(this.renderTarget);
    // this.renderer.render(this.scene, this.camera);
    // this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.deltaTime = this.clock.getDelta();
    this.totalTime += this.deltaTime;

    this.update();

    if (this.mixer) {
      this.mixerUpdateDelta = this.clock.getDelta();
      this.mixer.update(this.mixerUpdateDelta);
    }

    this.render();
  }

  update() {
    // update artoolkit on every frame
    if (this.arToolkitSource.ready !== false) {
      this.arToolkitContext.update(this.arToolkitSource.domElement);
    }
    for (let i = 0; i < 6; i++) {
      if (this.markerRootArray[i].visible) {
        this.markerGroupArray[i].add(this.sceneGroup);
        // console.log('visible: ' + this.patternArray[i]);
        break;
      }
    }
  }

  // attachToVideo() {
  //   const vid = document.getElementById('target');
  //   console.log('vid', vid);
  //   vid!.appendChild(this.renderer.domElement);
  // }

  // TODO: Casting is ok?
  async setUpVideo() {
    await this.webcam_loaded;
    // Create new webcam element
    this.existingWebcam = document.getElementById(
      'arjs-video'
    ) as HTMLVideoElement;
    this.newWebcam = this.existingWebcam?.cloneNode(true) as HTMLVideoElement;
    this.newWebcam.srcObject = this.existingWebcam?.srcObject;
    this.newWebcam.id = 'webcamViewNew';
    this.newWebcam.style.display = '';
    this.newWebcam.style.zIndex = '-2';
    // this.newWebcam.classList.add("jl-vid");
    this.node.appendChild(this.newWebcam);
  }
}

export default ArCube;
