import { loopItem } from "../func/arrLike";

export namespace TimeLine {
    export interface NodeInfo {
        time: string;
        events: string[];
    }
}

export class TimeLine {
    protected nowLeft:number = 0;
    public marginRight: number = 10;
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
        nodes.appendChild(node);
        this.setNodeLeft(node);
        return this;
    }
    public setAllNodesLeft(): this {
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        let nodes = nodesElm.querySelectorAll(".node");
        this.nowLeft = 0;
        nodesElm.style.width = "0px";
        loopItem(nodes, (node: HTMLElement) => {
            this.setNodeLeft(node);
        });
        return this;
    }
    public setNodeLeft(node: HTMLElement): this {
        let block = <HTMLElement>node.querySelector(".info-block");
        let blockWidth = block.offsetWidth;
        this.nowLeft += blockWidth / 2;
        node.style.left = this.nowLeft.toString() + 'px';
        this.nowLeft += blockWidth / 2 + this.marginRight;
        let nodesElm = <HTMLElement>this.mapElm.querySelector('.nodes');
        nodesElm.style.width = this.nowLeft.toString() + 'px'; 
        return this;
    }
}