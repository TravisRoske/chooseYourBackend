import * as THREE from "three"
// import ("c:/Users/TRavi/WebDev/threeDiagramTest/node_modules/@types/three/index")
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DisplayNode } from "./Classes/DisplayNode";
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Label } from "./Classes/Label";
import { LinkLine } from "./Classes/LinkLine";



let width = window.innerWidth * .8;
let height = window.innerHeight * .35;
const scene = new THREE.Scene()
const canvas = document.getElementById('diagram') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
  	antialias: true,
  	alpha: true
})

renderer.setSize(width, height);


const mainCam = new THREE.PerspectiveCamera(
	60,               //Field of View
	width/height,     //Aspect Ratio
	0.1,              //Near Clipping
	1000               //Far Clipping
) 
mainCam.position.z = 25

const cssrenderer = new CSS2DRenderer();
cssrenderer.setSize(width, height);
cssrenderer.domElement.style.position = 'absolute';
cssrenderer.domElement.style.top = '0px';
cssrenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssrenderer.domElement);

const controls = new OrbitControls( mainCam, renderer.domElement );

const nodes : DisplayNode [] = []

function makeDiagram() {
	
	const lb = new Label("<h1>ORB</h1>", "<h1>Orb</h1><p>This orb is good and very veyr goodly.")
	const dn = new DisplayNode(lb)
	dn.changePosition(3, 0, 2)
	
	nodes.push(dn)
	
	nodes.push(new DisplayNode( new Label(
			"<h1>Database Manager</h1>",
			`<h1>Database Manager</h1>
			<p>This server receives http requests and manages database access.  It also keeps track of all active users and deletes user information after one hour of inactivity.`
		)
	))

	for(let n of nodes){
		scene.add(n)
		scene.add(n.label)
	}

	let line = new LinkLine(nodes[0].position, nodes[1].position)
	scene.add(line)

}
makeDiagram()


function addLights(){
    const light = new THREE.PointLight(0xffffff, 10)
    scene.add(light)
    light.position.set(2, 10, 4)
    const light2 = new THREE.PointLight(0xffffff, 10)
    scene.add(light2)
    light2.position.set(2, -10, -4)
    const light3 = new THREE.PointLight(0xffffff, 10)
    scene.add(light3)
    light3.position.set(-5, 15, -7)
}
addLights()






import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"


const bloomComposer = new EffectComposer( renderer );

const renderScene1 = new RenderPass( scene, mainCam);
bloomComposer.addPass( renderScene1 );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 1.5, 0.2 );
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

window.addEventListener('mousemove', onMouseMove);
function onMouseMove(event : any) {

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, mainCam);

	const intersects = raycaster.intersectObjects(scene.children);

	let hoveredObject = null;
	for (let i of intersects) {
		for(let n of nodes) {
			if(i.object.uuid === n.uuid) {
				n.onHover()
				hoveredObject = n;
				break;
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

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, mainCam);

	const intersects = raycaster.intersectObjects(scene.children);

	let clickedObject = null;

	for (let i of intersects) {
		for(let n of nodes) {
			if(i.object.uuid === n.uuid) {
				clickedObject = n
				n.onClick()
				break;
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
	width = window.innerWidth * .8;
	height = window.innerHeight * .35;

    mainCam.aspect = width / height
    mainCam.updateProjectionMatrix()
    renderer.setSize(width, height)
	cssrenderer.setSize(width, height)
}




