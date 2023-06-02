import { createSignal, onMount, onCleanup } from "solid-js";
import * as THREE from "three";
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

interface My3DComponentProps {
  style?: string;
}

function My3DComponent(props: My3DComponentProps) {
  let section: HTMLElement | undefined;
  let loadedObject: THREE.Object3D | null = null;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  onMount(() => {
    if (!section) return;

    const canvas = section.querySelector("canvas");
    if (!canvas) return;

    setWidth(section.clientWidth);
    setHeight(section.clientHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width() / height(), 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(width(), height());

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // Load an MTL file
    const mtlLoader = new MTLLoader();
    mtlLoader.load('../rounded_less.mtl', (materials) => {
      materials.preload();
  
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
  
      objLoader.load('../rounded_less.obj', (object) => {
        loadedObject = object;
        scene.add(object);
      },
      // onProgress callback
      function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },
      // onError callback
      function ( err ) {
        console.error( 'An error happened' );
      });
    });

    function animate() {
      requestAnimationFrame(animate);
      if (loadedObject !== null) {
        loadedObject.rotation.x += 0.01;
        loadedObject.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    }
    animate();

    let resizeTimeout: number | undefined;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      // Debounce resize events
      if (resizeTimeout !== undefined) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        for (let entry of entries) {
          if (entry.target === section) {
            const newWidth = entry.contentRect.width;
            const newHeight = entry.contentRect.height;

            setWidth(newWidth);
            setHeight(newHeight);

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(newWidth, newHeight);
          }
        }
      }, 100); // delay of 100ms
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(section);

    onCleanup(() => {
      resizeObserver.disconnect();
      if (resizeTimeout !== undefined) {
        clearTimeout(resizeTimeout);
      }
    });
  });

  return (
    <section ref={section} style={props.style}>
      <canvas class="bg-offw dark:bg-dark"></canvas>
    </section>
  );
}

export default My3DComponent;
