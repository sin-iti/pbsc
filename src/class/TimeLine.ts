import { loopItem } from "../func/arrLike";

export namespace TimeLine {
    export interface NodeInfo {
        time: string;
        events: string[];
    }
}

export class TimeLine {
    // protected nowLeft:number = 0;
    protected startPoint: number;
    protected pointDistance: number;
    public marginRight: number = 10;
    public basicTop: number = 30;
    public showNum: number = 4;//最小为2
    constructor(public mapElm: HTMLElement) {

    }
    public getNodeHtmlBy(nodeInfo: TimeLine.NodeInfo): string {
        let evts = '';
        nodeInfo.events.forEach(evt => {
            evts += `<div>${evt}</div>`;
        });
        return `
            <div class="info-date">${nodeInfo.time}</div>
            <div class="info-block">${evts}</div>
        `;
    }
    public buildNodeFrom(nodeInfo: TimeLine.NodeInfo):HTMLElement {
        let node = document.createElement('div');
        node.setAttribute("class", "node");
        node.innerHTML = this.getNodeHtmlBy(nodeInfo);
       
        return node;
    }
    public addNodesOf(nodeArr: TimeLine.NodeInfo[]): this {
        nodeArr.forEach(node => {
            this.addNode(node);
        });
        return this;
    }
    public addNode(nodeInfo: TimeLine.NodeInfo): this {
        let node = this.buildNodeFrom(nodeInfo);
        let nodes = <HTMLElement>this.mapElm.querySelector('.nodes');
        let index = nodes.querySelectorAll(".node").length;
        nodes.appendChild(node);
        this.setNodeLeft(node, index);
        return this;
    }
    public setMainPoints(nodes: NodeListOf<HTMLElement>) {//假设所有node是等宽的
        let firstNode = nodes[0];
        let mapInfo = <HTMLElement>this.mapElm.querySelector('.map-info');
        let fullWidth = mapInfo.offsetWidth;
        let size = this.getInfoBlockSizeOf(firstNode);
        let startPoint = Math.ceil(size.width / 2);
        let showNum = this.showNum;
        let endPoint = Math.floor(fullWidth - size.width / 2);
        let distance = endPoint - startPoint;
        let dist = distance / (showNum - 1);
        this.startPoint = startPoint;
        this.pointDistance = dist;
        return {
            start: startPoint,
            dist: dist
        }
    }
    public getInfoBlockSizeOf(node: HTMLElement) {
        let block = <HTMLElement>node.querySelector(".info-block");
        return {
            width: block.offsetWidth,
            height: block.offsetHeight,
            elm: block 
        }
    }
    public setAllNodesLeft(): this {
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        let nodes = <NodeListOf<HTMLElement>>nodesElm.querySelectorAll(".node");
        nodesElm.style.width = "0px";
        this.setMainPoints(nodes);
        loopItem(nodes, (node: HTMLElement, index: number) => {
            this.setNodeLeft(node, index);
        });
        return this;
    }
    public setNodeLeft(node: HTMLElement, index: number): this {
        let block = <HTMLElement>node.querySelector(".info-block");
        let blockHeight = block.offsetHeight;
        let remain = index % 2;
        let top = this.basicTop;
        if (remain === 1) {
            top = 0 - blockHeight - this.basicTop + 10;//我也不知道为什么要加10
        }
        block.style.top = top.toString() + 'px';
        let left = this.startPoint + this.pointDistance * index;
        node.style.left = left.toString() + 'px';
        // this.nowLeft += blockWidth / 2;
        // node.style.left = this.nowLeft.toString() + 'px';
        // this.nowLeft += blockWidth / 2 + this.marginRight;
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        nodesElm.style.width = (left + block.offsetWidth / 2).toString() + 'px'; 
        return this;
    }
    public getNodeLineLeft(): number {
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        let style = window.getComputedStyle(nodesElm);
        let left = parseInt(style.left) || 0;
        return left;
    }
    public toRight() {
        return this.moveTo("right");      
    }
    public setPointerShow(pointer: 'right' | 'left', showOrHide: 'block' | 'none' | 'inline-block' = 'none') {
        let pointerElm = <HTMLElement>this.mapElm.querySelector(`.pointer.to-${pointer}`);
        pointerElm.style.display = showOrHide;
    }
    public moveTo(dir: "left" |　"right" = "left"): this {
        let coefficient = dir === "left" ? 1 : -1;
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        let nowLeft = this.getNodeLineLeft();
        let nextLeft = nowLeft + this.pointDistance * coefficient;
        let mapInfoElm = <HTMLElement>this.mapElm.querySelector('.map-info');
        let minLeft = mapInfoElm.offsetWidth - nodesElm.offsetWidth;
        let maxLeft = 0;
        if (nextLeft >= maxLeft) {
            nextLeft = maxLeft;
            this.setPointerShow('left');            
        } else {
            this.setPointerShow('left', 'inline-block');  
        }
        if (nextLeft <= minLeft) {
            nextLeft = minLeft;
            this.setPointerShow('right');            
        } else {
            this.setPointerShow('right', 'inline-block');  
        }
        nodesElm.style.left = nextLeft.toString() + 'px'; 
        return this;
    }
    public toLeft() {
        return this.moveTo("left");  
    }
}