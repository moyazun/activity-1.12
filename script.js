import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./textures/matcaps/8.png'); // Ensure this path is correct and the file exists

// Font Loader
const fontLoader = new FontLoader();
fontLoader.load(
    '/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', // Path to the typeface font file
    (font) => {
        const textGeometry = new TextGeometry('ITE 18- GO LIVE', {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });

        // Center the text geometry
        textGeometry.center();

        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const textMesh = new THREE.Mesh(textGeometry, material);
        scene.add(textMesh);

        // Add donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material);

            // Randomize position, rotation, and scale
            donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 4);
            donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            const scale = Math.random();
            donut.scale.set(scale, scale, scale);

            scene.add(donut);
        }
    }
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();
