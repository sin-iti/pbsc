import { loopItem } from "../../func/arrLike";

// import { loopItems } from "../../../common/func/ArrayLike";

export namespace StCanvas {
    export interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    export interface Color {
        red: number;
        green: number;
        blue: number;
    }
    export interface AlphaColor extends Color {

        alpha: number
    }
    export interface Point {
        x: number;
        y: number;
    }
    export interface Point3d extends Point {
        z: number
    }
    export type FilterPonitsFunc = (x: number, y: number, alpha: number) => void;
}

export class StCanvas {
    private _canvas: HTMLCanvasElement;
    constructor(canvasElm?: HTMLCanvasElement) {
        if (!canvasElm) {
            canvasElm = document.createElement("canvas");
        }
        this._canvas = canvasElm;
    }
    get elm() {
        return this._canvas;
    }
    set elm(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }
    get drawer() {
        return this.elm.getContext("2d");
    }
    public getImgDatas(startX: number, startY: number, width: number, height: number): Uint8ClampedArray {
        let dataArray = this.drawer.getImageData(startX, startY, width, height);
        let arr = dataArray.data;
        return arr;
    }
    public getPoints(startX: number, startY: number, width: number, height: number): StCanvas.AlphaColor[] {
        let arr = this.getImgDatas(startX, startY, width, height);
        let points = [];
        loopItem(arr, (data, index) => {
            let pointIndex = Math.floor(index / 4);
            let rgbaIndex = index % 4;
            let attrs = ["red", "green", "blue", "alpha"];
            let point = points[pointIndex];
            // console.log(pointIndex);
            if (typeof points[pointIndex] == "undefined") {
                points[pointIndex] = {
                    red: 0,
                    alpha: 0,
                    green: 0,
                    blue: 0,
                }
                point = points[pointIndex];
            }
            let attr = attrs[rgbaIndex];
            if (attr === "alpha") {
                data = data / 255;
            }
            point[attr] = data;
            // console.log(data, attr, point[attr])
            points.push(point);
        });
        return points;
    }
    public filterPointsByFunc(rect: StCanvas.Rect, step: [number, number] | number = 6, func: StCanvas.FilterPonitsFunc): void {
        let xStep = 6;
        let yStep = 6;
        if (typeof step === "object") {
            xStep = step[0];
            yStep = step[1];
        } else {
            xStep = step;
            yStep = xStep;
        }
        let { x, y, width, height } = rect;
        let endX = x + width;
        let endY = y + height;
        for (let xIndex = x; xIndex <= endX; xIndex += xStep) {
            for (let yIndex = y; yIndex <= endY; yIndex += yStep) {
                let points = this.getPoints(xIndex, yIndex, xStep, yStep);
                let sumAlpha = 0;
                let avgAlpha = 0;
                loopItem(points, p => {
                    sumAlpha += p.alpha;
                });
                avgAlpha = sumAlpha / points.length;
                func(xIndex, yIndex, avgAlpha);
            }
        }
    }
    public filterPoints(rect: StCanvas.Rect, step: number | [number, number] = 6, alphaStandard: number = 0.35): StCanvas.Point3d[] {
        let filtered: StCanvas.Point3d[] = [];

        this.filterPointsByFunc(rect, step, (x, y, alpha) => {
            if (alpha > alphaStandard) {
                filtered.push({
                    x: x,
                    y: y,
                    z: 0
                })
            }
        })
        return filtered;
    }

    public devRedrawByPoints(points: StCanvas.Point3d[]) {//justForTest
        let canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let drawer = canvas.getContext("2d");

        drawer.fillStyle = "red";
        loopItem(points, p => {
            drawer.beginPath();
            drawer.arc(p.x, p.y, 1, 0, Math.PI * 2);
            drawer.fill();
        });

        let firstNode = document.body.querySelector("div");
        canvas.setAttribute('data-id', 'dev-test');
        document.body.insertBefore(canvas, firstNode);
    }
}