import * as THREE from "three";
import { StBaseThree } from "./StBaseThree";
import { StCanvas } from "../StCanvas/StCanvas";
import { Tween, update } from "@tweenjs/tween.js";
import * as path from "path";
import { format as formatUrl } from "url";
declare const __static: string;
export namespace StThree {

}

export class StThree extends StBaseThree {
    protected scene: THREE.Scene;
    protected camera: THREE.PerspectiveCamera;
    protected renderer: THREE.WebGLRenderer;
    public devImg: string = 'http://hudongpic.passboat.com/uploads/20181023/15402882107494.jpg';
    protected animeId: number = 0;
    public loadImgToDom(src: string): this {
        let img = new Image();
        img.setAttribute('data-src', src);
        img.style.display = "none";
        img.onload = () => {
            document.body.appendChild(img);
        }
        img.src = src;
        return this;
    }
    public getImgFromDom(src: string): HTMLImageElement {
        let img = document.body.querySelector(`img[data-src="${src}"]`) as HTMLImageElement;
        return img;
    }
    public has = false;
    public asyncLoadImg(src: string) {        
        return new Promise<HTMLImageElement>((resolve, reject) => {
            let img = this.getImgFromDom(src);
            if (img) {
                resolve(img);
                return;
            } else {
                img = new Image();
                img.crossOrigin = 'anonymous';
                img.setAttribute('data-src', src);
                img.style.display = "none";
                img.onload = () => {
                    this.has = true;
                    document.body.appendChild(img);
                    resolve(img);
                }
                img.onerror = (err) => {
                    reject(err);
                }
                img.src = src;
            }          
        });
    }
    protected getCanvasByAvatarImg(img: HTMLImageElement, size: number = 512): HTMLCanvasElement {
        let canvas = new StCanvas();
        let { elm, drawer } = canvas;
        elm.width = size;
        elm.height = size;
        drawer.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
        return elm;
    }
    protected tweenize(object) {
        return new Tween(object);
    }
    public startAnime(): this {
        this.renderNow();
        update();
        this.animeId = requestAnimationFrame(() => {
            this.startAnime();
        });
        return this;
    }

    public stopAnime(): this {
        cancelAnimationFrame(this.animeId);
        return this;
    }
    public listenResize() {
        window.addEventListener('resize', (event) => {
            this.whenResize(event);
        });
    }
    protected whenResize(event: UIEvent) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    protected getStaticUrlOf(filename: string, isImg: boolean = true): string {
        if (isImg) {
            filename = path.join('img', filename);
            console.log(filename);
        }
        return formatUrl({
            pathname: path.join(__static, filename),
            protocol: 'file',
            slashes: true
        });
    }
}