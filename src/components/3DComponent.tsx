import { createSignal, onMount } from "solid-js";
import * as THREE from 'three';

interface My3DComponentProps {
  style?: string;
}

function My3DComponent(props: My3DComponentProps) {
  let canvas: HTMLCanvasElement | undefined;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  onMount(() => {
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee); // Set the background color

    setWidth(window.innerWidth);
    setHeight(window.innerHeight * 0.5);

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

    window.addEventListener('resize', () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight * 0.5; // Adjust according to your requirements

      setWidth(newWidth);
      setHeight(newHeight);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    });
  });

  return (
    <>
      <canvas ref={canvas} style={props.style}></canvas>
    </>
  );
}

export default My3DComponent;
