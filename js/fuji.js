import * as THREE from '../three/build/three.module.js';
import { GLTFLoader } from '../three/loaders/GLTFLoader.js';



var div = document.getElementById('fuji');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 600000 );

// Ajuste de posição da camera e da mesh
camera.position.z = 40000;
camera.position.x = 0
camera.position.y = 7000
camera.rotation.x = 0

let mixer
let object1
// Luz
var light3 = new THREE.DirectionalLight( 0xFEF3E8, 0.5,  100);
var light2 = new THREE.HemisphereLight( 0xffffff, 0x080820, 2 );
var light = new THREE.PointLight( 0x624780, 1.5, 1000 );

// Ajustando luz
light.position.set( -300, 200, -200);
light3.target.position.set(-50, 0, 0)
light3.position.set(10, 5, 10)
light3.castShadow = true

var clock = new THREE.Clock();



// Setando o renderer e juntando ele a Div: lua


// GLTF loader
var loader = new GLTFLoader();
// const modifer = new THREE.SimplifyModifier();
// Carregando modelo
loader.load(
// Caminho pro arquivo
'../three/models/fuji/scene.gltf',

    // Função chamada quando o arquivo é carregado
    function ( gltf ) { 

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; 

        // Empurrando objeto para variavel
        object1 = gltf.scene
        object1.scale.set(1,1,1);
        object1.name = 'fuji';
        console.log(object1)
        // Adicionando objeto a cena


  
        if (window.innerWidth < 600) {
          object1.position.set(100, -1350, -1200);
          object1.rotation.y = -1.4
          object1.rotation.x = -0.2
          scene.add(object1)
        } else {
          object1.position.set(0,-50,0);
          addEventListener('mousemove', onDocumentMouseMove);
          scene.add(object1)
        }



        // let y = object1.rotation.y
        // gsap.to(object1.rotation, {duration: 5, y: -2, repeat: 0, ease: "none", onComplete: animateBack});
        // function animateBack() {
        //   console.log('back')
        //   gsap.to(object1.rotation, {duration: 10, y: Math.PI * +0.5, repeat: 0, ease: "none"});
        // }
    },
    // Função de carregamento
    function ( xhr ) {
      console.log("Scene polycount:", renderer.info.render.triangles)
      console.log("Active Drawcalls:", renderer.info.render.calls)
      console.log("Textures in Memory", renderer.info.memory.textures)
      console.log("Geometries in Memory", renderer.info.memory.geometries)
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );


    },
    // Função em caso de erro
    function ( error ) {

        console.log( 'An error happened' );
        console.log(error)
    },
);
var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
})
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio *  0.6);

if (window.innerWidth < 600) {
  renderer.setPixelRatio( window.devicePixelRatio *  0.6);
}

div.appendChild( renderer.domElement ); 

// Adicionando a mesh e luz na cena
scene.add(light);
scene.add(light2);
scene.add(light3);
function onDocumentMouseMove(event) {
  event.preventDefault();
  let mouseX
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  object1.rotation.y = THREE.MathUtils.lerp(object1.rotation.y, (mouseX * Math.PI) / -40, 0.05)
}
function animate() {
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    if (mixer) mixer.update( delta );
    // console.log(animationTime)


    
    renderer.render( scene, camera );
};

animate();
