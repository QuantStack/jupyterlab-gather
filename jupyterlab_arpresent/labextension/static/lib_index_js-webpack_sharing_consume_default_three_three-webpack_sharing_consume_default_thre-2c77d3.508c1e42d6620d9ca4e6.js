"use strict";
(self["webpackChunkjupyterlab_arpresent"] = self["webpackChunkjupyterlab_arpresent"] || []).push([["lib_index_js-webpack_sharing_consume_default_three_three-webpack_sharing_consume_default_thre-2c77d3"],{

/***/ "./lib/arCube.js":
/*!***********************!*\
  !*** ./lib/arCube.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ar-js-org/ar.js/three.js/build/ar-threex.js */ "./node_modules/@ar-js-org/ar.js/three.js/build/ar-threex.js");
/* harmony import */ var _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "webpack/sharing/consume/default/three/three?362d");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var _hms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hms */ "./lib/hms.js");

//@ts-expect-error AR.js doesn't have type definitions




const FIRST_SCENE = 0;
const SECOND_SCENE = 1;
class ArCube {
    /**
     * Construct a new arpresent widget.
     */
    constructor(node) {
        this.onSuccessfulLoad = (gltf, sceneNumber) => {
            console.log('on successful load');
            const scale = 1.0;
            const gltfModel = gltf.scene;
            gltfModel.scale.set(scale, scale, scale);
            gltfModel.position.fromArray([0, -1, 0]);
            gltfModel.name = `model${sceneNumber}`;
            this.animations = gltf.animations;
            this.mixer = new three__WEBPACK_IMPORTED_MODULE_2__.AnimationMixer(gltfModel);
            if (this.animations) {
                this.animations.forEach(clip => {
                    this.mixer.clipAction(clip).play();
                });
            }
            this.sceneGroups[sceneNumber].add(gltfModel);
            this.okToLoadModel = true;
            _hms__WEBPACK_IMPORTED_MODULE_3__.hmsActions.setAppData('canLoadModel', true);
            console.log('model loaded parse');
        };
        this.initialize();
        // this.animate();
        // window.addEventListener('markerFound', () => {
        //   console.log('Marker found');
        // });
        // window.addEventListener('markerLost', () => {
        //   console.log('Marker lost');
        // });
    }
    initialize() {
        this.sceneGroups = [];
        this.setupThreeStuff();
        this.setupSource();
        this.setupContext();
        this.setupMarkerRoots();
        this.setupScene(FIRST_SCENE);
        // this.setupScene(1);
    }
    setupThreeStuff() {
        console.log('setting up threee stuff');
        this.okToLoadModel = true;
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        // promise to track if AR.js has loaded the webcam
        this.webcam_loaded = new Promise(resolve => {
            this.resolve = resolve;
        });
        window.addEventListener('arjs-video-loaded', (e) => {
            e.detail.component.style.display = 'none';
            this.resolve();
        });
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        this.camera = new three__WEBPACK_IMPORTED_MODULE_2__.Camera();
        this.scene.add(this.camera);
        // Camera lights
        const camLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 1);
        camLight.position.set(-1, 2, 4);
        this.camera.add(camLight);
        // const canvas = document.getElementById('target') as HTMLCanvasElement;
        // const offscreen = canvas?.transferControlToOffscreen();
        // if (!canvas?.transferControlToOffscreen) {
        //   console.log('no support');
        // }
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer({
            antialias: true,
            alpha: true,
            // canvas: canvas,
            preserveDrawingBuffer: true,
            premultipliedAlpha: false
        });
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color('lightgrey'), 0);
        //Not render target things
        const isScreenShareOn = _hms__WEBPACK_IMPORTED_MODULE_3__.hmsStore.getState(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectIsSomeoneScreenSharing); //useHMSStore(selectIsSomeoneScreenSharing);
        if (isScreenShareOn) {
            console.log('iffing');
            const container = document.getElementById('screen-share-container');
            container === null || container === void 0 ? void 0 : container.appendChild(this.renderer.domElement);
        }
        else {
            // Renderer target things
            console.log('elsing');
            this.renderTarget = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderTarget();
            this.renderTarget.setSize(1280, 720);
            this.renderer.setRenderTarget(this.renderTarget);
        }
        // this.renderer.setSize(1280, 720, false);
        // this.renderer.domElement.style.position = 'absolute';
        // this.renderer.domElement.style.top = '0px';
        // this.renderer.domElement.style.left = '0px';
        this.clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock();
        this.deltaTime = 0;
        this.totalTime = 0;
        _hms__WEBPACK_IMPORTED_MODULE_3__.hmsActions.setAppData('renderer', this.renderer);
    }
    setupSource() {
        console.log('setting up source');
        this.arToolkitSource = new _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArToolkitSource({
            sourceType: 'webcam'
        });
        this.arToolkitSource.init();
    }
    setupContext() {
        console.log('setting up context');
        // create atToolkitContext
        this.arToolkitContext = new _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArToolkitContext({
            cameraParametersUrl: _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
            detectionMode: 'mono'
        });
        // copy projection matrix to camera when initialization complete
        this.arToolkitContext.init(() => {
            this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());
        });
    }
    setupMarkerRoots() {
        console.log('setting up marker roots');
        this.markerRootArray = [];
        this.markerGroupArray = [];
        this.hiroRootArray = [];
        this.hiroGroupArray = [];
        this.patternArray = [
            'letterA',
            'letterB',
            'letterC',
            'letterD',
            'letterF',
            'kanji'
        ];
        this.patternArraySecondModel = [
            'letterJ',
            'letterK',
            'letterL',
            'letterM',
            'letterN',
            'letterP'
        ];
        const rotationArray = [
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-Math.PI / 2, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, -Math.PI / 2, Math.PI / 2),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI / 2, 0, Math.PI),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-Math.PI / 2, Math.PI / 2, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0)
        ];
        for (let i = 0; i < 6; i++) {
            const markerRoot = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
            this.markerRootArray.push(markerRoot);
            this.scene.add(markerRoot);
            const markerControls = new _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArMarkerControls(this.arToolkitContext, markerRoot, {
                type: 'pattern',
                patternUrl: _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArToolkitContext.baseURL +
                    'examples/marker-training/examples/pattern-files/pattern-' +
                    this.patternArray[i] +
                    '.patt'
            });
            const markerGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
            this.markerGroupArray.push(markerGroup);
            markerGroup.position.y = -1.25 / 2;
            markerGroup.rotation.setFromVector3(rotationArray[i]);
            markerRoot.add(markerGroup);
        }
        for (let i = 0; i < 6; i++) {
            const hiroRoot = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
            this.hiroRootArray.push(hiroRoot);
            this.scene.add(hiroRoot);
            const hiroControls = new _ar_js_org_ar_js_three_js_build_ar_threex_js__WEBPACK_IMPORTED_MODULE_1__.ArMarkerControls(this.arToolkitContext, hiroRoot, {
                type: 'pattern',
                patternUrl: 'https://raw.githubusercontent.com/gjmooney/jupyterlab-arpresent/main/pattern-files/pattern-' +
                    this.patternArraySecondModel[i] +
                    '.patt'
            });
            const hiroGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
            this.hiroGroupArray.push(hiroGroup);
            hiroGroup.position.y = -1.25 / 2;
            hiroGroup.rotation.setFromVector3(rotationArray[i]);
            hiroRoot.add(hiroGroup);
        }
    }
    setupScene(sceneNumber) {
        console.log('setting up scene');
        const sceneGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
        // a 1x1x1 cube model with scale factor 1.25 fills up the physical cube
        sceneGroup.scale.set(1.75 / 2, 1.75 / 2, 1.75 / 2);
        sceneGroup.name = `scene${sceneNumber}`;
        // reversed cube
        //TODO: Can probably just have one cube and add it to scenes as needed
        sceneGroup.add(new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(new three__WEBPACK_IMPORTED_MODULE_2__.BoxGeometry(2, 2, 2), new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({
            color: '#2EEEFF',
            side: three__WEBPACK_IMPORTED_MODULE_2__.BackSide
        })));
        // cube edges
        const edgeGroup = new three__WEBPACK_IMPORTED_MODULE_2__.Group();
        const edgeGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.03, 0.03, 2, 32);
        const edgeCenters = [
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, -1, -1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 1, -1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, -1, 1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 1, 1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, 0, -1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 0, -1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, 0, 1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 0, 1),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, -1, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, -1, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, 1, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 0)
        ];
        const edgeRotations = [
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, Math.PI / 2),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, Math.PI / 2),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, Math.PI / 2),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, Math.PI / 2),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI / 2, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI / 2, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI / 2, 0, 0),
            new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(Math.PI / 2, 0, 0)
        ];
        for (let i = 0; i < 12; i++) {
            const edge = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(edgeGeometry, new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
                color: '#262626'
            }));
            edge.position.copy(edgeCenters[i]);
            edge.rotation.setFromVector3(edgeRotations[i]);
            edgeGroup.add(edge);
        }
        sceneGroup.add(edgeGroup);
        this.sceneGroups.push(sceneGroup);
        this.loadModel(sceneNumber);
        console.log('fin');
    }
    loadModel(sceneNumber, modelName) {
        console.log('loading model');
        if (!this.gltfLoader) {
            this.gltfLoader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        }
        const model = this.findModelByName(modelName ? modelName : 'duck');
        // remove old model first
        // if (this.gltfModel) {
        //   this.removeFromScene(sceneNumber, this.gltfModel);
        // }
        // load model
        // eslint-disable-next-line no-constant-condition
        if (true) {
            this.okToLoadModel = false;
            _hms__WEBPACK_IMPORTED_MODULE_3__.hmsActions.setAppData('canLoadModel', false);
            if ('url' in model) {
                this.gltfLoader.load(model.url, gltf => {
                    this.onSuccessfulLoad(gltf, sceneNumber);
                }, () => {
                    console.log('model loading');
                }, error => {
                    console.log('Error loading model url', error);
                });
            }
            else if ('gltf' in model) {
                const data = JSON.stringify(model.gltf);
                this.gltfLoader.parse(data, '', gltf => {
                    this.onSuccessfulLoad(gltf, sceneNumber);
                }, error => {
                    console.log('Error loading model gltf', error);
                });
            }
        }
    }
    findModelByName(name) {
        const modelRegistry = _hms__WEBPACK_IMPORTED_MODULE_3__.hmsStore.getState((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('modelRegistry'));
        return modelRegistry.find((model) => model.name === name);
    }
    changeModelInScene(sceneNumber, modelName) {
        const sceneGroup = this.sceneGroups[sceneNumber];
        const modelToRemove = sceneGroup.getObjectByName(`model${sceneNumber}`);
        if (modelToRemove) {
            sceneGroup.remove(modelToRemove);
        }
        this.loadModel(sceneNumber, modelName);
    }
    removeFromScene(sceneNumber, object3d) {
        this.sceneGroups[sceneNumber].remove(object3d);
    }
    enableSecondScene() {
        console.log('enaling');
        this.isSecondScene = true;
        this.setupScene(SECOND_SCENE);
    }
    disableSecondScene() {
        console.log('disabling');
        this.isSecondScene = false;
        //TODO this won't work with more than two scenes but it's fine for now
        this.sceneGroups.pop();
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
        // console.log('root array', this.markerRootArray);
        for (let i = 0; i < 6; i++) {
            if (this.markerRootArray[i].visible) {
                //TODO want to iterate through new scene group list
                this.markerGroupArray[i].add(this.sceneGroups[0]);
                // console.log('visible: ' + this.patternArray[i]);
                break;
            }
        }
        if (this.isSecondScene) {
            for (let i = 0; i < 6; i++) {
                if (this.hiroRootArray[i].visible) {
                    //TODO want to iterate through new scene group list
                    this.hiroGroupArray[i].add(this.sceneGroups[1]);
                    // console.log('visible: ' + this.patternArraySecondModel[i - 6]);
                    break;
                }
            }
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArCube);


/***/ }),

