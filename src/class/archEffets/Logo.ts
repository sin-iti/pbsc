import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, Texture, SpriteMaterial, Sprite, Object3D } from "three";
import { StCanvas } from "../StCanvas/StCanvas";
// import { loopItems } from "../../../common/func/ArrayLike";
import { Tween, update } from "@tweenjs/tween.js";
import { format } from "url";
declare const __static: string;
export namespace Logo {
    export interface PrintedInfo {
        points: StCanvas.Point3d[];
        destWidth: number;
        destHeight: number;
    }
}

export class Logo extends StThree {
    protected baseAvatarWidth = 12;
    protected logoScale = 1;

    protected logoSrc = format({
        slashes: true,
        protocol: 'file',
        pathname: `${__static}/img/logo1_01.png`,
    });
    protected points: StCanvas.Point3d[] = [];
    protected pointIndex: number = 0;
    protected stCanvas = new StCanvas();
    protected avatarBox: Object3D;
    protected cachePointLength: number = 0;//因为太卡,新增这个作为缓存
    protected rotateStarted: boolean = false;
    public start() {
        this.printLogo();
    }
    public startAnime() {
        if (this.pointIndex < (this.points.length - 1)) {
            this.pointIndex++;
            this.loopAddPoints();
        } else {
            console.log('rotate');
            this.rotateAvatarBox();
        }
        update();
        this.renderNow();
        this.animeId = requestAnimationFrame(() => {
            this.startAnime();
        });
        return this;
    }
    protected getLogoPoints(logoImg: HTMLImageElement): StCanvas.Point3d[] {
        let imgWidth = logoImg.width;
        let imgHeight = logoImg.height;
        let destWidth = window.innerWidth - 10;
        let imgRatio = imgWidth / imgHeight;
        let destHeight = destWidth / imgRatio;
        let maxHeight = window.innerHeight - 10;
        if (destHeight > maxHeight) {
            destHeight = maxHeight;
            destWidth = destHeight * imgRatio;
        }
        let stCanvas = this.stCanvas;
        let { drawer, elm } = stCanvas;
        elm.width = window.innerWidth;
        elm.height = window.innerHeight;
        drawer.drawImage(logoImg, 0, 0, imgWidth, imgHeight, 0, 0, destWidth, destHeight);
        let avatarWidth = this.baseAvatarWidth;
        let rect = {
            x: 0,
            y: 0,
            width: destWidth,
            height: destHeight
        };

        stCanvas.filterPointsByFunc(rect, avatarWidth, (x, y, alpha) => {
            if (alpha > 0.05) {
                let point = {
                    x: x - destWidth / 2,
                    y: destHeight / 2 - y,
                    z: 0,
                };
                this.points.push(point);
            }
        });
        return this.points;
    }
    protected printLogo() {
        let logoImgPromise = this.asyncLoadImg(this.logoSrc);
        logoImgPromise.then(logoImg => {
            let points = this.getLogoPoints(logoImg);
            this.avatarBox = new Object3D();
            this.scene.add(this.avatarBox);
            this.points = points;
            this.startAnime();
        }).catch(err => {
            console.error(err);
        });
    }
    public loopAddPoints() {
        let index = this.pointIndex;
        let point = this.points[index];
        let imgPromise = this.asyncLoadImg('http://hudongpic.passboat.com/uploads/20181023/15402882107494.jpg');
        imgPromise.then(img => {
            let sprite = this.buildSpriteObj(img, point, index);
            this.avatarBox.add(sprite);
            let target = new Tween(sprite.position);
            target.to({
                x: point.x,
                y: point.y,
                z: point.z
            }, 1000).start();
        });
    }

    protected rotateAvatarBox() {
        if (this.rotateStarted) {
            return;
        }
        let tweenRotation = new Tween(this.avatarBox.rotation);
        tweenRotation.to({
            y: Math.PI * 2
        }, 20000)
            .repeat(Infinity)
            .start();
        this.rotateStarted = true;
    }
    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        let { camera } = this;
        camera.position.z = 400;
        camera.up.set(0, 0, 0);
        camera.lookAt(0, 0, 0);
    }
    protected toCanvasImg(img: HTMLImageElement, size: number): HTMLCanvasElement {
        let { elm, drawer } = new StCanvas();
        elm.width = size;
        elm.height = size;
        drawer.drawImage(img, 0, 0, img.width, img.height, 0, 0, size, size);
        return elm;
    }
    protected buildSpriteObj(img: HTMLImageElement, point: StCanvas.Point3d, index: number): Sprite {
        let canvasImg = this.toCanvasImg(img, 512);
        let texture = new Texture(canvasImg);
        texture.needsUpdate = true;
        let material = new SpriteMaterial({
            map: texture
        });
        let sprite = new Sprite(material);
        sprite.position.set(0, -300, 0);
        sprite.scale.set(this.baseAvatarWidth, this.baseAvatarWidth, 1);
        return sprite;
    }
}