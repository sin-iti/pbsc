import { StThree } from "../stThree/StThree";
import { PerspectiveCamera, PlaneGeometry, Texture, MeshLambertMaterial, Mesh, Object3D, CircleGeometry, MeshBasicMaterial, TextureLoader } from "three";
import { StCanvas } from "../StCanvas/StCanvas";
import { rand } from "../../func/num";
import { format } from "url";
declare const __static: string;
export namespace StarGroup {

}

export class StarGroup extends StThree {
    protected sky: Object3D;
    public colorsStars: string[] = ['red_star.png', 'blue_star.png'];
    public avatarStarsNum: number = 40;
    protected initCamera() {
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
        let { camera } = this;
        camera.position.z = 1000;
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
    }
    protected getFivePointsStarByImg(img: HTMLImageElement): HTMLCanvasElement {
        let stCanvas = new StCanvas();
        let { elm, drawer } = stCanvas;
        let radius = img.width / 2.5;
        let widthPower = Math.round(Math.log2(img.width));
        let heightPower = Math.round(Math.log2(img.height));
        elm.width = 2 ** widthPower;
        elm.height = 2 ** heightPower;
        let pattern = drawer.createPattern(img, 'no-repeat');
        drawer.beginPath();
        let avgAngle = Math.PI * 2 / 5;
        let halfAvgAngle = avgAngle / 2;
        let radius1 = radius;
        let radius2 = radius / 2;
        let circleX = elm.width / 2;
        let circleY = elm.height / 2;
        for (let i = 0; i < 5; i++) {
            let angle1 = avgAngle * i;
            let x1 = Math.cos(angle1) * radius1 + circleX;
            let y1 = Math.sin(angle1) * radius1 + circleY;
            drawer.lineTo(x1, y1);
            let angle2 = angle1 + halfAvgAngle;
            let x2 = Math.cos(angle2) * radius2 + circleX;
            let y2 = Math.sin(angle2) * radius2 + circleY;
            drawer.lineTo(x2, y2);
        }
        drawer.lineWidth = 3;
        drawer.closePath();
        drawer.strokeStyle = '#ff0000';
        drawer.stroke();
        drawer.fillStyle = pattern;
        drawer.fill();
        return elm;
    }
    protected addFivePointsMeshByCanvas(avatar: HTMLImageElement, canvas: HTMLCanvasElement, index: number) {

        let radius = avatar.width / 2.5;
        let geometry = new PlaneGeometry(radius * 2, radius * 2);
        let texture = new Texture(canvas);
        texture.needsUpdate = true;
        let material = new MeshBasicMaterial({
            map: texture,
            // depthTest: false,
            transparent: true
        });
        let mesh = new Mesh(geometry, material);
        mesh.name = JSON.stringify([index, 0.1]);
        this.animateMesh(mesh);
        this.insertToScene(mesh);

    }
    protected animateMesh(mesh: Mesh) {
        let meshName = JSON.parse(mesh.name);
        let delay = Math.random() * 1000 + meshName[0] * 200;
        mesh.position.set(- Math.random() * 300 - 300, Math.random() * 200 - 100, 0);
        mesh.scale.set(0.001, 0.001, 1);

        this.tweenize(mesh.position).delay(delay).to({
            x: Math.random() * 400 - 100,
            y: Math.random() * 100 - 50,
            z: 1000
        }, 10000).start();
        this.tweenize(mesh.scale).delay(delay).to({
            y: meshName[1],
            x: meshName[1],
        }, 10000).start().onComplete(() => {
            this.animateMesh(mesh);
        });
    }
    protected init3DObj() {
        let num = this.avatarStarsNum;
        for (let i = 0; i < num; i++) {
            this.asyncLoadImg(this.devImg).then(avatar => {
                let canvas = this.getFivePointsStarByImg(avatar);
                this.addFivePointsMeshByCanvas(avatar, canvas, i);
            });
        }
    }
    protected initBg() {
        let sky = new Object3D();
        let geometry = new CircleGeometry(6, 4);
        let material = new MeshBasicMaterial({
            color: '#ffff00',
            depthTest: false,
            transparent: true,
        });
        for (let i = 0; i < 200; i++) {
            let star = new Mesh(geometry, material);
            star.position.set(rand(-1500, 1500), rand(-1500, 1500), 0);
            star.name = i.toString();
            this.twinkleStar(star);
            sky.add(star);
        }
        this.sky = sky;
        this.insertToScene(sky);
    }
    protected twinkleStar(star: Object3D) {
        let delay = Math.random() * 500 + parseInt(star.name) * 20;
        star.rotation.set(0, 0, 0);
        this.tweenize(star.rotation).delay(delay)
            .to({
                x: Math.PI * 2
            }, 1000).start().onComplete(() => {
                this.twinkleStar(star);
            });
    }
    protected initColorStar(img: HTMLImageElement) {
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                let radius = img.width / 2;
                let geometry = new PlaneGeometry(radius * 2, radius * 2);
                let texture = new Texture(img);
                texture.needsUpdate = true;
                let material = new MeshBasicMaterial({
                    map: texture,
                    depthTest: false,
                    transparent: true,
                });
                let mesh = new Mesh(geometry, material);
                mesh.name = JSON.stringify([i * 10, 0.05]);
                this.animateMesh(mesh);
                this.insertToScene(mesh);
            }, 10);
        }
    }
    protected initShootingStar() {
        let imgSrc = format({
            pathname: __static + "/img/shooting_star.png",
            protocol: 'file',
            slashes: true
        });
        this.asyncLoadImg(imgSrc).then((img) => {
            let canvas = this.getCanvasByAvatarImg(img);
            let texture = new Texture(canvas);
            texture.needsUpdate = true;
            let material = new MeshBasicMaterial({
                map: texture,
                depthTest: false,
                transparent: true,
            });
            let geometry = new PlaneGeometry(300, 300);
            let shootingStar = new Mesh(geometry, material);
            this.enflyShootingStar(shootingStar);
            this.insertToScene(shootingStar);
        });
    }
    protected enflyShootingStar(star: Mesh) {
        let pointX = Math.random() * 2700 - 1350;
        let pointY = 890;
        star.position.set(pointX, pointY, 0);
        let targetX: number, targetY: number;
        if (star.position.x + 1640 < star.position.y + 890) {
            targetX = -1640;
            targetY = star.position.y - star.position.x - 1640;
        } else {
            targetX = - 890;
            targetX = star.position.x - star.position.y - 890;
        }
        this.tweenize(star.position).delay(5000)
            .to({
                x: targetX,
                y: targetY
            }, 2000).start().onComplete(() => {
                this.enflyShootingStar(star);
            });
    }
    public mixColorStar() {
        let colorsStars = this.colorsStars;
        colorsStars.forEach(star => {
            let srcUrl = this.getStaticUrlOf(star);
            this.asyncLoadImg(srcUrl).then(starImg => {
                this.initColorStar(starImg);
            });
        });
    }
    public start() {
        this.init3DObj();
        this.initBg();
        this.mixColorStar();
        this.initShootingStar();
    }
    public startAnime(): this {
        this.sky.rotateZ(Math.PI / 2000);
        super.startAnime();
        return this;
    }
}