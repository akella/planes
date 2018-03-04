import * as THREE from 'three';
import {TimelineMax} from 'gsap';
let OrbitControls = require('three-orbit-controls')(THREE);
import './lib/curve';
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);






let canvas = document.getElementById('myscene');
let width = window.innerWidth;
let height = window.innerHeight;
var mouse = new THREE.Vector2(), INTERSECTED;
let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});





renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
var camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);


// SCENE
let scene = new THREE.Scene();

let group = new THREE.Group();
scene.add(group);
camera.position.set(50, 120, 160);
camera.lookAt(10, 20, 30);
var controls = new OrbitControls(camera, renderer.domElement);

// var light = new THREE.AmbientLight( 0x404040,3 ); // soft white light
// scene.add( light );

// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// scene.add( directionalLight );

var spotLight = new THREE.AmbientLight(0xff6600);
spotLight.position.set(25, 50, 25);
spotLight.castShadow = true;

scene.add(spotLight);

var spotLight = new THREE.PointLight(0xffffff);
spotLight.position.set(-40, 60, -10);
scene.add(spotLight);




// do

var loader = new THREE.OBJLoader();
let myPlane;

let plane_ar = [];
let plane_shift = [];
let plane_disp = [];

// load a resource
loader.load(
  // resource URL
  'img/plane1.obj',
  // called when resource is loaded
  function( object ) {
    myPlane = object;

    myPlane.traverse(function(node) {
    	if(node.material) {
    		node.material.side = THREE.DoubleSide;
    	}
    });
    myPlane.scale.x = 0.3;
    myPlane.scale.y = 0.3;
    myPlane.scale.z = 0.3;

    // scene.add( myPlane );

    for (var i = 0; i < 142; i++) {
    	let newPlane = myPlane.clone();
    	plane_ar.push(newPlane);
    	plane_shift.push(Math.random());
    	plane_disp.push(Math.random()*20);
    	scene.add(newPlane);
    }

  },
  function( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  },
  function( error ) {

    console.log( 'An error happened' );

  }
);


//Create a closed wavey loop
// var curve = new THREE.CatmullRomCurve3( [
//   new THREE.Vector3( -10, 0, 10 ),
//   new THREE.Vector3( -5, 5, 5 ),
//   new THREE.Vector3( 0, 0, 0 ),
//   new THREE.Vector3( 5, -5, 5 ),
//   new THREE.Vector3( 10, 0, 10 )
// ] );

let curve = new THREE.Curves.HeartCurve(100);

var points = curve.getPoints( 50 );
var geometry = new THREE.BufferGeometry().setFromPoints( points );

var material = new THREE.LineBasicMaterial( { 
  color : 0xffffff,
  linewidth: 10 } );

// Create the final object to add to the scene
var curveObject = new THREE.Line( geometry, material );

curveObject.scale.x = 0.05;
curveObject.scale.y = 0.05;
curveObject.scale.z = 0.05;
// scene.add(curveObject);








let up = new THREE.Vector3(0,1,0);
let tangent,radians;
let axis = new THREE.Vector3();
let time = 0;
function Render() {
  time++;

  
  let perc = (time % 2000)/2000;

  if(plane_ar.length>0) {
  	plane_ar.forEach((plane,i) => {
  		let custPerc = (plane_shift[i] + perc) % 1;

  		let pos = curve.getPoint(custPerc);

  		plane.position.copy(pos.multiplyScalar(0.05).add(
  			new THREE.Vector3(plane_disp[i],plane_disp[i],plane_disp[i])
  		));


  		tangent = curve.getTangent(custPerc).normalize();
  		axis.crossVectors(up, tangent).normalize();
  		radians = Math.acos(up.dot(tangent));
  		plane.quaternion.setFromAxisAngle(axis, radians);
  	});
  }
  

  // if(myPlane) {
  	
  // 	let pos = curve.getPoint(perc);
  // 	// let newPos = curve.getPoint(nextperc);
  // 	myPlane.position.copy(pos.multiplyScalar(0.05));
  // 	// myPlane.lookAt(newPos);

  // 	tangent = curve.getTangent(perc).normalize();
  // 	axis.crossVectors(up, tangent).normalize();
  // 	radians = Math.acos(up.dot(tangent));
  // 	myPlane.quaternion.setFromAxisAngle(axis, radians);
  // }
  renderer.render(scene, camera);
  window.requestAnimationFrame(Render);
}
Render();


function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = (window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize, false);



