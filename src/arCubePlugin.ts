import {
  HMSPluginSupportResult,
  HMSVideoPlugin,
  HMSVideoPluginCanvasContextType,
  HMSVideoPluginType,
  selectAppData
} from '@100mslive/hms-video-store';
import * as THREE from 'three';
import ArCube from './arCube';
import { hmsStore } from './hms';

class ArCubePlugin implements HMSVideoPlugin {
  input: HTMLCanvasElement | null;
  output: HTMLCanvasElement | null;
  // arCube: ArCube;
  node: HTMLElement;
  renderer: THREE.WebGLRenderer;
  arCube: ArCube;
  //   outputCtx: CanvasRenderingContext2D | null;

  constructor() {
    // this.outputCtx = null;
    console.log('plugin constructor');
    this.input = null;
    this.output = null;
  }

  blendImages(imageDataBottom: ImageData, imageDataTop: ImageData) {
    console.log('imageDataBottom', imageDataBottom);
    console.log('imageDataTop', imageDataTop);

    // Ensure the dimensions of both ImageData objects are the same
    if (
      imageDataBottom.width !== imageDataTop.width ||
      imageDataBottom.height !== imageDataTop.height
    ) {
      throw new Error('ImageData dimensions must match');
    }

    // Create a new ImageData object for the blended image
    const blendedImageData = new ImageData(
      imageDataBottom.width,
      imageDataBottom.height
    );

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

  /**
   * @param input {HTMLCanvasElement}
   * @param output {HTMLCanvasElement}
   */
  processVideoFrame(input: HTMLCanvasElement, output: HTMLCanvasElement) {
    // console.log('input', input);
    // console.log('output', output);
    if (!input || !output) {
      throw new Error('Plugin invalid input/output');
    }

    this.input = input;
    this.output = output;
    // let imgData: any;
    // we don't want to change the dimensions so set the same width, height
    const width = input.width;
    const height = input.height;
    output.width = width;
    output.height = height;

    const threeJsContext = this.arCube.renderer.getContext();
    // threeJsContext?.clear(threeJsContext.COLOR_BUFFER_BIT);

    const inputCtx = input.getContext('2d');
    const inputImgData = inputCtx?.getImageData(0, 0, width, height);

    const pixels = new Uint8Array(width * height * 4);

    // console.log('threeJsContext', threeJsContext);
    // this.arCube.renderer.readRenderTargetPixels(
    //   this.arCube.renderTarget,
    //   0,
    //   0,
    //   width,
    //   height,
    //   pixels
    // );

    threeJsContext?.readPixels(
      0,
      0,
      width,
      height,
      threeJsContext.RGBA,
      threeJsContext.UNSIGNED_BYTE,
      pixels
    );

    const threeImageData = new ImageData(
      new Uint8ClampedArray(pixels),
      width,
      height
    );
    let foundNonZero = false;

    console.log('pixels', pixels);

    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] !== 0) {
        foundNonZero = true;
        break;
      }
    }

    // console.log('threeImageData', threeImageData);
    console.log('foundNonZero', foundNonZero);
    const outputCtx = output.getContext('2d');

    if (!inputImgData) {
      console.log('fucked');
    }
    const blendedData = this.blendImages(inputImgData!, threeImageData);

    outputCtx?.putImageData(blendedData, 0, 0);
  }

  getName() {
    return 'arcube-plugin';
  }

  /**
   * @deprecated
   */
  isSupported(): boolean {
    return true;
  }

  checkSupport() {
    // we're not doing anything complicated, it's supported on all browsers
    const browserResult = {} as HMSPluginSupportResult;
    browserResult.isSupported = true;
    return browserResult;
  }

  async init() {
    this.node = hmsStore.getState(selectAppData('node'));
    // this.renderer = hmsStore.getState(selectAppData('renderer'));
    // console.log('this.renderer', this.renderer);
    console.log('plugin node', this.node);
    this.arCube = new ArCube(this.node);
    this.arCube.animate();
  } // placeholder, nothing to init

  getPluginType() {
    return HMSVideoPluginType.TRANSFORM; // because we transform the image
  }

  getContextType() {
    return HMSVideoPluginCanvasContextType['2D'];
  }

  stop() {} // placeholder, nothing to stop
}

export default ArCubePlugin;
