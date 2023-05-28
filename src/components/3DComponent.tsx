import { createSignal, onMount, onCleanup } from "solid-js";
import * as THREE from "three";

interface My3DComponentProps {
  style?: string;
}

function My3DComponent(props: My3DComponentProps) {
  let section: HTMLElement | undefined;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  onMount(() => {
    if (!section) return;

    const canvas = section.querySelector("canvas");
    if (!canvas) return;

    setWidth(section.clientWidth);
    setHeight(section.clientHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee); // Set the background color

    const camera = new THREE.PerspectiveCamera(75, width() / height(), 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(width(), height());

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    // Add object to scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
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
      <canvas></canvas>
    </section>
  );
}

export default My3DComponent;
