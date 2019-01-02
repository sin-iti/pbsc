import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, Sprite, Texture, SpriteMaterial } from "three";
import * as  Stats from "stats.js";
export namespace Wave {

}

export class Wave extends StThree {
    protected separation = 100;
    protected amountX = 50;
    protected amountY = 50;
    protected directionX = 1;
    protected avatarSize = 2;
    protected particles: Sprite[] = [];
    protected count = 0;
    public farest = 900;
    public nearest = -900;
    public stats: Stats = new Stats();
    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        let { camera } = this;
        camera.position.z = 500;
        camera.position.y = window.innerHeight / 4;

    }
    public start(): this {
        this.init3DObject();
        return this;
    }
    protected events: {[evt: string]: any[]} = {};
    public when(evtName: string, func: any) {
        let arr = this.events[evtName];
        if (typeof arr === "undefined") {
            this.events[evtName] = [];
        }
        this.events[evtName].push(func);
    }
    protected trigger(evtName: string, data?:any) {
        let arr = this.events[evtName];
        console.log(evtName);
        if (typeof arr === "undefined") {
            this.events[evtName] = [];
            arr = [];
        }
        arr.forEach(item => {
            item.call(this, data);
        });
    }
    protected init3DObject() {
        let { amountX, amountY, separation } = this;
        let len = this.particles.length;
        let count = amountX * amountY;
        console.log(len);
        if (count <= len) {
            this.trigger('inited3DObj');
            return ;
        }
        this.asyncLoadImg(this.devImg).then(imgSrc => {
            let canvas = this.getCanvasByAvatarImg(imgSrc);
            let texture = new Texture(canvas);
            texture.needsUpdate = true;
            let ix = Math.floor(len / amountX);
            let iy = len % amountX;
            let material2 = new SpriteMaterial({
                map: texture,
                transparent: true
            });
            let particle = new Sprite(material2);
            particle.position.x = ix * separation - (amountX * separation) / 2;
            particle.position.z = iy * separation - (amountY * separation) / 2;
            particle.name = JSON.stringify({
                ix: ix,
                iy: iy
            });
            this.insertToScene(particle);
            this.particles.push(particle);
            requestAnimationFrame(() => {
                this.init3DObject();
            })
        });
      
    }

    protected rendering() {
        let { camera, scene, farest, nearest } = this;
        if (camera.position.x >= farest) {
            this.directionX = -1;
        }
        if (camera.position.x <= nearest) {
            this.directionX = 1;
        }
        camera.position.x += this.directionX;
        camera.lookAt(scene.position);
        this.reorgParticle();
    }
    protected reorgParticle() {
        let { particles, count } = this;
        particles.forEach(particle => {
            let { ix, iy } = JSON.parse(particle.name);
            let scale = (Math.sin((ix + count) * 0.3) + 1) * 4 + (Math.sin((iy + count) * 0.5) + 1) * 4;
            let y = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
            particle.position.y = y;
            particle.scale.x = scale * this.avatarSize;
            particle.scale.y = scale * this.avatarSize;
        });
    }
    
    public startAnime(): this {
        this.rendering();
        this.count += 0.1;
        this.renderNow();
        this.stats.update();
        this.animeId = requestAnimationFrame(() => {
            this.startAnime();
        });
        return this;
    }
}