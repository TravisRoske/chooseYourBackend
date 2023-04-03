import * as THREE from 'three'

export class LinkLine extends THREE.Line {

    constructor( start : THREE.Vector3, end : THREE.Vector3 ) {
        super()

        this.material = new THREE.LineBasicMaterial( { color: 0x8888ff } );

        this.geometry = new THREE.BufferGeometry().setFromPoints( [start, end] );
    }
}