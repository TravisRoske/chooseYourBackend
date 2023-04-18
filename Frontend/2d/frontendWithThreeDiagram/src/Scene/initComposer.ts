import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"


export function initComposer( renderer : THREE.WebGLRenderer, scene : THREE.Scene, mainCam : THREE.Camera ) {

	const bloomComposer = new EffectComposer( renderer );
	
	const renderScene1 = new RenderPass( scene, mainCam );
	bloomComposer.addPass( renderScene1 );
	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), .4, 0.8, 0.2 );
	bloomComposer.addPass( bloomPass );

	return bloomComposer;
}