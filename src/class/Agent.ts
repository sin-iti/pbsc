export class Agent {
    static getIEVersion(): string {
        if ('ActiveXObject' in window) {
            let testor = /MSIE\s*([\w\.]+)/i;
            let matcher = navigator.userAgent.match(testor);
            if (matcher) {
                return matcher[1];
            }
            return '11';
        }      
        return '';
    }
    static isIE() {
        if ('ActiveXObject' in window) {
            return true;
        }
        return false;
    }
    static explorerIs(explorerSym: string): boolean {
        let regExp = new RegExp(explorerSym, 'i');
        let result =  regExp.test(navigator.userAgent);       
        return result;
    }
    static isChrome(): boolean {
       return this.explorerIs("Chrome");
    }
    static getChromeVersion(): string {
        let arr = navigator.userAgent.split(' '); 
        let chromeVersion = '';
        for(var i=0;i < arr.length;i++){
            if(/chrome/i.test(arr[i])){
                chromeVersion = arr[i]
                break;
            }
        }
        if (chromeVersion) {
            return chromeVersion.split("/")[1];
        }
        return '';
    }
    static getTrasitionEndName() {
        var el = document.createElement('bootstrap')
    
        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }

        return false 
    }

    static hasStyleOf(style: string | true, elmTag: string = 'div'): boolean | CSSStyleDeclaration {
        let elm = document.createElement(elmTag);
        let fullStyle = window.getComputedStyle(elm);
        if (style === true) {
            return fullStyle;
        }
        return !!(style in fullStyle);
    }
}