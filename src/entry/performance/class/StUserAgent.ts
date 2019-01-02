export class StUserAgent {
    readonly userAgent = navigator.userAgent;
    readonly IEVersion: string;
    readonly isIE: boolean;
    readonly isChrome: boolean;
    readonly isFirefox: boolean;
    readonly isSafari: boolean;
    readonly browserBrand;
    constructor() {
        this.isIE = /Trident/i.test(this.userAgent);
        this.isChrome = /Chrome/i.test(this.userAgent);
        if (this.isChrome) {
            this.isSafari = false;
        } else {
            this.isSafari = /Safari/i.test(this.userAgent);
        }
        this.isFirefox = /Firefox/i.test(this.userAgent);
    }
    protected getIEVersion(): string {
        if (this.isIE) {
            let regExp = /MSIE\s*([\d\.]+)/;
            let matchers = this.userAgent.match(regExp);
            if (matchers) {
                return matchers[1];
            }
            return '11.0';
        }
        return '';
    }
    protected getIsIE(): boolean {
        return /Trident/i.test(this.userAgent);
    }
    protected getIsChrome(): boolean {
        return /Chrome/i.test(this.userAgent);
    }

}