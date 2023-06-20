import { createSignal, onMount, onCleanup } from "solid-js";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface My3DComponentProps {
  style?: string;
}

function My3DComponent(props: My3DComponentProps) {
  let section: HTMLElement | undefined;
  let loadedObject: THREE.Object3D | null = null;
  let time = 0;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  onMount(() => {
    if (!section) return;

    const canvas = section.querySelector("canvas");
    if (!canvas) return;

    setWidth(section.clientWidth);
    setHeight(section.clientHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width() / height(), 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width(), height());

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // Add a directional light to cast shadows
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Set up shadow properties for the light
    dirLight.shadow.mapSize.width = 512; // default
    dirLight.shadow.mapSize.height = 512; // default
    dirLight.shadow.camera.near = 0.5; // default
    dirLight.shadow.camera.far = 500; // default

    const planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      dithering: true,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -10;  // adjust this to move the plane forward/backward
    plane.receiveShadow = true;  // this plane will receive shadows
    scene.add(plane);

    const mouse = new THREE.Vector2();
    let targetRotationX = 0;
    let targetRotationY = 0;

    function onMouseMove(event: MouseEvent) {
      // calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update target rotations
      targetRotationX = mouse.y * -0.1;  // vertical rotation
      targetRotationY = mouse.x * -0.1;  // horizontal rotation
    }

    window.addEventListener('mousemove', onMouseMove, false);


    // Load an MTL file
    const mtlLoader = new MTLLoader();
    mtlLoader.load("../rounded_less.mtl", (materials: { preload: () => void; }) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);

      objLoader.load(
        "../rounded_less.obj",
        (object) => {
          loadedObject = object;
          scene.add(object);
        },
        // onProgress callback
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // onError callback
        function (err) {
          console.error("An error happened");
        }
      );
    });

    function animate() {
      requestAnimationFrame(animate);
      time += 0.05;

      if (loadedObject !== null) {
        // Adjust object's y position according to sine function
        loadedObject.position.y = -1 + Math.sin(time) * 0.3;
        loadedObject.position.x = 2;
        loadedObject.rotation.x = 0.3;
      }

      camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.01;
      camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.02;

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
      window.removeEventListener('mousemove', onMouseMove, false);
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
