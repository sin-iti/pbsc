import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, Object3D, SphereGeometry, Vector3, Texture, SpriteMaterial, Sprite } from "three";
// import { loopItems } from "../../../common/func/ArrayLike";
import { Tween, update } from "@tweenjs/tween.js";
import { loopItem } from "../../func/arrLike";

export namespace Ball {

}

export class Ball extends StThree {
    public scale: number = 50;
    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        let { camera } = this;
        camera.position.z = 100;
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
    }
    protected init3DObj() {
        let group = new Object3D();
        let geometry = new SphereGeometry(60, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        let vertices = geometry.vertices;
        let verticesNum = vertices.length;
        let centerNum = verticesNum / 2;
        this.insertToScene(group);
        loopItem(vertices, (vertice, i) => {
            let middle = centerNum - Math.abs(i - centerNum);


            setTimeout(() => {
                this.insertToGroup(group, vertice, middle);
            }, i * 5);
        });
        this.translateGroup(group);
        this.rotateGroup(group);
    }
    protected rotateGroup(group: Object3D) {
        this.tweenize(group)
            .to({
                y: Math.PI * 2
            }, 40000)
            .repeat(Infinity)
            .start();
    }
    protected translateGroup(group: Object3D) {
        let target = new Tween(group.position);
        target.delay(3000)
            .to({
                z: 100
            }, 10000)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }
    protected insertToGroup(group: Object3D, vertice: Vector3, middle: number) {
        this.asyncLoadImg(this.devImg).then(img => {
            let canvasImg = this.getCanvasByAvatarImg(img);
            let texture = new Texture(canvasImg);
            texture.needsUpdate = true;
            let scale = middle * 4 / 600;
            let material = new SpriteMaterial({
                map: texture
            });
            let sprite = new Sprite(material);
            sprite.position.set(vertice.x, vertice.y, vertice.z);
            if (scale) {//scale == 0时,console会有warn
                sprite.scale.set(scale, scale, 1);
            }
            group.add(sprite);
        });
    }
    public start(): this {
        this.init3DObj();
        return this;
    }
}