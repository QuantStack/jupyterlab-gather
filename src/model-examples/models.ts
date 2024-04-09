export const threeCube = {
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