/***/ "./lib/arCubePlugin.js":
/*!*****************************!*\
  !*** ./lib/arCubePlugin.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @100mslive/hms-video-store */ "./node_modules/@100mslive/hms-video-store/dist/index.js");
/* harmony import */ var _arCube__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./arCube */ "./lib/arCube.js");
/* harmony import */ var _hms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hms */ "./lib/hms.js");



class ArCubePlugin {
    //   outputCtx: CanvasRenderingContext2D | null;
    constructor() {
        // this.outputCtx = null;
        this.input = null;
        this.output = null;
    }
    blendImages(imageDataBottom, imageDataTop) {
        // Ensure the dimensions of both ImageData objects are the same
        if (imageDataBottom.width !== imageDataTop.width ||
            imageDataBottom.height !== imageDataTop.height) {
            throw new Error('ImageData dimensions must match');
        }
        // Create a new ImageData object for the blended image
        const blendedImageData = new ImageData(imageDataBottom.width, imageDataBottom.height);
        // Blend pixel data from both ImageData objects
        for (let i = 0; i < blendedImageData.data.length; i += 4) {
            // Combine pixel values from both images using alpha blending
            const alphaTop = imageDataTop.data[i + 3] / 255; // Alpha value of the top image
            const alphaBottom = 1 - alphaTop; // Alpha value of the bottom image
            // Blend RGB channels
            blendedImageData.data[i] =
                imageDataBottom.data[i] * alphaBottom + imageDataTop.data[i] * alphaTop;
            blendedImageData.data[i + 1] =
                imageDataBottom.data[i + 1] * alphaBottom +
                    imageDataTop.data[i + 1] * alphaTop;
            blendedImageData.data[i + 2] =
                imageDataBottom.data[i + 2] * alphaBottom +
                    imageDataTop.data[i + 2] * alphaTop;
            // Preserve alpha channel
            blendedImageData.data[i + 3] = 255; // Fully opaque
        }
        return blendedImageData;
    }
    flipImageDataVertically(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const flippedData = new Uint8ClampedArray(width * height * 4);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const sourceIndex = (y * width + x) * 4;
                const destIndex = ((height - y - 1) * width + x) * 4;
                flippedData[destIndex] = imageData.data[sourceIndex];
                flippedData[destIndex + 1] = imageData.data[sourceIndex + 1];
                flippedData[destIndex + 2] = imageData.data[sourceIndex + 2];
                flippedData[destIndex + 3] = imageData.data[sourceIndex + 3];
            }
        }
        return new ImageData(flippedData, width, height);
    }
    /**
     * @param input {HTMLCanvasElement}
     * @param output {HTMLCanvasElement}
     */
    processVideoFrame(input, output) {
        if (!input || !output) {
            throw new Error('Plugin invalid input/output');
        }
        this.input = input;
        this.output = output;
        // we don't want to change the dimensions so set the same width, height
        const width = input.width;
        const height = input.height;
        output.width = width;
        output.height = height;
        const threeJsContext = this.arCube.renderer.getContext();
        const inputCtx = input.getContext('2d');
        const inputImgData = inputCtx === null || inputCtx === void 0 ? void 0 : inputCtx.getImageData(0, 0, width, height);
        const pixels = new Uint8Array(width * height * 4);
        this.arCube.renderer.readRenderTargetPixels(this.arCube.renderTarget, 0, 0, width, height, pixels);
        // threeJsContext?.readPixels(
        //   0,
        //   0,
        //   width,
        //   height,
        //   threeJsContext.RGBA,
        //   threeJsContext.UNSIGNED_BYTE,
        //   pixels
        // );
        const threeImageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
        const outputCtx = output.getContext('2d');
        if (!inputImgData) {
            console.log('no image input data');
        }
        const flippedImage = this.flipImageDataVertically(threeImageData);
        const blendedData = this.blendImages(inputImgData, flippedImage);
        outputCtx === null || outputCtx === void 0 ? void 0 : outputCtx.putImageData(blendedData, 0, 0);
    }
    getName() {
        return 'arcube-plugin';
    }
    /**
     * @deprecated
     */
    isSupported() {
        return true;
    }
    checkSupport() {
        // we're not doing anything complicated, it's supported on all browsers
        const browserResult = {};
        browserResult.isSupported = true;
        return browserResult;
    }
    async init() {
        this.node = _hms__WEBPACK_IMPORTED_MODULE_0__.hmsStore.getState((0,_100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__.selectAppData)('node'));
        this.arCube = new _arCube__WEBPACK_IMPORTED_MODULE_2__["default"](this.node);
        _hms__WEBPACK_IMPORTED_MODULE_0__.hmsActions.setAppData('arCube', this.arCube);
        this.arCube.animate();
    }
    getPluginType() {
        return _100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__.HMSVideoPluginType.TRANSFORM; // because we transform the image
    }
    getContextType() {
        return _100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__.HMSVideoPluginCanvasContextType['2D'];
    }
    stop() { } // placeholder, nothing to stop
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArCubePlugin);


