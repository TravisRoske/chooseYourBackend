import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DisplayNodeTest } from "./Classes/DisplayNodeTest";
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Label } from "./Classes/Label";
import { LinkLine } from "./Classes/LinkLine";

import { initComposer } from './Scene/initComposer.js'




let width = window.innerWidth * .85;
let height = window.innerHeight * .55;
const scene = new THREE.Scene()

const wrapper = document.getElementById('diagramWrapper')
if(!wrapper) throw new Error("No wrapper found in html file")
wrapper.style.position = 'relative';
const canvas = document.createElement('canvas') as HTMLCanvasElement
canvas.style.textAlign = 'center';
wrapper.appendChild(canvas)
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
  	antialias: true
})
renderer.shadowMap.enabled = true;
renderer.setSize(width, height);

const mainCam = new THREE.PerspectiveCamera(
	60,               //Field of View
	width/height,     //Aspect Ratio
	0.1,              //Near Clipping
	1000               //Far Clipping
) 
mainCam.position.set(-6, 0, 12);
mainCam.rotateY(15);

const cssrenderer = new CSS2DRenderer();
cssrenderer.setSize(width, height);
cssrenderer.domElement.style.position = 'absolute';
cssrenderer.domElement.style.textAlign = 'center';
cssrenderer.domElement.style.top = '0px';
cssrenderer.domElement.style.pointerEvents = 'none';
wrapper.appendChild(cssrenderer.domElement);

const controls = new OrbitControls( mainCam, renderer.domElement );

const nodes : DisplayNodeTest [] = []



function createBackground() {
	// Create video and play
	let textureVid = document.getElementById("video") as HTMLVideoElement
	if(!textureVid) return
	// textureVid.src = `matrix-green.mp4`; // transform gif to mp4
	// textureVid.loop = true;
	textureVid.play()

	// Load video texture
	let videoTexture = new THREE.VideoTexture(textureVid);
	videoTexture.wrapS = THREE.RepeatWrapping;
	videoTexture.wrapT = THREE.RepeatWrapping;
	videoTexture.repeat.set( 15, 15 );
	// videoTexture.format = THREE.RGBFormat;
	videoTexture.minFilter = THREE.NearestFilter;
	// videoTexture.maxFilter = THREE.NearestFilter;
	videoTexture.generateMipmaps = false;

	// Create mesh
	var geometry = new THREE.CylinderGeometry( 25, 25, 100 );
	var material = new THREE.MeshBasicMaterial( { map: videoTexture } );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.material.side = THREE.BackSide
	scene.add(mesh);
	textureVid.style.display = 'none';
}
createBackground()


function makeDiagram() {
	//////Need to make an object factory that creates and loads new display nodes, and adds them to the scene when loaded
	
	const client = new DisplayNodeTest( new THREE.Vector3(-9, 0, 0), 
		new Label(
			"<h1>Front-End</h1>",
			`<h1>Front-End</h1>
			<p>Everything you see on your screen right now is generated with HTML, CSS, JavaScript, and the THREE.js 3d graphics library.</p>`
			),
			"client.gltf"
	)

	const mainServer = new DisplayNodeTest( new THREE.Vector3(-3, 0, 0), 
		new Label(
			"<h1>Web Server</h1>",
			`<h1>Web Server</h1>
			<p>You are currently being served HTML, CSS, and JavaScript files from this server.  It also communicates with the database server, acting as a middle-man for each of your database requests.</p>`
			),
			"server.gltf"
	)

	const dbServer = new DisplayNodeTest( new THREE.Vector3(3, 0, 0), 
			new Label(
				"<h1>Database Manager</h1>",
				`<h1>Database Manager</h1>
				<p>This server receives http requests and manages access to any of the three databases.  It also keeps track of all active users and deletes user information after one hour of inactivity.</p>`
			),
			"server.gltf"
	)
	dbServer.object.scale.set(2,2,2)
	const mongo = new DisplayNodeTest( new THREE.Vector3(8, 3, 0), 
		new Label(
			"<h1>Mongo</h1>",
			`<h1>Mongo</h1>
			<p>This is a docker container with an instance of Mongo DB.  MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like documents.</p>`
		),
		"server.gltf"
	)
	const postgres = new DisplayNodeTest( new THREE.Vector3(8, 0, 0), 
		new Label(
			"<h1>Postgres</h1>",
			`<h1>Postgres</h1>
			<p>This is a docker container with an instance of Postgres.  Postgres (PostgreSQL) is a powerful open-source relational database management system known for its robustness and support for advanced SQL features.</p>`
		),
		"server.gltf"
	)
	const mySQL = new DisplayNodeTest( new THREE.Vector3(8, -3, 0), 
		new Label(
			"<h1>MySQL</h1>",
			`<h1>MySQL</h1>
			<p>This is a docker container with an instance of MySQL.  MySQL is a popular open-source relational database management system that is widely used for web applications and supports a wide range of programming languages.</p>`
		),
		"server.gltf"
	)

	nodes.push(client, mainServer, dbServer, mongo, postgres, mySQL)
	for(let n of nodes) {
		n.addToScene(scene)
	}

	//////This can be removed when I have an object factor
	setTimeout(() => {
		mainServer.object.scale.addScalar(1.7)
		dbServer.object.scale.addScalar(1.7)
		client.object.rotateY(THREE.MathUtils.degToRad(-30))
		client.object.scale.multiply(new THREE.Vector3(2,2,2))

		let line0 = new LinkLine(client.object.position, mainServer.object.position)
		let line = new LinkLine(mainServer.object.position, dbServer.object.position)
		let line2 = new LinkLine(dbServer.object.position, mongo.object.position)
		let line3 = new LinkLine(dbServer.object.position, postgres.object.position)
		let line4 = new LinkLine(dbServer.object.position, mySQL.object.position)
	
		scene.add(line0)
		scene.add(line)
		scene.add(line2)
		scene.add(line3)
		scene.add(line4)
	}, 1000);




}
makeDiagram()


