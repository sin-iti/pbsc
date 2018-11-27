import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, Texture, SpriteMaterial, Sprite } from "three";
import { rand } from "../../func/num";

export namespace Fairy {

}

export class Fairy extends StThree {

    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.z = 3000;
        this.camera.up.set(0, 1, 0);
    }
    public init(): this {
        super.init();
        this.initParticles();
        return this;
    }
    protected initRenderer() {
        super.initRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    protected initParticles() {
        for (let i = 0; i < 900; i++) {
            this.addParticle(i);
        }
    }

    protected addParticle(index: number) {
        this.asyncLoadImg(this.devImg).then((img) => {
            let imgCanvas = this.getCanvasByAvatarImg(img);
            let texture = new Texture(imgCanvas);
            texture.needsUpdate = true;
            let material = new SpriteMaterial({
                map: texture
            });
            let particle = new Sprite(material);
            particle.name = index.toString();
            this.initializeParticle(particle);
            this.scene.add(particle);
        }).catch((err) => {

        });
    }

    protected initializeParticle(particle?: Sprite) {
        let delay = (parseInt(particle.name) + 1) * 10;
        particle.position.set(0, 0, 0);
        let scale = rand(16, 48);
        particle.scale.set(scale, scale, 1);
        this.tweenize(particle)
            .delay(delay)
            .to({}, 10000)
            .onComplete(() => {
                this.initializeParticle(particle)
            }).start();
        this.tweenize(particle.position).delay(delay)
            .to({
                x: Math.random() * 30000 - 15000,
                y: Math.random() * 20000 - 10000,
                z: Math.random() * 20000
            }, 50000).start();
        this.tweenize(particle.scale)
            .delay(delay)
            .to({
                x: 50,
                y: 50
            }, 50000)
            .start();
    }
}