/***/ }),

/***/ "./lib/components/ControlBar.js":
/*!**************************************!*\
  !*** ./lib/components/ControlBar.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PluginButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PluginButton */ "./lib/components/PluginButton.js");
/* harmony import */ var _RaiseHand__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RaiseHand */ "./lib/components/RaiseHand.js");




const ControlBar = () => {
    const hmsActions = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSActions)();
    const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useAVToggle)();
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "control-bar" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: "btn-control", onClick: toggleAudio }, isLocalAudioEnabled ? 'Mute' : 'Unmute'),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: "btn-control", onClick: toggleVideo }, isLocalVideoEnabled ? 'Hide' : 'Unhide'),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_PluginButton__WEBPACK_IMPORTED_MODULE_2__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_RaiseHand__WEBPACK_IMPORTED_MODULE_3__["default"], null),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { id: "leave-btn", className: "btn-danger", onClick: () => hmsActions.leave() }, "Leave Room")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ControlBar);


/***/ }),

/***/ "./lib/components/Icons.js":
/*!*********************************!*\
  !*** ./lib/components/Icons.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Icons: () => (/* binding */ Icons),
/* harmony export */   LogoIcon: () => (/* binding */ LogoIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _icons_duckduck_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../icons/duckduck.svg */ "./icons/duckduck.svg");



const Icons = {
    raisedHand: ({ className }) => (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("path", { d: "M256 0c-25.3 0-47.2 14.7-57.6 36c-7-2.6-14.5-4-22.4-4c-35.3 0-64 28.7-64 64V261.5l-2.7-2.7c-25-25-65.5-25-90.5 0s-25 65.5 0 90.5L106.5 437c48 48 113.1 75 181 75H296h8c1.5 0 3-.1 4.5-.4c91.7-6.2 165-79.4 171.1-171.1c.3-1.5 .4-3 .4-4.5V160c0-35.3-28.7-64-64-64c-5.5 0-10.9 .7-16 2V96c0-35.3-28.7-64-64-64c-7.9 0-15.4 1.4-22.4 4C303.2 14.7 281.3 0 256 0zM240 96.1c0 0 0-.1 0-.1V64c0-8.8 7.2-16 16-16s16 7.2 16 16V95.9c0 0 0 .1 0 .1V232c0 13.3 10.7 24 24 24s24-10.7 24-24V96c0 0 0 0 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16v55.9c0 0 0 .1 0 .1v80c0 13.3 10.7 24 24 24s24-10.7 24-24V160.1c0 0 0-.1 0-.1c0-8.8 7.2-16 16-16s16 7.2 16 16V332.9c-.1 .6-.1 1.3-.2 1.9c-3.4 69.7-59.3 125.6-129 129c-.6 0-1.3 .1-1.9 .2H296h-8.5c-55.2 0-108.1-21.9-147.1-60.9L52.7 315.3c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L119 336.4c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2V96c0-8.8 7.2-16 16-16c8.8 0 16 7.1 16 15.9V232c0 13.3 10.7 24 24 24s24-10.7 24-24V96.1z" }))),
    spinner: ({ className }) => (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("path", { d: "M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" })))
};
const LogoIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'arpresent:icon_logo',
    svgstr: _icons_duckduck_svg__WEBPACK_IMPORTED_MODULE_2__
});


/***/ }),

/***/ "./lib/components/JoinForm.js":
/*!************************************!*\
  !*** ./lib/components/JoinForm.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const Join = () => {
    const hmsActions = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSActions)();
    const [inputValues, setInputValues] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        userName: 'we',
        roomCode: 'ibj-yxje-nda'
    });
    const handleInputChange = (e) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmit = async (e) => {
        console.log('clicking join');
        e.preventDefault();
        const { userName = '', roomCode = '' } = inputValues;
        // use room code to fetch auth token
        const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
        try {
            await hmsActions.join({
                userName,
                authToken,
                settings: {
                    isAudioMuted: true,
                    isVideoMuted: false
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("form", { onSubmit: handleSubmit },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("h2", null, "Join Room"),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "join-form-input" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { htmlFor: "userName" }, "Username"),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { required: true, value: inputValues.userName, onChange: handleInputChange, id: "userName", type: "text", name: "userName", placeholder: "Your name" })),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "join-form-input" },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("label", { htmlFor: "room-code" }, "Room ID"),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { id: "room-code", type: "text", name: "roomCode", placeholder: "Room code", onChange: handleInputChange, value: inputValues.roomCode })),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: "btn-primary" }, "Join")));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Join);


/***/ }),

/***/ "./lib/components/ModelListItem.js":
/*!*****************************************!*\
  !*** ./lib/components/ModelListItem.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const ModelListItem = ({ model, handleClick, className }) => {
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.Button, { minimal: true, className: `${className} model-list-item`, onClick: () => handleClick(model) }, model.name));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModelListItem);


/***/ }),

/***/ "./lib/components/Peer.js":
/*!********************************!*\
  !*** ./lib/components/Peer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Icons */ "./lib/components/Icons.js");



const Peer = ({ peer, className }) => {
    // TODO: Use peer id instead of Peer
    const { videoRef } = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useVideo)({
        trackId: peer.videoTrack
    });
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: 'peer-tile' },
        peer.isHandRaised ? (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Icons__WEBPACK_IMPORTED_MODULE_2__.Icons.raisedHand, { className: "peer-hand-raised-icon" })) : (''),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("video", { ref: videoRef, className: `${className} ${peer.isHandRaised ? 'peer-hand-raised' : ''}`, autoPlay: true, muted: true, playsInline: true }),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "peer-name" },
            peer.name,
            " ",
            peer.isLocal ? '(You)' : '')));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Peer);


/***/ }),

/***/ "./lib/components/PluginButton.js":
/*!****************************************!*\
  !*** ./lib/components/PluginButton.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _arCubePlugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../arCubePlugin */ "./lib/arCubePlugin.js");



const PluginButton = () => {
    const hmsActions = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSActions)();
    const localPeer = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectLocalPeer);
    const isPresenting = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('isPresenting'));
    const arPlugin = new _arCubePlugin__WEBPACK_IMPORTED_MODULE_2__["default"]();
    const isPluginLoaded = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectIsLocalVideoPluginPresent)(arPlugin.getName()));
    const togglePlugin = async () => {
        // don't load plugin locally if someone else is presenting
        if (!isPluginLoaded && !isPresenting) {
            console.log('adding');
            hmsActions.sessionStore.set('isPresenting', true);
            hmsActions.sessionStore.set('presenterId', localPeer);
            await hmsActions.addPluginToVideoTrack(arPlugin);
        }
        else {
            console.log('removing');
            hmsActions.sessionStore.set('isPresenting', false);
            hmsActions.sessionStore.set('presenterId', '');
            await hmsActions.removePluginFromVideoTrack(arPlugin);
        }
    };
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: "btn-control", onClick: togglePlugin }, isPluginLoaded ? 'Stop AR' : 'Start AR'));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PluginButton);


