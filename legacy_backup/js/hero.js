
const container = document.getElementById('webgl-container');

// Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Particles (The Hand Representation - Abstracted as a cloud for now, usually requires Model Loading)
// For this template, we will create an abstract swirling galaxy of particles representing the "Oracle"
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0xd4af37); // Gold
const color2 = new THREE.Color(0xffffff); // White

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Sphere distribution
    const r = 3 * Math.cbrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    posArray[i] = r * Math.sin(phi) * Math.cos(theta);     // x
    posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);   // y
    posArray[i + 2] = r * Math.cos(phi);                     // z

    // Mix colors
    const mixedColor = Math.random() > 0.5 ? color1 : color2;
    colorArray[i] = mixedColor.r;
    colorArray[i + 1] = mixedColor.g;
    colorArray[i + 2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// Shader Material for glowing dots
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    const elapsedTime = clock.getElapsedTime();

    // Gentle rotation
    particlesMesh.rotation.y = .1 * elapsedTime;

    // Mouse influence
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);

    // Pulse effect
    particlesMesh.scale.x = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
    particlesMesh.scale.y = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
    particlesMesh.scale.z = 1 + Math.sin(elapsedTime * 0.5) * 0.05;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
