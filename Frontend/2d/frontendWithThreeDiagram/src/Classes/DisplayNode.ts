import * as THREE from 'three'
import { Label } from './Label.js'

export class DisplayNode extends THREE.Mesh {
    label : any;

    constructor(label: Label);
    constructor(label : Label, gltfFile? : string, material? : THREE.Material | null){
        super()

        if(gltfFile){
            //load model
        } else {
            this.geometry = new THREE.SphereGeometry(1)
        }

        this.material = material || new THREE.MeshPhongMaterial({ color : 0x00AA00 })
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
        this.label.expand()
    }

    changePosition(x : number, y : number, z : number) {
        this.position.set(x, y, z)
        this.label.position.set(x, y, z)
    }

}