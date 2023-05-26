/// <reference types="astro/client" />
declare module 'three/examples/jsm/loaders/OBJLoader' {
    export class OBJLoader {
      constructor(manager?: any);
      load(url: string, onLoad: (object: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
      setPath(value: string): OBJLoader;
    }
  }
  declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher, MOUSE, Object3D, Vector3 } from 'three';
  
    export class OrbitControls extends EventDispatcher {
      constructor(object: Camera, domElement?: HTMLElement);
  
      object: Camera;
      domElement: HTMLElement | Document;
  
      // API
      enabled: boolean;
      target: Vector3;
  
      // methods
      update(): void;
      dispose(): void;
    }
  }
