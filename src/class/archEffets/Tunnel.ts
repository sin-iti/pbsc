import { StThree } from "../stThree/StThree";
import { CylinderGeometry, MeshBasicMaterial, BackSide, Mesh, PerspectiveCamera } from "three";
import { Tween, update } from "@tweenjs/tween.js";

export namespace Tunnel {

}

export class Tunnel extends StThree {
    public renderer;
    public scene;
    public camera;

    public start() {
        let mesh = this.initCubes();
        this.rotateMesh(mesh);
        this.animeStart();
    }

    protected animeStart() {
        this.renderNow();
        update();
        requestAnimationFrame(() => {
            this.animeStart();
        });
    }

    protected rotateMesh(mesh) {
        let target = new Tween(mesh.rotation);
        target.to({
            y: Math.PI * 2
        }, 5000).repeat(Infinity).start();
    }

    protected initCubes() {
        let geometry = new CylinderGeometry(10, 10, 100, 16, 32, true);
        let material = new MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            side: BackSide,
            wireframe: true
        });
        let mesh = new Mesh(geometry, material);
        mesh.position.z = 128;
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
        return mesh;
    }

    protected initCamera() {
        // super.initCamera();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.z = 180;
        this.camera.lookAt(0, 0, 0);
    }
}