/***/ }),

/***/ "./lib/components/RaiseHand.js":
/*!*************************************!*\
  !*** ./lib/components/RaiseHand.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Icons */ "./lib/components/Icons.js");



const RaiseHand = () => {
    const localPeerId = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectLocalPeerID);
    const isHandRaised = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectHasPeerHandRaised)(localPeerId));
    const hmsActions = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSActions)();
    const toggleRaiseHand = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(async () => {
        if (isHandRaised) {
            await hmsActions.lowerLocalPeerHand();
        }
        else {
            await hmsActions.raiseLocalPeerHand();
        }
    }, [hmsActions, isHandRaised]);
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: "btn-control", onClick: toggleRaiseHand },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: `icon ${isHandRaised ? 'icon-breathe' : ''}` },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_Icons__WEBPACK_IMPORTED_MODULE_2__.Icons.raisedHand, null)),
        ' '));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RaiseHand);


/***/ }),

/***/ "./lib/components/RootDisplay.js":
/*!***************************************!*\
  !*** ./lib/components/RootDisplay.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RootDisplayWidget: () => (/* binding */ RootDisplayWidget)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hms */ "./lib/hms.js");
/* harmony import */ var _layouts_MainDisplay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layouts/MainDisplay */ "./lib/layouts/MainDisplay.js");




const RootDisplay = ({ node, modelList, modelRegistryChanged }) => {
    const childRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    // const hmsActions = useHMSActions();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        modelRegistryChanged.connect(() => {
            _hms__WEBPACK_IMPORTED_MODULE_2__.hmsActions.setAppData('modelRegistry', [...modelList]);
            console.log('modelList in root', modelList);
        });
    }, []);
    // TODO: Replace this with session store?
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const initialAppData = {
            node: node,
            canLoadModel: true,
            modelRegistry: [...modelList],
            isPresenting: false,
            presenterId: '',
            selectedModel: null
        };
        _hms__WEBPACK_IMPORTED_MODULE_2__.hmsActions.initAppData(initialAppData);
    }, [_hms__WEBPACK_IMPORTED_MODULE_2__.hmsActions]);
    // TODO: There's probably a better way to do this
    // add overflow: auto to parent container
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (childRef.current) {
            const parent = childRef.current.parentElement;
            parent === null || parent === void 0 ? void 0 : parent.classList.add('overflow');
        }
    }, [childRef]);
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { ref: childRef, className: "Root" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_layouts_MainDisplay__WEBPACK_IMPORTED_MODULE_3__.MainDisplay, null)));
};
class RootDisplayWidget extends _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.ReactWidget {
    constructor(modelList, modelRegistryChanged) {
        super();
        this._modelList = modelList;
        this._modelRegistryChanged = modelRegistryChanged;
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_hms__WEBPACK_IMPORTED_MODULE_2__.TypedHMSRoomProvider, null,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(RootDisplay, { node: this.node, modelList: this._modelList, modelRegistryChanged: this._modelRegistryChanged })));
    }
}


/***/ }),

/***/ "./lib/hms.js":
/*!********************!*\
  !*** ./lib/hms.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TypedHMSRoomProvider: () => (/* binding */ TypedHMSRoomProvider),
/* harmony export */   hmsActions: () => (/* binding */ hmsActions),
/* harmony export */   hmsStore: () => (/* binding */ hmsStore)
/* harmony export */ });
/* harmony import */ var _100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @100mslive/hms-video-store */ "./node_modules/@100mslive/hms-video-store/dist/index.js");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);


const hmsManager = new _100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__.HMSReactiveStore();
const TypedHMSRoomProvider = (_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.HMSRoomProvider);
hmsManager.triggerOnSubscribe();
const hmsStore = hmsManager.getStore();
const hmsActions = hmsManager.getActions();
hmsActions.setLogLevel(_100mslive_hms_video_store__WEBPACK_IMPORTED_MODULE_1__.HMSLogLevel.WARN);



/***/ }),

/***/ "./lib/icons.js":
/*!**********************!*\
  !*** ./lib/icons.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arIcon: () => (/* binding */ arIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icons_ar_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/icons/ar.svg */ "./style/icons/ar.svg");
/*
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */
// This file is based on iconimports.ts in @jupyterlab/ui-components, but is manually generated.


const arIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'jupyterlab-ar::ar',
    svgstr: _style_icons_ar_svg__WEBPACK_IMPORTED_MODULE_1__
});


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IArPresentRegistryToken: () => (/* reexport safe */ _registry__WEBPACK_IMPORTED_MODULE_4__.IArPresentRegistryToken),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/launcher */ "webpack/sharing/consume/default/@jupyterlab/launcher");
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/Icons */ "./lib/components/Icons.js");
/* harmony import */ var _components_RootDisplay__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/RootDisplay */ "./lib/components/RootDisplay.js");
/* harmony import */ var _model_examples_models__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./model-examples/models */ "./lib/model-examples/models.js");
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./registry */ "./lib/registry.js");
/* harmony import */ var _widgets_Sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./widgets/Sidebar */ "./lib/widgets/Sidebar.js");










/**
 * Initialization data for the jupyterlab_arpresent extension.
 */
const plugin = {
    id: 'jupyterlab_arpresent',
    description: 'Video presentation over WebRTC with AR capabilities.',
    autoStart: true,
    requires: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette, _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__.ILauncher, _registry__WEBPACK_IMPORTED_MODULE_4__.IArPresentRegistryToken],
    optional: [_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILayoutRestorer, _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_3__.ISettingRegistry],
    activate: (app, palette, launcher, registry, settingRegistry, restorer) => {
        console.log('JupyterLab extension jupyterlab_arpresent is activated!');
        // Register default models
        registry.registerModel({
            name: 'duck',
            url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
        });
        registry.registerModel({
            name: 'brain stem',
            url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/BrainStem/glTF/BrainStem.gltf'
        });
        let widget;
        const sidebarPanel = new _widgets_Sidebar__WEBPACK_IMPORTED_MODULE_5__.SidebarWidget(registry.modelRegistry, registry.modelRegistryChanged);
        sidebarPanel.id = 'AR-sidepanel';
        // Add an application command
        const arPresentCommand = 'arpresent:open';
        app.commands.addCommand(arPresentCommand, {
            label: 'AR Presentation',
            icon: _components_Icons__WEBPACK_IMPORTED_MODULE_6__.LogoIcon,
            execute: () => {
                // Regenerate the widget if disposed
                if (!widget || widget.isDisposed) {
                    const content = new _components_RootDisplay__WEBPACK_IMPORTED_MODULE_7__.RootDisplayWidget(registry.modelRegistry, registry.modelRegistryChanged);
                    widget = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.MainAreaWidget({ content });
                    widget.id = 'arpresent-jupyterlab';
                    widget.title.label = 'AR Presentation';
                    widget.title.closable = true;
                    widget.title.icon = _components_Icons__WEBPACK_IMPORTED_MODULE_6__.LogoIcon;
                }
                // if (!tracker.has(widget)) {
                //   // Track the state of the widget for later restoration
                //   tracker.add(widget);
                // }
                if (!widget.isAttached) {
                    // Attach the widget to the main work area if it's not there
                    app.shell.add(widget, 'main');
                }
                // Activate the widget
                app.shell.activateById(widget.id);
                app.shell.add(widget, 'main');
                app.shell.add(sidebarPanel, 'left', { rank: 2000 });
            }
        });
        // Add the command to the palette.
        palette.addItem({ command: arPresentCommand, category: 'Video Chat' });
        if (launcher) {
            launcher.add({
                command: arPresentCommand,
                category: 'Video Chat',
                rank: 2
            });
        }
        // Track and restore the widget state
        // const tracker = new WidgetTracker<MainAreaWidget<ArPresent>>({
        //   namespace: 'arpresent'
        // });
        // if (restorer) {
        //   restorer.restore(tracker, {
        //     command,
        //     name: () => 'arpresent'
        //   });
        // }
    }
};
const modelRegistryPlugin = {
    id: 'jupyterlab_arpresent:registry',
    description: 'Registry of available models to display in ar present',
    autoStart: true,
    requires: [],
    provides: _registry__WEBPACK_IMPORTED_MODULE_4__.IArPresentRegistryToken,
    activate: () => {
        const modelRegistryManager = new _registry__WEBPACK_IMPORTED_MODULE_4__.ModelManager();
        return modelRegistryManager;
    }
};
const duckPlugin = {
    id: 'jupyterlab_duck',
    description: 'a duck.',
    autoStart: true,
    requires: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette, _registry__WEBPACK_IMPORTED_MODULE_4__.IArPresentRegistryToken],
    activate: (app, palette, registry) => {
        console.log('JupyterLab extension The Duck is activated!');
        const duckPluginCommand = 'duckPlugin:open';
        app.commands.addCommand(duckPluginCommand, {
            label: 'The Duck',
            execute: () => {
                console.log('executing the duck');
                // const data = JSON.stringify(threeCube);
                // const data = JSON.parse(threeCube);
                const data = _model_examples_models__WEBPACK_IMPORTED_MODULE_8__.threeCube;
                registry.registerModel({
                    name: 'Three Cube',
                    gltf: data
                });
            }
        });
        palette.addItem({ command: duckPluginCommand, category: 'Video Chat' });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([plugin, modelRegistryPlugin, duckPlugin]);


/***/ }),

