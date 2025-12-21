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

const textures = {
    map: textureLoader.load('textures/earth_color.jpg'),
    normalMap: textureLoader.load('textures/earth_normal.jpg'),
    roughnessMap: textureLoader.load('textures/earth_roughness.jpg'),
    metalnessMap: textureLoader.load('textures/earth_metallic.jpg'),
    emissiveMap: textureLoader.load('textures/earth_night.jpg')
};

// Загрузка модели
const gltfLoader = new THREE.GLTFLoader();

gltfLoader.load('59-earth/earth 2.glb', (gltf) => {

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                ...textures,
                emissive: new THREE.Color(0xffffff),
                emissiveIntensity: 1
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
