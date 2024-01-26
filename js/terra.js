import * as THREE from '../three/three.module.js';

var div = document.getElementById('terra');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 2000 ); 
var light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 3 );
var light = new THREE.PointLight( 0xF4E99B, 1, 100 );
var loader = new THREE.TextureLoader();



var Shaders = {
  'atmosphere' : {
    uniforms: {},
    vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 0.5 ) ), 11.0 );',
        'gl_FragColor = vec4( 0,153,221, 0.4 ) * intensity;',
      '}'
    ].join('\n')
  }
};



var shader, uniforms;


const settings = {
        metalness: 0.0,
        roughness: 0.5,
        aoMapIntensity: 1.0,
        displacementScale: 1.5, // from original model
        normalScale: 1.0
    };

// Setando o renderer e juntando ele a Div: terra
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
  alpha: true
  })
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio *  1);

const getRandomParticelPos = (particleCount) => {
const arr = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    arr[i] = (Math.random() - 0.5) * 10;
}
return arr;
};
// mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
});

// Geometria e Material
const geometry = new THREE.SphereGeometry(20, 20, 1500);

shader = Shaders['atmosphere'];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    let materialGlow = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true

        });
let mesh = new THREE.Mesh(geometry, materialGlow);
mesh.scale.set( 1, 1, 1 );
scene.add(mesh);
// Geometry
const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

geometrys[0].setAttribute(
"position",
new THREE.BufferAttribute(getRandomParticelPos(350), 3)
);
geometrys[1].setAttribute(
"position",
new THREE.BufferAttribute(getRandomParticelPos(1500), 3)
);

// material
const materials = [
new THREE.PointsMaterial({
size: 2,
map: loader.load("../three/particles/particle-img/sp1.png"),
transparent: true
// color: "#ff0000"
}),
new THREE.PointsMaterial({
size: 1,
map: loader.load("../three/particles/particle-img/sp2.png"),
transparent: true
// color: "#0000ff"
})
];

const starsT1 = new THREE.Points(geometrys[0], materials[0]);
const starsT2 = new THREE.Points(geometrys[1], materials[1]);
starsT1.scale.set(20,20,10);
starsT2.scale.set(20,20,10);
starsT1.position.z = -75;
starsT2.position.z = -75;
scene.add(starsT1);
scene.add(starsT2);
// Carregando Texturas
const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load('../three/textura/terra/earthmap1k.jpg') 
const displacementMap = textureLoader.load( '../three/textura/terra/earthbump1k.jpg' );




const material = new THREE.MeshStandardMaterial( {

    map: colorMap,

    color: 0x888888,
    roughness: settings.roughness,
    metalness: settings.metalness,


    displacementMap: displacementMap,
    displacementScale: settings.displacementScale,
    displacementBias: - 1.5, // from original model

    side: THREE.DoubleSide

} );

// Fundindo geometria e materiam em uma Mesh
const terra = new THREE.Mesh( geometry, material );

// Adicionando a mesh e luz na cena
scene.add( terra );
scene.add( light );
scene.add( light2 );

light.position.set( 0, 0, 0 );
// Ajuste de posição da camera e da mesh
mesh.position.set(-31.1,-5,-30)
terra.position.set(-30,-5,-30)
camera.position.z = 100;
camera.position.x = 0
camera.position.y = 0

div.appendChild( renderer.domElement );

// Função que anima a mesh
function animate() {
    requestAnimationFrame( animate );

    terra.rotation.y -= 0.003;
    starsT1.position.x = mouseX * -0.0005;
    starsT1.position.y = mouseY * 0.0005;

    starsT2.position.x = mouseX * 0.0005;
    starsT2.position.y = mouseY * -0.0005;
    renderer.render( scene, camera );
};

animate();