/***/ "./lib/layouts/GridView.js":
/*!*********************************!*\
  !*** ./lib/layouts/GridView.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Peer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Peer */ "./lib/components/Peer.js");



const GridView = () => {
    const peers = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectPeers);
    // const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);
    // const limitMaxTiles = 20;
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "main-grid-container" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "main-grid-view" }, peers.map(peer => (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_components_Peer__WEBPACK_IMPORTED_MODULE_2__["default"], { key: peer.id, peer: peer, className: `peer-video ${peer.isLocal ? 'local' : ''}` }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GridView);


/***/ }),

/***/ "./lib/layouts/MainDisplay.js":
/*!************************************!*\
  !*** ./lib/layouts/MainDisplay.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MainDisplay: () => (/* binding */ MainDisplay)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_ControlBar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ControlBar */ "./lib/components/ControlBar.js");
/* harmony import */ var _components_JoinForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/JoinForm */ "./lib/components/JoinForm.js");
/* harmony import */ var _GridView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GridView */ "./lib/layouts/GridView.js");
/* harmony import */ var _PresenterView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PresenterView */ "./lib/layouts/PresenterView.js");






const MainDisplay = () => {
    const isConnected = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectIsConnectedToRoom);
    const hmsActions = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSActions)();
    const isPresenting = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectSessionStore)('isPresenting'));
    const presenterId = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectSessionStore)('presenterId'));
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (isConnected) {
            hmsActions.sessionStore.observe('isPresenting');
            hmsActions.sessionStore.observe('presenterId');
        }
        window.onunload = () => {
            if (isConnected) {
                hmsActions.sessionStore.set('isPresenting');
                hmsActions.sessionStore.set('presenterId');
                hmsActions.leave();
            }
        };
    }, [hmsActions, isConnected]);
    let ViewComponent;
    if (isPresenting) {
        ViewComponent = _PresenterView__WEBPACK_IMPORTED_MODULE_2__["default"];
    }
    else {
        ViewComponent = _GridView__WEBPACK_IMPORTED_MODULE_3__["default"];
    }
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "App" }, isConnected ? (react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(ViewComponent, null),
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_components_ControlBar__WEBPACK_IMPORTED_MODULE_4__["default"], null))) : (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_components_JoinForm__WEBPACK_IMPORTED_MODULE_5__["default"], null))));
};


/***/ }),

/***/ "./lib/layouts/PeerSidePane.js":
/*!*************************************!*\
  !*** ./lib/layouts/PeerSidePane.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Peer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/Peer */ "./lib/components/Peer.js");


const PeerSidePane = ({ peers }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: "peer-sidepane-list" }, peers.map(peer => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Peer__WEBPACK_IMPORTED_MODULE_1__["default"], { key: peer.id, peer: peer, className: "peer-video" }))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PeerSidePane);


/***/ }),

/***/ "./lib/layouts/PresenterView.js":
/*!**************************************!*\
  !*** ./lib/layouts/PresenterView.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Peer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/Peer */ "./lib/components/Peer.js");
/* harmony import */ var _PeerSidePane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PeerSidePane */ "./lib/layouts/PeerSidePane.js");




const PresenterView = () => {
    const peers = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectPeers);
    const presenter = (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.useHMSStore)((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectSessionStore)('presenterId'));
    return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "presenter-container-main" },
        react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: "presenter-container" }, presenter ? (react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null,
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_components_Peer__WEBPACK_IMPORTED_MODULE_2__["default"], { peer: presenter, className: "presenter-video" }),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_PeerSidePane__WEBPACK_IMPORTED_MODULE_3__["default"], { peers: peers.filter(peer => peer.id !== presenter.id) }))) : (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null, "Waiting...")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PresenterView);


/***/ }),

/***/ "./lib/model-examples/models.js":
/*!**************************************!*\
  !*** ./lib/model-examples/models.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   threeCube: () => (/* binding */ threeCube)
/* harmony export */ });
const threeCube = {
    asset: {
        version: '2.0',
        generator: 'THREE.GLTFExporter'
    },
    scenes: [
        {
            name: 'Scene',
            nodes: [0]
        }
    ],
    scene: 0,
    nodes: [
        {
            matrix: [
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2.5863874181621065,
                -0.336502157380535, 0.39928251351405897, 1
            ],
            name: 'Box',
            mesh: 0
        }
    ],
    bufferViews: [
        {
            buffer: 0,
            byteOffset: 0,
            byteLength: 288,
            target: 34962,
            byteStride: 12
        },
        {
            buffer: 0,
            byteOffset: 288,
            byteLength: 288,
            target: 34962,
            byteStride: 12
        },
        {
            buffer: 0,
            byteOffset: 576,
            byteLength: 192,
            target: 34962,
            byteStride: 8
        },
        {
            buffer: 0,
            byteOffset: 768,
            byteLength: 72,
            target: 34963
        }
    ],
    buffers: [
        {
            byteLength: 840,
            uri: 'data:application/octet-stream;base64,AAAAPwAAAD8AAAA/AAAAPwAAAD8AAAC/AAAAPwAAAL8AAAA/AAAAPwAAAL8AAAC/AAAAvwAAAD8AAAC/AAAAvwAAAD8AAAA/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAA/AAAAvwAAAD8AAAC/AAAAPwAAAD8AAAC/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAA/AAAAvwAAAL8AAAC/AAAAPwAAAL8AAAC/AAAAvwAAAD8AAAA/AAAAPwAAAD8AAAA/AAAAvwAAAL8AAAA/AAAAPwAAAL8AAAA/AAAAPwAAAD8AAAC/AAAAvwAAAD8AAAC/AAAAPwAAAL8AAAC/AAAAvwAAAL8AAAC/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAACAvwAAAAAAAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAgL8AAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAAAAAAIC/AAAAAAAAgD8AAIA/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAgD8AAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AACAPwAAgD8AAAAAAAAAAAAAgD8AAAAAAAAAAAAAgD8AAIA/AACAPwAAAAAAAAAAAACAPwAAAAAAAAAAAACAPwAAgD8AAIA/AAAAAAAAAAAAAIA/AAAAAAAAAAAAAIA/AACAPwAAgD8AAAAAAAAAAAAAgD8AAAAAAAACAAEAAgADAAEABAAGAAUABgAHAAUACAAKAAkACgALAAkADAAOAA0ADgAPAA0AEAASABEAEgATABEAFAAWABUAFgAXABUA'
        }
    ],
    accessors: [
        {
            bufferView: 0,
            componentType: 5126,
            count: 24,
            max: [0.5, 0.5, 0.5],
            min: [-0.5, -0.5, -0.5],
            type: 'VEC3'
        },
        {
            bufferView: 1,
            componentType: 5126,
            count: 24,
            max: [1, 1, 1],
            min: [-1, -1, -1],
            type: 'VEC3'
        },
        {
            bufferView: 2,
            componentType: 5126,
            count: 24,
            max: [1, 1],
            min: [0, 0],
            type: 'VEC2'
        },
        {
            bufferView: 3,
            componentType: 5123,
            count: 36,
            max: [23],
            min: [0],
            type: 'SCALAR'
        }
    ],
    materials: [
        {
            pbrMetallicRoughness: {
                baseColorFactor: [0.7912979403281551, 0.11953842797895521, 0, 1],
                metallicFactor: 0,
                roughnessFactor: 0.9
            },
            extensions: {
                KHR_materials_unlit: {}
            }
        }
    ],
    meshes: [
        {
            primitives: [
                {
                    mode: 4,
                    attributes: {
                        POSITION: 0,
                        NORMAL: 1,
                        TEXCOORD_0: 2
                    },
                    indices: 3,
                    material: 0
                }
            ]
        }
    ],
    extensionsUsed: ['KHR_materials_unlit']
};


