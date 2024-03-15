import {
  HMSPluginSupportResult,
  HMSVideoPlugin,
  HMSVideoPluginCanvasContextType,
  HMSVideoPluginType
} from '@100mslive/hms-video-store';

class ArCubePlugin implements HMSVideoPlugin {
  input: HTMLCanvasElement | null;
  output: HTMLCanvasElement | null;
  outputCtx: CanvasRenderingContext2D | null;

  constructor() {
    this.outputCtx = null;
    this.input = null;
    this.output = null;
  }
  /**
   * @param input {HTMLCanvasElement}
   * @param output {HTMLCanvasElement}
   */
  processVideoFrame(input: HTMLCanvasElement, output: HTMLCanvasElement) {
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
    const inputCtx = input.getContext('2d');
    const outputCtx = output.getContext('2d');
    const imgData = inputCtx!.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    // pixels is an array of all the pixels with their RGBA values, the A stands for alpha
    // we will not actually be using alpha for this plugin, but we still need to skip it(hence the i+= 4)
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      // the luma algorithm as we discussed above, floor because intensity is a number
      const lightness = Math.floor(red * 0.299 + green * 0.587 + blue * 0.114);
      // all of RGB is set to the calculated intensity value for grayscale
      pixels[i] = pixels[i + 1] = pixels[i + 2] = lightness;
    }
    // and finally now that we have the updated values for grayscale we put it on output
    outputCtx!.putImageData(imgData, 0, 0);
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

  async init() {} // placeholder, nothing to init

  getPluginType() {
    return HMSVideoPluginType.TRANSFORM; // because we transform the image
  }

  getContextType() {
    return HMSVideoPluginCanvasContextType.WEBGL;
  }

  stop() {} // placeholder, nothing to stop
}

export default ArCubePlugin;
