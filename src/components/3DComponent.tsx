import { createSignal, onCleanup, onMount } from 'solid-js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

function ThreeComponent() {
  let divRef;
  let scene, camera, renderer, controls;

  onMount(() => {
    divRef = document.createElement('div');
    document.body.appendChild(divRef);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    divRef.appendChild(renderer.domElement);

    const loader = new OBJLoader();
    loader.load('/path/to/foobar.obj', (obj) => {
      scene.add(obj);
    });

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);

    camera.position.z = 5;

    controls = new OrbitControls(camera, renderer.domElement);

    const animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resize, false);

    onCleanup(() => {
      window.removeEventListener('resize', resize, false);
      // Dispose your three.js instances here
      scene.dispose();
      renderer.dispose();
      controls.dispose();
    });
  });

  return (
    <div style="width: 100%; height: 100vh;"></div>
  );
}

export default ThreeComponent;
