import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'


//idk if this should extend the label or have two labels...
export class Label extends CSS2DObject {
    contractedHTML: string;
    expandedHTML: string;
    isExpanded: boolean;

    constructor(contractedHTML: string, expandedHTML: string){
        super(document.createElement('div'))

        this.visible = false;
        this.isExpanded = false;
        this.contractedHTML = contractedHTML;
        this.expandedHTML = expandedHTML;

        this.element.innerHTML = contractedHTML;
        
        //label style
        this.element.style.backgroundColor = "#DDDDDD";
        this.element.style.opacity = ".2";
        this.element.style.border = "2px solid grey";
        this.element.style.borderRadius = "10px";
        this.element.style.maxWidth = "400px"
        this.element.style.maxHeight= "600px"
        this.element.style.textAlign = "center"
    }

    expand() {
        //some growing animation maybe
        this.element.innerHTML = this.expandedHTML;
        this.isExpanded = true;
    }

    collapse() {
        //some shrinking animation maybe
        this.element.innerHTML = this.contractedHTML;
        this.isExpanded = false;
    }

    close() {
        this.collapse()
        this.visible = false
    }

}