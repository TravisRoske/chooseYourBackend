import * as THREE from 'three'
import { Label } from './Label.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


export class DisplayNodeTest {
    label : any;

    public object: THREE.Object3D;
    private isLoaded : boolean = false;

    constructor( pos : THREE.Vector3, label : Label, gltfFile? : string | null){
        
        const geometry = new THREE.SphereGeometry(1)
        const mat = new THREE.MeshPhongMaterial({ color : 0x00AA00 })
        this.object = new THREE.Mesh(geometry, mat)

        if(gltfFile){
            const loader = new GLTFLoader();

            const prom : Promise<THREE.Object3D> = new Promise((resolve, reject) => {
                loader.load( gltfFile,  ( gltf ) => {
            
                    resolve(gltf.scene.children[0])
                
                }, undefined, ( error ) => {
                
                    reject( error )
                
                } );
            })
            prom.then((res) => {
                this.object = res;
            })
            prom.finally(() => { 
                this.isLoaded = true 
                this.changePosition(pos.x, pos.y, pos.z)

                //initialization
                const textureLoader = new THREE.TextureLoader();

                //loading texture
                const texture = textureLoader.load ('bump_map.jpg')

                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 20, 20 );

                //setting material property
                this.object.children[0].material.bumpMap = texture;
                this.object.children[0].material.bumpScale = .01
                this.object.children[0].material.roughness = .45
            })
        }

        this.label = label || null
    }

    onHover() {
        this.label.visible = true
    }

    offHover() {
        if(!this.label.isExpanded){
            this.label.visible = false;
        }
    }

    onClick() {
        this.label.toggle()
    }

    changePosition(x : number, y : number, z : number) {
        this.object.position.set(x, y, z)
        this.label.position.set(x, y, z)
    }

    addToScene(scene : THREE.Scene){
        setInterval(() => {
            if(this.isLoaded) {
                scene.add(this.object)
                scene.add(this.label)
                clearInterval
            }
        }, 500)
    }

}