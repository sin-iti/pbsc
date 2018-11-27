// import "@types/tween.js/index";
import * as THREE from "three";
import {update, Tween} from "@tweenjs/tween.js";
import { StThree } from "../stThree/StThree";
import { StCanvas } from "../StCanvas/StCanvas";
import { loopItem } from "../../func/arrLike";

export namespace ArchTextEffect {
    export interface Point3d {
        x: number;
        y: number;
        z: number;
    }
    export type ImgCache = {
        [url: string]: HTMLImageElement
    }
    export type PointCache = {
        [str: string]: Point3d[];
    }
}
export class ArchTextEffect extends StThree {
    public avatarSize = 5;
    public textBox: THREE.Object3D = new THREE.Object3D();
    public box: HTMLElement;
    protected light: THREE.AmbientLight;
    public canvas: StCanvas = new StCanvas();
    public drawer: CanvasRenderingContext2D = this.canvas.drawer;
    protected animeId: number = 0;
    protected imgTemp = {} as ArchTextEffect.ImgCache;
    protected pointsCache = {} as ArchTextEffect.PointCache;
    constructor() {
        super();
        this.loadedImg('http://hudongpic.passboat.com/uploads/20181023/15402882107494.jpg');
    }
    public loadedImg(src: string) {
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            img.style.display = "none";
            img.setAttribute('data-src', src);
            document.body.appendChild(img);
        }
        img.src = src;
    }
    protected initCamera() {
        super.initCamera();
        let { camera } = this;
        camera.position.z = 200;
    }
    public start() {
        this.initOn(this.box);
        this.drawText('abcde');
        this.animeStart();
    }
    public animeStart() {
        this.renderNow();
        update();
        this.animeId = requestAnimationFrame(() => {
            this.animeStart();
        });
    }
    protected initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    protected initLight() {
        this.light = new THREE.AmbientLight();
        let { light } = this;
        light.position.set(100, 100, 200);
        this.scene.add(light);
    }
    protected getTextPoints(text: string): ArchTextEffect.Point3d[] {
        if (text in this.pointsCache) {
            return this.pointsCache[text];
        }
        let { canvas, drawer } = this;
        let len = text.length;
        let fontSize = (window.innerWidth - 80) / len;
        let fontHeight = fontSize * 1.4;
        if (fontHeight > window.innerHeight - 80) {
            fontSize = (window.innerHeight - 80);
            fontHeight = fontSize * 1.4;
        }
        canvas.elm.width = window.innerWidth;
        canvas.elm.height = window.innerHeight;
        drawer.font = `bold ${fontSize}px arial`;
        drawer.fillStyle = 'red';
        drawer.textAlign = 'center';
        drawer.textBaseline = 'middle';
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;
        drawer.fillText(text, centerX, centerY);
        let textTakeWidth = text.length * fontSize;
        let sx = centerX - textTakeWidth / 2;
        let sy = centerY - fontHeight / 2;
        this.pointsCache[text] = this.canvas.filterPoints({
            x: sx,
            y: sy,
            width: textTakeWidth,
            height: fontHeight,
        });
        return this.pointsCache[text];
    }

    public getImg(src: string): HTMLImageElement {
        let img = document.querySelector(`img[data-src="${src}"]`) as HTMLImageElement;
        return img;
    }
    public drawText(text: string) {
        let points = this.getTextPoints(text);
        loopItem(points, (point, index) => {
            setTimeout(() => {
                let img = this.getImg('http://hudongpic.passboat.com/uploads/20181023/15402882107494.jpg');
                if (img) {
                    this.addAvatar(img, point);
                }
            }, 3 * index);
        });
        this.scene.add(this.textBox);
        setTimeout(() => {
            let target = new Tween(this.textBox.rotation);
            target.to({
                x: Math.PI * 2
            }, 1000).repeat(Infinity).start();
        }, 3 * points.length);
    }
    protected addAvatar(img: HTMLImageElement, point: ArchTextEffect.Point3d) {
        let texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        let geometry = new THREE.Geometry();
        let vector3 = new THREE.Vector3(point.x - window.innerWidth / 2, window.innerHeight / 2 - point.y, point.z);
        geometry.vertices.push(vector3);
        let material = new THREE.PointsMaterial({
            map: texture,
            size: 6,
        });
        let avatar = new THREE.Points(geometry, material);
        this.textBox.add(avatar);

    }
}