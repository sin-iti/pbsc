export class StExplorer{
    static cssEvt = {
        "transitionend": {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }
    };
    static hasStyleAttr(attr: string, elmTag: string = 'div'): boolean {
        let elm = document.createElement(elmTag);
        let allStyles = window.getComputedStyle(elm);
        return (attr in allStyles);
    }
    static userAgent() {
        return navigator.userAgent;
    }
    static isIE(): boolean {
        return  ('ActiveXObject' in window);
    }
    static isChrome() {
        if (this.isTypeOf("edge")) {
            return false;
        }
        return this.isTypeOf("chrome");
    }
    static isSafari() {
        if (this.isTypeOf("chrome")) {
            return false;
        }
        return this.isTypeOf("safari");
    }
    static isTypeOf(type: string): boolean {
        if (type.toLowerCase() === "ie") {
            return this.isIE();
        }
        if (type.toLowerCase() === "edge") {
            type = "(trident|edge)";
        }
        let userAgent = StExplorer.userAgent();
        let regExp = new RegExp(type, 'i');
        return regExp.test(userAgent);
    }
    static getTransitonEndName(type: "string" | "string[]" = "string"): string | string[] {
       return StExplorer.getEvtNameByStyle("transitionend");      
    } 
    static getAnimationEndName(type: "string" | "string[]" = "string"): string | string[] {
       return StExplorer.getEvtNameByStyle("animationend");      
    }
    static getEvtNameByStyle(evt: string, type: "string" | "string[]" = "string") : string | string[] {
        evt = evt.toLowerCase();
        let cssEvt = StExplorer.cssEvt[evt];
        let evtName = "";
        for (let attr in cssEvt) {
            if (StExplorer.hasStyleAttr(attr)) {
                evtName = cssEvt[attr];
                break;
            }
        }
        if (type === "string") {
            return evtName;
        } 
        return evtName.split(" ");
    }
    static hasOnEvtname(evtName: string): boolean {
        return ('on' + evtName) in window;
    }
}