function addLights(){
	const lights = [];

    lights.push(new THREE.PointLight(0xffffff, .8));
    lights[0].position.set(0, 10, 7)

    lights.push(new THREE.PointLight(0xffffff, .8));
    lights[1].position.set(-5, 10, 5)

    lights.push(new THREE.PointLight(0xffffff, .8));
    lights[2].position.set(5, 10, -5)

	for( let i = 0; i < lights.length; i++ ){
		scene.add(lights[i])
		lights[i].castShadow = true;
		lights[i].shadow.camera.near = 0.1;
		lights[i].shadow.camera.far = 20;
	}

	const ambientLight = new THREE.AmbientLight(0xaaffaa, 0.3)
	scene.add(ambientLight)
}
addLights()


var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshStandardMaterial( { color: 0x999999 } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
mesh.position.y = -5;
scene.add( mesh );



const bloomComposer = initComposer( renderer, scene, mainCam );

function animate() {
	
	requestAnimationFrame( animate );

	controls.update();

	bloomComposer.render()
	// renderer.render( scene, mainCam )

	cssrenderer.render( scene, mainCam );
}

animate()





const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let canvasBounds = canvas.getBoundingClientRect();

window.addEventListener('mousemove', onMouseMove);
function onMouseMove(event : any) {

	pointer.x = ((event.clientX -canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
	pointer.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

	raycaster.setFromCamera(pointer, mainCam);

	const intersects = raycaster.intersectObjects(scene.children);

	let hoveredObject = null;
	loopi:
	for (let i of intersects) {
		loopn:
		for(let n of nodes) {
			if(i.object.parent?.uuid === n.object.uuid) {
				n.onHover();
				hoveredObject = n;
				break loopi;
			}
		}
    }
	for(let n of nodes){
		if(n !== hoveredObject){
			n.offHover()
		}
	}
}


window.addEventListener('mousedown', onMouseDown)
function onMouseDown(event : any){
	
	pointer.x = ((event.clientX -canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
	pointer.y = - ((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

	raycaster.setFromCamera(pointer, mainCam);

	const intersects = raycaster.intersectObjects(scene.children);

	let clickedObject = null;

	loopi:
	for (let i of intersects) {
		loopn:
		for(let n of nodes) {
			if(i.object.parent?.uuid === n.object.uuid) {
				clickedObject = n;
				n.onClick();
				break loopi;
			}
		}
    }
	//Make all other labels close
	for(let n of nodes){
		if(n !== clickedObject){
			n.label.close();
		}
	}
}



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
	width = window.innerWidth * .85;
	height = window.innerHeight * .75;

    mainCam.aspect = width / height
    mainCam.updateProjectionMatrix()
    renderer.setSize(width, height)
	cssrenderer.setSize(width, height)

	canvasBounds = canvas.getBoundingClientRect();
}

window.addEventListener('scroll', onWindowScroll)
function onWindowScroll() {
	canvasBounds = canvas.getBoundingClientRect();
}