/***/ }),

/***/ "./lib/registry.js":
/*!*************************!*\
  !*** ./lib/registry.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EXTENSION_ID: () => (/* binding */ EXTENSION_ID),
/* harmony export */   IArPresentRegistryToken: () => (/* binding */ IArPresentRegistryToken),
/* harmony export */   ModelManager: () => (/* binding */ ModelManager)
/* harmony export */ });
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_1__);


const EXTENSION_ID = 'jupyter.extensions.arpresent_plugin';
const IArPresentRegistryToken = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__.Token(EXTENSION_ID);
class ModelManager {
    constructor() {
        this.modelRegistry = new Set();
        this.modelRegistryChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_1__.Signal(this);
    }
    registerModel(data) {
        this.modelRegistry.add(data);
        this.modelRegistryChanged.emit();
    }
}


/***/ }),

/***/ "./lib/widgets/Sidebar.js":
/*!********************************!*\
  !*** ./lib/widgets/Sidebar.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarWidget: () => (/* binding */ SidebarWidget)
/* harmony export */ });
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @100mslive/react-sdk */ "webpack/sharing/consume/default/@100mslive/react-sdk/@100mslive/react-sdk");
/* harmony import */ var _100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_Icons__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/Icons */ "./lib/components/Icons.js");
/* harmony import */ var _components_ModelListItem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/ModelListItem */ "./lib/components/ModelListItem.js");
/* harmony import */ var _hms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hms */ "./lib/hms.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../icons */ "./lib/icons.js");









const SidebarComponent = ({ modelList }) => {
    const [isDisabled, setIsDisabled] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
    const [isSecondScene, setIsSecondScene] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
    const [arCube, setArCube] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(undefined);
    const [selected, setSelected] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)();
    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
        setArCube(_hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.getState((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('arCube')));
        _hms__WEBPACK_IMPORTED_MODULE_5__.hmsActions.setAppData('modelRegistry', [...modelList]);
        _hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.subscribe(updateModelLoadingState, (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('canLoadModel'));
        _hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.subscribe(updateArCube, (0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('arCube'));
    }, []);
    const updateArCube = () => {
        setArCube(_hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.getState((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('arCube')));
    };
    const updateModelLoadingState = () => {
        const canLoadModel = _hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.getState((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('canLoadModel'));
        setIsDisabled(!canLoadModel);
    };
    const handleModelNameClick = (model) => {
        setSelected(model);
        _hms__WEBPACK_IMPORTED_MODULE_5__.hmsActions.setAppData('selectedModel', model);
    };
    const handleModelSelectClick = (sceneNumber) => {
        if (!arCube) {
            setArCube(_hms__WEBPACK_IMPORTED_MODULE_5__.hmsStore.getState((0,_100mslive_react_sdk__WEBPACK_IMPORTED_MODULE_0__.selectAppData)('arCube')));
        }
        if (!selected) {
            console.log('Model must be selected');
            return;
        }
        arCube === null || arCube === void 0 ? void 0 : arCube.changeModelInScene(sceneNumber, selected.name);
        console.log('modelList', modelList);
    };
    const handleLoadSecondScene = () => {
        if (isSecondScene) {
            arCube === null || arCube === void 0 ? void 0 : arCube.disableSecondScene();
        }
        else {
            arCube === null || arCube === void 0 ? void 0 : arCube.enableSecondScene();
        }
        setIsSecondScene(!isSecondScene);
    };
    return (react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { className: "sidebar-container" },
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { className: "sidebar-description" }, "Select a model from the list below"),
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { className: "sidebar-list" }, [...modelList].map(model => {
            return (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_components_ModelListItem__WEBPACK_IMPORTED_MODULE_6__["default"], { model: model, handleClick: handleModelNameClick, className: (selected === null || selected === void 0 ? void 0 : selected.name) === model.name ? 'model-list-item-selected' : '' }));
        })),
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { className: "sidebar-buttons" },
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.Button, { onClick: () => handleModelSelectClick(0) }, "Set as first model"),
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.Button, { onClick: () => handleModelSelectClick(1) }, "Set as second model")),
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.Button, { style: { padding: '0.5rem' }, onClick: handleLoadSecondScene, disabled: isDisabled }, isDisabled ? (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_components_Icons__WEBPACK_IMPORTED_MODULE_7__.Icons.spinner, { className: "spinner" })) : ('Load second model'))));
};
class SidebarWidget extends _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.SidePanel {
    constructor(modelRegistry, modelRegistryChanged) {
        super({ content: new _lumino_widgets__WEBPACK_IMPORTED_MODULE_3__.Panel() });
        this._modelRegistry = modelRegistry;
        this._signal = modelRegistryChanged;
        this.addClass('sidebar-widget');
        this.title.icon = _icons__WEBPACK_IMPORTED_MODULE_8__.arIcon;
        this.title.caption = 'Augmented reality';
        const headerNode = document.createElement('h2');
        headerNode.textContent = 'augmented reality';
        this.header.addWidget(new _lumino_widgets__WEBPACK_IMPORTED_MODULE_3__.Widget({ node: headerNode }));
        const widget = _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget.create(react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.UseSignal, { signal: this._signal }, () => react__WEBPACK_IMPORTED_MODULE_4___default().createElement(SidebarComponent, { modelList: this._modelRegistry })));
        this.content.addWidget(widget);
    }
}


/***/ }),

/***/ "./icons/duckduck.svg":
/*!****************************!*\
  !*** ./icons/duckduck.svg ***!
  \****************************/
