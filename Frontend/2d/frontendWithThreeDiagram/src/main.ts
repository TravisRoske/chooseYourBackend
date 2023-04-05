import * as THREE from "three"
// import ("c:/Users/TRavi/WebDev/threeDiagramTest/node_modules/@types/three/index")
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DisplayNodeTest } from "./Classes/DisplayNodeTest";
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Label } from "./Classes/Label";
import { LinkLine } from "./Classes/LinkLine";





let width = window.innerWidth * .85;
let height = window.innerHeight * .75;
const scene = new THREE.Scene()

const wrapper = document.getElementById('diagramWrapper')
if(!wrapper) throw new Error("No wrapper found in html file")
wrapper.style.position = 'relative';
const canvas = document.createElement('canvas') as HTMLCanvasElement
canvas.style.textAlign = 'center';
wrapper.appendChild(canvas)
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
  	antialias: true,
  	// alpha: true
})

renderer.setSize(width, height);

const mainCam = new THREE.PerspectiveCamera(
	60,               //Field of View
	width/height,     //Aspect Ratio
	0.1,              //Near Clipping
	1000               //Far Clipping
) 
mainCam.position.z = 10

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
	////////make an object factory that creates and loads new display nodes, and adds them to the scene when loaded!!!!!!
	
	const client = new DisplayNodeTest( new THREE.Vector3(-9, 0, 0), 
		new Label(
			"<h1>Main Server</h1>",
			`<h1>Main Server</h1>
			<p>This server does stuff</p>`
			),
			"client.gltf"
	)

	const mainServer = new DisplayNodeTest( new THREE.Vector3(-3, 0, 0), 
		new Label(
			"<h1>Main Server</h1>",
			`<h1>Main Server</h1>
			<p>This server does stuff</p>`
			),
			"server.gltf"
	)

	const dbServer = new DisplayNodeTest( new THREE.Vector3(3, 0, 0), 
			new Label(
				"<h1>Database Manager</h1>",
				`<h1>Database Manager</h1>
				<p>This server receives http requests and manages database access.  It also keeps track of all active users and deletes user information after one hour of inactivity.</p>`
			),
			"server.gltf"
	)
	dbServer.object.scale.set(2,2,2)
	const mongo = new DisplayNodeTest( new THREE.Vector3(8, 3, 0), 
		new Label(
			"<h1>Mongo</h1>",
			`<h1>Mongo</h1>
			<p>This server does stuff</p>`
		),
		"server.gltf"
	)
	const postgres = new DisplayNodeTest( new THREE.Vector3(8, 0, 0), 
		new Label(
			"<h1>Postgres</h1>",
			`<h1>Postgres</h1>
			<p>This server does stuff</p>`
		),
		"server.gltf"
	)
	const mySQL = new DisplayNodeTest( new THREE.Vector3(8, -3, 0), 
		new Label(
			"<h1>MySQL</h1>",
			`<h1>MySQL</h1>
			<p>This server does stuff</p>`
		),
		"server.gltf"
	)

	nodes.push(client, mainServer, dbServer, mongo, postgres, mySQL)
	for(let n of nodes) {
		n.addToScene(scene)
	}

	setTimeout(() => {/////////////////////////////
		mainServer.object.scale.addScalar(2)
		dbServer.object.scale.addScalar(2)
		client.object.rotateY(-45)
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
	}, 1000);///////////////////////////




}
makeDiagram()


function addLights(){
    const light = new THREE.PointLight(0xffffff, 3)
    scene.add(light)
    light.position.set(-10, 10, 8)
    const light2 = new THREE.PointLight(0xffffff, 3)
    scene.add(light2)
    light2.position.set(10, 10, 8)
    const light3 = new THREE.PointLight(0xffffff, 3)
    scene.add(light3)
    light3.position.set(-5, 15, -8)
	const ambientLight = new THREE.AmbientLight(0xffffff, 2)
	scene.add(ambientLight)
}
addLights()




import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"


const bloomComposer = new EffectComposer( renderer );

const renderScene1 = new RenderPass( scene, mainCam);
bloomComposer.addPass( renderScene1 );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), .5, 0.8, 0.2 );
bloomComposer.addPass( bloomPass );






function animate() {
	
	requestAnimationFrame( animate );

	controls.update();

	bloomComposer.render()

	cssrenderer.render( scene, mainCam );
}

animate()





const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let canvasBounds = canvas.getBoundingClientRect();

window.addEventListener('mousemove', onMouseMove);
function onMouseMove(event : any) {

	//////this math work work if the window is partially scrolled out of sight!!!
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


/////////////////////causes some crash
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




