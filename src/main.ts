import './style.css';
import * as THREE from 'three';

type Cube = THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

const cubes: Cube[] = [];

// 創建 scene
const scene = new THREE.Scene();

// 創建 camera，threejs 中有兩種 camera，這裡介紹最常見的: PerspectiveCamera，99.99999999% 時間都會使用它。

/**
 * params:
 * 1. FOV(Field Of View)，垂直方向
 * 2. Aspec ratio，正常都是 width / height
 * 3. near，最近距離，超過會不顯示
 * 4. far，最遠距離，同上
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / screenHeight, 0.1, 1000);
camera.position.z = 5;

scene.add(camera);

// 創建 renderer 用來渲染 3d
const renderer = new THREE.WebGLRenderer();

// 初始化大小
renderer.setSize(screenWidth, screenHeight);
renderer.setClearColor('#373349');

// 設定不要超過 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('app')!.appendChild(renderer.domElement);


// 建立第一個 Cube
/**
 * params: unit，跟 2d world 不同，3d 世界裡面沒有cm、m，之類的單位，統一叫做 unit。
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'hotpink' });
// const cube = new THREE.Mesh(geometry, material);

// 加到場景之中，預設位置會在 (0, 0, 0);
// scene.add(cube);

function getViewport() {
  // 角度變弧度
  const fov = camera.fov * Math.PI / 180;
  const h = 2 * Math.tan(fov / 2) * 5

  return { height: h }
}

function generateCubes(count: number = 100) {
  for (let i = 0; i < count; i++) {
    // 產生新 cube, geometry 及 material 共用，可以避免重複的物件
    const cube = new THREE.Mesh(geometry, material);

    // 隨機位置
    cube.position.x = (Math.random() - 0.5) * screenWidth * 0.02;
    cube.position.y = (Math.random() - 0.5) * screenHeight * 0.02;

    // 隨機大小
    const scale = Math.random();
    cube.rotation.x = Math.random() * 360;
    cube.rotation.z = Math.random() * 360;

    cube.scale.set(scale, scale, scale);

    cubes.push(cube);
    scene.add(cube);
  }
}


// 處理畫面大小變更事件
function handleResize() {
  window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    renderer.setSize(screenWidth, screenHeight);

    // 比例也要重新計算，因為你重新調整畫面大小
    camera.aspect = screenWidth / screenHeight;

    // 使用 updateProjectionMatrix 來通知 camera 更新
    camera.updateProjectionMatrix();
  });
}

const clock = new THREE.Clock();

function animate() {
  // const elapsedTime = closk.getElapsedTime();
  
  const { height } = getViewport();
  
  cubes.forEach(cube => {
    cube.position.y += Math.random() * 0.01 * 10;

    cube.rotation.x += Math.random() * 0.01;
    cube.rotation.y += Math.random() * 0.01;

    if (cube.position.y > height / 2 * 1.2) {
      cube.position.y = -height / 2 * 1.2
    }
  });
  
  renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

generateCubes();
handleResize();
animate();