/***/ ((module) => {

module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   width=\"512\"\n   height=\"512\"\n   version=\"1.1\"\n   viewBox=\"0 0 384 384\"\n   id=\"svg106\"\n   sodipodi:docname=\"duckduck.svg\"\n   inkscape:version=\"1.2.2 (b0a8486541, 2022-12-01)\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\">\n  <sodipodi:namedview\n     id=\"namedview108\"\n     pagecolor=\"#505050\"\n     bordercolor=\"#ffffff\"\n     borderopacity=\"1\"\n     inkscape:showpageshadow=\"0\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pagecheckerboard=\"1\"\n     inkscape:deskcolor=\"#505050\"\n     showgrid=\"true\"\n     inkscape:zoom=\"1.4580864\"\n     inkscape:cx=\"293.19251\"\n     inkscape:cy=\"208.14954\"\n     inkscape:window-width=\"2880\"\n     inkscape:window-height=\"1653\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"56\"\n     inkscape:window-maximized=\"1\"\n     inkscape:current-layer=\"svg106\">\n    <inkscape:grid\n       type=\"xygrid\"\n       id=\"grid1742\"\n       dotted=\"true\"\n       spacingx=\"7.5\"\n       spacingy=\"7.5\"\n       empcolor=\"#d2c538\"\n       empopacity=\"0.83921569\"\n       color=\"#7fa342\"\n       opacity=\"0.14901961\" />\n  </sodipodi:namedview>\n  <defs\n     id=\"defs26\">\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2594\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2587\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:perspective\n       sodipodi:type=\"inkscape:persp3d\"\n       inkscape:vp_x=\"-44.677687 : 70.826469 : 1\"\n       inkscape:vp_y=\"0 : 683.64079 : 0\"\n       inkscape:vp_z=\"625.53854 : 70.826469 : 1\"\n       inkscape:persp3d-origin=\"290.43042 : 27.073459 : 1\"\n       id=\"perspective341\" />\n    <clipPath\n       id=\"clipPath4\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect2\" />\n    </clipPath>\n    <clipPath\n       id=\"clipPath8\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect6\" />\n    </clipPath>\n    <clipPath\n       id=\"clipPath12\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect10\" />\n    </clipPath>\n    <clipPath\n       id=\"clipPath16\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect14\" />\n    </clipPath>\n    <clipPath\n       id=\"clipPath20\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect18\" />\n    </clipPath>\n    <clipPath\n       id=\"clipPath24\">\n      <rect\n         width=\"384\"\n         height=\"384\"\n         id=\"rect22\" />\n    </clipPath>\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511-3\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2594-3\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511-3-5\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511-3-9\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511-3-6\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2511-3-62\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2594-2\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2594-23\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n    <inkscape:path-effect\n       effect=\"bspline\"\n       id=\"path-effect2594-5\"\n       is_visible=\"true\"\n       lpeversion=\"1\"\n       weight=\"33.333333\"\n       steps=\"2\"\n       helper_size=\"0\"\n       apply_no_weight=\"true\"\n       apply_with_weight=\"true\"\n       only_selected=\"false\" />\n  </defs>\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer1\"\n     inkscape:label=\"water\"\n     style=\"display:inline\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer8\"\n     inkscape:label=\"duck\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer3\"\n     inkscape:label=\"duckBody\"\n     style=\"display:inline\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer4\"\n     inkscape:label=\"duckLeftWing\"\n     style=\"display:inline\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer5\"\n     inkscape:label=\"duckRightWing\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer2\"\n     inkscape:label=\"duckHead\"\n     style=\"fill:#ffd631;fill-opacity:1\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer6\"\n     inkscape:label=\"duckBeak\" />\n  <g\n     inkscape:groupmode=\"layer\"\n     id=\"layer7\"\n     inkscape:label=\"duckEye\" />\n  <g\n     id=\"g3440\"\n     transform=\"translate(2.99995,-16.741492)\">\n    <path\n       style=\"display:inline;fill:#2eeeff;fill-opacity:1;stroke:#1b98ae;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 9.00005,111.24148 v 225 l 150,-75 v -225 l -150,75\"\n       id=\"path2328\" />\n    <path\n       style=\"display:inline;fill:#20c9db;fill-opacity:1;stroke:#20aec3;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 159.00005,261.24148 210,45 v -225 l -210,-45 v 225\"\n       id=\"path2330\"\n       sodipodi:nodetypes=\"ccccc\" />\n    <path\n       style=\"display:inline;fill:#009bb3;fill-opacity:1;stroke:#126d85;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 9.00005,336.24148 210,45 150,-75 -210,-45 -150,75\"\n       id=\"path2332\"\n       sodipodi:nodetypes=\"ccccc\" />\n    <path\n       id=\"path2442-6\"\n       style=\"display:inline;fill:#ffb943;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 181.50005,171.24148 a 123.75,78.75 0 0 0 -123.75,78.75 123.75,78.75 0 0 0 123.75,78.75 123.75,78.75 0 0 0 123.75,-78.75 123.75,78.75 0 0 0 -0.39844,-6.2959 c 3.71787,-21.18852 5.18003,-40.34448 -3.97705,-49.92187 -8.66762,-9.06547 -26.8456,-9.5528 -47.44922,-7.85303 a 123.75,78.75 0 0 0 -71.92529,-14.6792 z\" />\n    <path\n       id=\"path2442-6-2\"\n       style=\"display:inline;fill:#fb9200;fill-opacity:1;stroke:none;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 63.48931,226.64334 a 123.75,78.75 0 0 0 -5.73926,23.34814 123.75,78.75 0 0 0 123.75,78.75 123.75,78.75 0 0 0 123.03809,-70.67871 123.75,78.75 0 0 1 -118.01075,55.40332 123.75,78.75 0 0 1 -123.75,-78.75 123.75,78.75 0 0 1 0.71192,-8.07275 z\" />\n    <path\n       id=\"path2442-6-0\"\n       style=\"display:inline;fill:none;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 181.50005,171.24148 a 123.75,78.75 0 0 0 -123.75,78.75 123.75,78.75 0 0 0 123.75,78.75 123.75,78.75 0 0 0 123.75,-78.75 123.75,78.75 0 0 0 -0.39844,-6.2959 c 3.71787,-21.18852 5.18003,-40.34448 -3.97705,-49.92187 -8.66762,-9.06547 -26.8456,-9.5528 -47.44922,-7.85303 a 123.75,78.75 0 0 0 -71.92529,-14.6792 z\" />\n    <path\n       style=\"display:inline;fill:#ffb943;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 222.75018,203.74104 c 19.99996,-22.49995 39.99996,-44.99995 48.74993,-41.24934 8.74996,3.75062 6.25001,33.75002 -6e-5,53.74978 -6.25007,19.99976 -16.24987,29.99956 -26.24987,39.99956\"\n       id=\"path2509\"\n       inkscape:path-effect=\"#path-effect2511-3\"\n       inkscape:original-d=\"m 222.75018,203.74104 c 20.00075,-22.49925 40.00075,-44.99925 60,-67.5 -2.4993,30.00135 -4.99925,60.00075 -7.5,90 -9.99945,10.00095 -19.99925,20.00075 -30,30\" />\n    <path\n       id=\"path2509-3\"\n       style=\"display:inline;fill:#fb9200;fill-opacity:1;stroke:none;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 275.2163,182.06104 c -1.16258,6.97806 -2.79543,13.93413 -4.7622,20.06689 C 263.194,224.76623 251.61574,236.17987 240,247.5 l 3.33984,7.79297 c 9.99999,-9.99999 19.99994,-19.99928 26.25,-39.99902 3.15213,-10.08659 5.34413,-22.70937 5.62646,-33.23291 z\" />\n    <path\n       style=\"display:inline;fill:none;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 222.75018,203.74104 c 19.99996,-22.49995 39.99996,-44.99995 48.74993,-41.24934 8.74996,3.75062 6.25001,33.75002 -6e-5,53.74978 -6.25007,19.99976 -16.24987,29.99956 -26.24987,39.99956\"\n       id=\"path2509-0\"\n       inkscape:path-effect=\"#path-effect2511-3-6\"\n       inkscape:original-d=\"m 222.75018,203.74104 c 20.00075,-22.49925 40.00075,-44.99925 60,-67.5 -2.4993,30.00135 -4.99925,60.00075 -7.5,90 -9.99945,10.00095 -19.99925,20.00075 -30,30\" />\n    <ellipse\n       style=\"fill:#ffb943;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       id=\"path2387\"\n       cx=\"132.78143\"\n       cy=\"173.38272\"\n       rx=\"63.75\"\n       ry=\"60\" />\n    <path\n       id=\"path2387-1\"\n       style=\"fill:#fb9200;fill-opacity:1;stroke:none;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 69.847354,182.49404 a 63.75,60 0 0 0 62.934076,50.88867 63.75,60 0 0 0 62.93408,-50.88867 71.25,67.5 0 0 1 -62.93408,35.88867 71.25,67.5 0 0 1 -62.934076,-35.88867 z\" />\n    <ellipse\n       style=\"fill:none;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       id=\"path2387-7\"\n       cx=\"132.78143\"\n       cy=\"173.38272\"\n       rx=\"63.75\"\n       ry=\"60\" />\n    <path\n       style=\"fill:#ff7080;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 83.646319,167.32763 c 5.903416,-2.86002 11.127279,-7.22724 15.453442,-6.46901 4.326159,0.75822 7.753739,6.64086 11.181669,12.52409 15.26394,6.19638 30.52675,12.3923 28.03672,18.11905 -2.49003,5.72675 -22.73208,10.98424 -47.694921,9.25175 -24.962846,-1.73249 -54.645191,-10.45491 -59.95035,-16.22697 -5.305159,-5.77206 12.932616,-8.46988 26.709781,-10.728 13.777164,-2.25812 20.360242,-3.61089 26.263659,-6.47091 z\"\n       id=\"path2592\"\n       inkscape:path-effect=\"#path-effect2594\"\n       inkscape:original-d=\"m 84.32576,168.83492 c 5.22441,-4.36679 10.44827,-8.73401 15.67189,-13.1019 3.42828,5.88382 10.28378,17.64969 10.28378,17.64969 15.26378,6.19676 30.52659,12.39269 45.78938,18.58814 -20.24253,5.25829 -40.48457,10.51579 -60.72737,15.7728 -29.683186,-8.72219 -59.365533,-17.4446 -89.048813,-26.16778 19.073184,-2.82077 37.002612,-7.60308 57.217365,-8.46388 8.080918,0.53598 14.447518,-1.87025 20.813768,-4.27707 z\"\n       sodipodi:nodetypes=\"czcccccc\" />\n    <path\n       id=\"path2592-7\"\n       style=\"fill:#f9005a;fill-opacity:0.828653;stroke:none;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 31.442794,179.73198 c -1.67491,1.20871 -2.08707,2.60472 -0.57129,4.25391 5.30516,5.77206 34.98737,14.49505 59.950196,16.22754 24.96282,1.73249 45.20528,-3.52521 47.69531,-9.25195 0.62544,-1.43843 0.12773,-2.9058 -1.20556,-4.396 -9.28186,4.6367 -27.61372,7.79812 -48.93604,6.20361 -20.144896,-1.50645 -42.917586,-7.25686 -56.932616,-13.03711 z\" />\n    <path\n       style=\"fill:none;fill-opacity:1;stroke:#480400;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 83.646319,167.32763 c 5.903416,-2.86002 11.127279,-7.22724 15.453442,-6.46901 4.326159,0.75822 7.753739,6.64086 11.181669,12.52409 15.26394,6.19638 30.52675,12.3923 28.03672,18.11905 -2.49003,5.72675 -22.73208,10.98424 -47.694922,9.25175 -24.962847,-1.73249 -54.645191,-10.45491 -59.950348,-16.22697 -5.305156,-5.77206 12.932611,-8.46988 26.709778,-10.728 13.777166,-2.25812 20.360244,-3.61089 26.263661,-6.47091 z\"\n       id=\"path2592-9\"\n       inkscape:path-effect=\"#path-effect2594-5\"\n       inkscape:original-d=\"m 84.32576,168.83492 c 5.22441,-4.36679 10.44827,-8.73401 15.67189,-13.1019 3.42828,5.88382 10.28378,17.64969 10.28378,17.64969 15.26378,6.19676 30.52659,12.39269 45.78938,18.58814 -20.24253,5.25829 -40.48457,10.51579 -60.72737,15.7728 -29.683188,-8.72219 -59.365535,-17.4446 -89.048815,-26.16778 19.07319,-2.82077 37.00261,-7.60308 57.217367,-8.46388 8.080918,0.53598 14.447518,-1.87025 20.813768,-4.27707 z\"\n       sodipodi:nodetypes=\"czcccccc\" />\n    <ellipse\n       style=\"fill:#fb9200;fill-opacity:1;stroke:none;stroke-width:4.20001;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       id=\"path2684-9\"\n       cx=\"156.99413\"\n       cy=\"175.19801\"\n       rx=\"11.849189\"\n       ry=\"11.433258\" />\n    <ellipse\n       style=\"fill:#2f0300;fill-opacity:1;stroke:none;stroke-width:4.20001;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       id=\"path2684\"\n       cx=\"156.67303\"\n       cy=\"173.78844\"\n       rx=\"11.25\"\n       ry=\"9.8404236\" />\n    <circle\n       style=\"fill:#fbc892;fill-opacity:0.464482;stroke:none;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       id=\"path2686\"\n       cx=\"160.08458\"\n       cy=\"170.52603\"\n       r=\"3.75\" />\n    <path\n       id=\"path1752\"\n       style=\"display:inline;fill:none;fill-opacity:1;stroke:#08415c;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1\"\n       d=\"m 219.00005,156.24148 150,-75 m -360,30 150,-75 210,45 v 225 l -150,75 m -210,-270 v 225 l 210,45 v -225 l -210,-45\"\n       inkscape:label=\"cubeFrame\"\n       sodipodi:nodetypes=\"cccccccccccc\" />\n  </g>\n</svg>\n";

/***/ }),

