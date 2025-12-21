const container = document.getElementById('earth-container');

// Сцена
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 10);

// Рендерер
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Свет
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);

// Управление мышью
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.enablePan = false;

// Загрузка текстур
const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load('/static/textures/earth albedo.jpg');
const bumpTexture = textureLoader.load('/static/textures/earth bump.jpg');
const nightTexture = textureLoader.load('/static/textures/earth night_lights_modified.png');
const cloudsTexture = textureLoader.load('/static/textures/clouds earth.png');

// Загрузка модели
const gltfLoader = new THREE.GLTFLoader();

gltfLoader.load('/static/models/earth.glb', (gltf) => {

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                map: earthTexture,
                bumpMap: bumpTexture,
                bumpScale: 0.05,
                emissiveMap: nightTexture,
                emissive: new THREE.Color(0xffff88),
                emissiveIntensity: 0.5
            });
        }
    });

    gltf.scene.scale.set(2, 2, 2);
    scene.add(gltf.scene);

}, undefined, (error) => {
    console.error('Ошибка загрузки модели', error);
});

// Анимация
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
