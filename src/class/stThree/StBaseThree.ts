import * as THREE from "three";


export namespace StBaseThree {

}

export abstract class StBaseThree {
    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected renderer: THREE.Renderer;
    constructor() {

    }
    public init(): this {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        return this;
    }
    public initOn(elm?: HTMLElement): this {
        this.init();
        this.insertDomTo(elm);
        return this;
    }
    protected initScene() {
        this.scene = new THREE.Scene();
    }
    protected initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    }
    protected initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    public renderNow(): this {
        this.renderer.render(this.scene, this.camera);
        return this;
    }
    public insertDomTo(elm?: HTMLElement): this {
        if (!elm) {
            elm = document.body;
        }
        elm.appendChild(this.renderer.domElement);
        return this;
    }

    protected insertToScene(...obj: THREE.Object3D[]): this {
        this.scene.add(...obj);
        return this;
    }
}