/***/ "./style/icons/ar.svg":
/*!****************************!*\
  !*** ./style/icons/ar.svg ***!
  \****************************/
/***/ ((module) => {

module.exports = "<svg height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" xmlns=\"http://www.w3.org/2000/svg\">\n  <g class=\"jp-icon3\" fill=\"#616161\" id=\"g2\">\n    <path\n       id=\"path1\"\n       style=\"fill:none;stroke:#545454;stroke-width:1.32718;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10\"\n       class=\"st0\"\n       d=\"m 12.202615,6.6279902 v 4.6175148 m 0,-8.5753842 -4.0053702,1.978935 4.0053702,1.9789349 4.00537,-1.9789349 z m -4.0053702,1.978935 v 4.6175147 l 4.0053702,1.9789345 4.00537,-1.9789345 V 4.6490558\" />\n    <path\n       id=\"path2\"\n       style=\"fill:none;stroke:#545454;stroke-width:1.32718;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1\"\n       class=\"st0\"\n       d=\"M 20.547136,16.786523 17.943645,13.686191 C 17.67662,13.356369 17.342839,13.22444 16.942302,13.22444 H 7.462927 c -0.400537,0 -0.801074,0.197893 -1.0013425,0.461751 L 3.858094,16.786523 c -0.2002684,0.263858 -0.3337808,0.59368 -0.3337808,0.857538 v 1.517184 c 0,0.725609 0.6008055,1.31929 1.3351233,1.31929 H 19.545793 c 0.734318,0 1.335124,-0.593681 1.335124,-1.31929 v -1.517184 c 0,-0.263858 -0.133513,-0.59368 -0.333781,-0.857538 z M 4.191875,17.18231 h 16.021481\" />\n  </g>\n</svg>\n";

/***/ })

}]);
//# sourceMappingURL=lib_index_js-webpack_sharing_consume_default_three_three-webpack_sharing_consume_default_thre-2c77d3.508c1e42d6620d9ca4e6.js.map