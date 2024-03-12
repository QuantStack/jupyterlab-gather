import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import * as THREE from 'three';

//@ts-expect-error AR.js doesn't have type definitions
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex.js';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';

class APODWidget extends Widget {
  /**
   * Construct a new APOD widget.
   */
  constructor() {
    super();

    // this.addClass('my-apodWidget');
    // promise to track if AR.js has loaded the webcam
    this.webcam_loaded = new Promise(resolve => {
      this.resolve = resolve;
    });

    window.addEventListener('arjs-video-loaded', (e: any) => {
      this.resolve();
      e.detail.component.style.display = 'none';
    });

    // Set up three stuff
    console.log('Set up three stuff');
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    // TODO: Add this as a python option
    // this.scene.background = new THREE.TextureLoader().load(blueBg);

    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(this.ambientLight);

    this.camera = new THREE.Camera();
    this.scene.add(this.camera);

    // Set up source stuff
    console.log('Set up source stuff');
    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam'
      // source height/width used to set ideal in userMediaConstraints
      // sourceWidth: this.get('width'),
      // sourceHeight: this.get('height'),
      // displayWidth: this.get('width'),
      // displayHeight: this.get('height')
    });

    // TODO: resize? Height of cell doesn't change on resize, so to maintain aspect ratio, width of video shouldn't change either
    this.arToolkitSource.init();

    // Set up context stuff
    console.log('Set up context stuff');
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

    // Set up marker roots
    console.log('Set up marker roots');
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

    this.rotationArray = [
      new THREE.Vector3(-Math.PI / 2, 0, 0),
      new THREE.Vector3(0, -Math.PI / 2, Math.PI / 2),
      new THREE.Vector3(Math.PI / 2, 0, Math.PI),
      new THREE.Vector3(-Math.PI / 2, Math.PI / 2, 0),
      new THREE.Vector3(Math.PI, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ];

    for (let i = 0; i < 6; i++) {
      this.markerRoot = new THREE.Group();

      this.markerRootArray.push(this.markerRoot);

      this.scene.add(this.markerRoot);

      this.markerControls = new THREEx.ArMarkerControls(
        this.arToolkitContext,
        this.markerRoot,
        {
          type: 'pattern',
          patternUrl:
            THREEx.ArToolkitContext.baseURL +
            'examples/marker-training/examples/pattern-files/pattern-' +
            this.patternArray[i] +
            '.patt'
        }
      );

      this.markerGroup = new THREE.Group();
      this.markerGroupArray.push(this.markerGroup);

      this.markerGroup.position.y = -1.25 / 2;
      this.markerGroup.rotation.setFromVector3(this.rotationArray[i]);

      this.markerRoot.add(this.markerGroup);
    }

    // Set up scene stuff
    console.log('Set up scene stuff');
    this.sceneGroup = new THREE.Group();

    // a 1x1x1 cube model with scale factor 1.25 fills up the physical cube
    this.sceneGroup.scale.set(1.75 / 2, 1.75 / 2, 1.75 / 2);

    // Build stage
    console.log('Build Stage');
    this.loader = new THREE.TextureLoader();

    // TODO: remove old model first
    // if (this.stage) {
    //   this.removeFromScene(this.stage);
    // }

    // reversed cube
    this.stageMesh = new THREE.MeshBasicMaterial({
      // map: this.stageTexture,
      color: '#1a1b26',
      side: THREE.BackSide
    });

    this.stage = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), this.stageMesh);
    this.sceneGroup.add(this.stage);

    // Cube edges
    console.log('Cube edges');
    this.edgeGroup = new THREE.Group();

    this.edgeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 32);

    this.edgeCenters = [
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

    this.edgeRotations = [
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
        this.edgeGeometry,
        new THREE.MeshLambertMaterial({
          color: 0x262626
        })
      );

      edge.position.copy(this.edgeCenters[i]);
      edge.rotation.setFromVector3(this.edgeRotations[i]);

      this.edgeGroup.add(edge);
    }

    this.sceneGroup.add(this.edgeGroup);

    // Load model
    console.log('Load model');
    //TODO: Fix this
    this.gltfLoader = new GLTFLoader();
    // if (!this.gltfLoader) {
    // }

    // remove old model first
    if (this.gltfModel) {
      //this.removeFromScene(this.gltfModel);
      console.log('This is where remove should go');
    }

    // load model
    this.gltfLoader.load(
      'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf',
      gltf => {
        const scale = 1.0;
        this.gltfModel = gltf.scene;
        this.gltfModel.scale.set(scale, scale, scale);
        this.gltfModel.position.fromArray([0, 0, 0]);

        console.log('gltf', gltf);

        console.log('this.gltfModel', this.gltfModel);
        this.animations = gltf.animations;
        // this.mixer = new THREE.AnimationMixer(this.gltfModel);

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

    // fancy light
    this.pointLight = new THREE.PointLight(0xffffff, 1, 50);
    this.pointLight.position.set(0.5, 3, 2);
    this.scene.add(this.pointLight);

    // View Stuff
    // start time for FPS limit
    this.then = performance.now();
    this.fpsInterval = 1000 / 60;

    // Check if webcam feed already exists
    this.webcamFromArjs = document.getElementById('arjs-video');

    // Wait for AR.js to set up webcam feed before rendering view
    // if (!this.webcamFromArjs) {
    //   // await this.webcam_loaded;
    //   console.log('awaiting arjs video');
    // }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    this.renderer.setSize(640, 480);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0px';
    this.renderer.domElement.style.left = '0px';

    this.node.appendChild(this.renderer.domElement);

    // // Create new webcam element
    // this.existingWebcam = document.getElementById('arjs-video');
    // this.newWebcam = this.existingWebcam.cloneNode(true);
    // this.newWebcam.srcObject = this.existingWebcam.srcObject;
    // this.newWebcam.id = 'webcamViewNew';
    // this.newWebcam.style.display = '';
    // this.node.appendChild(this.newWebcam);

    this.setUpVideo();
    this.animate();
  }

  readonly clock: THREE.Clock;
  readonly scene: THREE.Scene;
  readonly ambientLight: THREE.AmbientLight;
  readonly camera: THREE.Camera;
  arToolkitSource: any;
  arToolkitContext: any;
  markerControls: any;
  readonly markerRootArray: THREE.Group[];
  readonly markerGroupArray: THREE.Group[];
  readonly patternArray: string[];
  readonly rotationArray: THREE.Vector3[];
  markerRoot: THREE.Group;
  markerGroup: THREE.Group;
  readonly sceneGroup: THREE.Group;
  readonly pointLight: THREE.PointLight;
  readonly loader: THREE.TextureLoader;
  readonly stageMesh: THREE.MeshBasicMaterial;
  readonly stage: THREE.Mesh;
  readonly edgeGroup: THREE.Group;
  readonly edgeGeometry: THREE.CylinderGeometry;
  readonly edgeCenters: THREE.Vector3[];
  readonly edgeRotations: THREE.Vector3[];
  gltfLoader: GLTFLoader;
  gltfModel: any;
  okToLoadModel: boolean;
  animations: THREE.AnimationClip[] | undefined;
  mixer: any;
  renderer: THREE.WebGLRenderer;
  animationRequestId: number | undefined;
  mixerUpdateDelta: number;
  now: number;
  then: number;
  elapsed: number;
  readonly fpsInterval: number;
  // observer: IntersectionObserver;
  existingWebcam: any;
  newWebcam: any;
  webcam_loaded: any;
  resolve: any;
  webcamFromArjs: HTMLElement | null;

  animate() {
    this.animationRequestId = window.requestAnimationFrame(
      this.animate.bind(this)
    );

    this.mixerUpdateDelta = this.clock.getDelta();

    this.now = performance.now();

    // time elapsed since last frame
    // TODO: I think I can use getDelta from the three clock here maybe?
    this.elapsed = this.now - this.then;

    // if enough time has passed to render the next frame
    if (this.elapsed > this.fpsInterval) {
      this.then = this.now - (this.elapsed % this.fpsInterval);

      this.update();
      // this.mixer.update(this.mixerUpdateDelta);

      this.renderer.render(this.scene, this.camera);
    }
  }

  update() {
    // update artoolkit on every frame
    if (this.arToolkitSource.ready !== false) {
      this.arToolkitContext.update(this.arToolkitSource.domElement);
    }

    for (let i = 0; i < 6; i++) {
      if (this.markerRootArray[i].visible) {
        this.markerGroupArray[i].add(this.sceneGroup);
        // console.log("visible: " + this.model.patternArray[i]);
        break;
      }
    }
  }

  async setUpVideo() {
    await this.webcam_loaded;
    // Create new webcam element
    this.existingWebcam = document.getElementById('arjs-video');
    this.newWebcam = this.existingWebcam.cloneNode(true);
    this.newWebcam.srcObject = this.existingWebcam.srcObject;
    this.newWebcam.id = 'webcamViewNew';
    this.newWebcam.style.display = '';
    this.newWebcam.style.zIndex = '0';
    // this.newWebcam.classList.add("jl-vid");
    this.node.appendChild(this.newWebcam);
  }
}
window.addEventListener('markerFound', () => {
  console.log('Marker found');
});

