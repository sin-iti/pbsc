import { loopItem } from "../func/arrLike";
import * as $ from "jquery";
import { Agent } from "./Agent";
export namespace Slider {
    export type Type = "prev" | "next";
}

export class Slider{
    public itemsBox: HTMLElement;
    public itemSelector: string = '.group';
    public orderBox: HTMLUListElement | HTMLOListElement;
    protected items:  HTMLElement[] = [];
    protected onSliding: boolean = false;
    constructor() {

    }
    public collectItems(): HTMLElement[] {
        let items = this.itemsBox.querySelectorAll(this.itemSelector);
        this.items = [];
        loopItem(items, (item: HTMLElement) => {
            this.items.push(item);
        });
        return this.items;
    }
    public getItems() {
        if (!this.items.length) {
            this.collectItems();
        }
        return this.items;
    }
    protected getOrderItemHtml(index: number) {
        return `
            <li data-index="${index}"></li>
        `;
    }
    public buildOrderItem(): this {
        let items = this.getItems();
        let num = items.length;
        let html = '';
        for (let i = 0; i < num; i ++) {
            html += this.getOrderItemHtml(i);
        }
        if (this.orderBox) {
            this.orderBox.innerHTML = html;
        }
       this.activeOrderItem();
       return this;
    }
    public activeOrderItem() {
        let activeItem = this.getActiveItem();
        let activeIndex = this.getItemIndex(activeItem);
       this.activeOrderByIndex(activeIndex);
    }
    public activeOrderByIndex(index: number) {
        $(this.orderBox).find('li.active').removeClass("active");
        $(this.orderBox).find('li').eq(index).addClass("active");
    }
    public getActiveItem() {
        let item = <HTMLElement>this.itemsBox.querySelector(`${this.itemSelector}.active`);
        return item;
    }
    public getItemIndex(elm: HTMLElement): number {
        let itemIndex = -1;
        loopItem(this.items, (item, index) => {
            if (elm === item) {
                itemIndex = index;
                return false;
            }
        });
        return itemIndex;
    }
    public getItemByIndex(index: number): HTMLElement {
        let items = this.getItems();
        index = index % items.length;
        return items[index];
    }
    public slideTo(nextElm?: HTMLElement) {
        if (this.onSliding) {
            return ;
        }
        let activeItem = this.getActiveItem();
        let activeIndex = this.getItemIndex(activeItem);
        if (!nextElm) {
            let dir = 1;
            let nextIndex = activeIndex + dir;
            nextElm = this.getItemByIndex(nextIndex);
        }
        if ($(nextElm).hasClass("active")) {
            this.onSliding = false;
            return ;
        }
        this.onSliding = true;
        let nextActiveIndex = this.getItemIndex(nextElm);
        this.activeOrderByIndex(nextActiveIndex);
        let type = "next";
        let direction = "left";
        if (nextActiveIndex < activeIndex) {
            type = "prev";
            direction = "right";
        }
        $(nextElm).addClass(type)
        nextElm.offsetWidth;
        $(activeItem).addClass(direction);
        $(nextElm).addClass(direction);
        let self = this;
        let transtionEndEvtName = Agent.getTrasitionEndName();
        if (transtionEndEvtName) {
            $(nextElm).one(transtionEndEvtName, function () {
                $(activeItem).removeClass(`active ${direction}`);
                $(this).addClass("active").removeClass(`${type} ${direction}`);
                self.onSliding = false;
            });
        } else {
            $(activeItem).removeClass(`active ${direction}`);
            $(nextElm).addClass("active").removeClass(`${type} ${direction}`);
            self.onSliding = false;
        }
    }
    public init() {
        this.listenTransitionEnd();
    }
    public slideToOrder(order: number) {
        let items = this.getItems();
        let orderItem = items[order];
        if ($(orderItem).hasClass("active")) {
            return ;
        }
        this.slideTo(orderItem);
    }
    protected listenTransitionEnd() {
       
    }
    
}