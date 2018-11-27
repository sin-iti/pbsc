import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, Object3D, Texture, SpriteMaterial, Sprite } from "three";
import { StCanvas } from "../StCanvas/StCanvas";
import { Tween, update } from "@tweenjs/tween.js";

export namespace Star {

}

export class Star extends StThree {
    constructor() {
        super();
    }
    public start() {
        this.initPlate();
        this.animeStart();
    }
    public animeStart() {
        this.renderNow();
        update();
        requestAnimationFrame(() => {
            this.animeStart();
        });
    }
    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        let { camera } = this;
        camera.position.z = 500;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt(0, 0, 0);
    }
    protected initPlate() {
        for (let i = 0; i < 20; i++) {
            this.updatePlate();
        }
    }
    protected async updatePlate() {
        let { elm, drawer } = new StCanvas();
        let img = await this.asyncLoadImg('http://hudongpic.passboat.com/uploads/20181023/15402882107494.jpg');
        let avatarSize = 136;
        elm.width = avatarSize;
        elm.height = avatarSize;
        drawer.beginPath();
        drawer.drawImage(img, 0, 0, img.width, img.height, 0, 0, elm.width, elm.width);
        drawer.globalCompositeOperation = 'destination-in';
        drawer.arc(avatarSize / 2, avatarSize / 2, avatarSize / 2 - 6, 0, Math.PI * 2);
        drawer.fill();
        drawer.globalCompositeOperation = 'source-over';
        drawer.strokeStyle = '#ff7634';
        drawer.lineWidth = 4;
        drawer.stroke();
        this.addPlate(elm);
    }
    protected addPlate(elm: HTMLCanvasElement) {
        let texture = new Texture(elm);
        let plate = new Object3D();
        texture.needsUpdate = true;
        let material = new SpriteMaterial({
            color: 0xffffff,
            map: texture,
        });
        let avatar = new Sprite(material);
        avatar.position.set(Math.random() * 400 - 200, Math.random() * 160 - 80, 0);
        avatar.scale.set(50, 50, 1);
        plate.add(avatar);
        plate.position.set(0, -500, 0);
        this.translatePlate(plate);
    }
    protected translatePlate(plate: THREE.Object3D) {
        this.scene.add(plate);
        let tw = new Tween(plate.position);
        tw.delay(2000).to({
            y: 500
        }, 5000).repeat(Infinity).start();
    }
}