window.addEventListener('markerLost', () => {
  console.log('Marker lost');
});

/**
 * Activate the APOD widget extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  settingRegistry: ISettingRegistry | null,
  restorer: ILayoutRestorer | null
) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  // if (settingRegistry) {
  //   settingRegistry
  //     .load(plugin.id)
  //     .then(settings => {
  //       console.log(
  //         'jupyterlab_arpresent settings loaded:',
  //         settings.composite
  //       );
  //     })
  //     .catch(reason => {
  //       console.error(
  //         'Failed to load settings for jupyterlab_arpresent.',
  //         reason
  //       );
  //     });
  // }

  // requestAPI<any>('get-example')
  //   .then(data => {
  //     console.log(data);
  //   })
  //   .catch(reason => {
  //     console.error(
  //       `The jupyterlab_arpresent server extension appears to be missing.\n${reason}`
  //     );
  //   });
  let widget: MainAreaWidget<APODWidget>;

  // Add an application command
  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: () => {
      // Regenerate the widget if disposed
      if (!widget || widget.isDisposed) {
        const content = new APODWidget();
        widget = new MainAreaWidget({ content });
        widget.id = 'apod-jupyterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      // if (!tracker.has(widget)) {
      //   // Track the state of the widget for later restoration
      //   tracker.add(widget);
      // }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }
      // Refresh the picture in the widget
      // widget.content.updateAPODImage();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });

  // Track and restore the widget state
  // const tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
  //   namespace: 'apod'
  // });
  // if (restorer) {
  //   restorer.restore(tracker, {
  //     command,
  //     name: () => 'apod'
  //   });
  // }
}

/**
 * Initialization data for the jupyterlab_arpresent extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_arpresent',
  description: 'Video presentation over WebRTC with AR capabilities.',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ILayoutRestorer, ISettingRegistry],
  activate: activate
};

export default plugin;
