export namespace StAjax {
    export type Method = "POST" | "GET";
    export interface Options {
        url: string;
        method: Method;
        async: boolean;
        data?: any;
        crossDomain: boolean;
        json: boolean;
    }
}
declare let ActiveXObject: any;
export class StAjax {
    readonly requester: XMLHttpRequest;
    constructor(public opt: Partial<StAjax.Options>) {
        if (window["XMLHttpRequest"]) {
            this.requester = new XMLHttpRequest();
        } else {
            this.requester = new ActiveXObject("Microsoft.XMLHTTP");
        }
        this.listenStateChange();
    }
    protected listenStateChange() {
        let { requester } = this;
        requester.onreadystatechange = () => {
            if (requester.readyState == 4 && requester.status == 200) {
                this.getReply();
            }
        }
    }
    protected getReply() {
        let { requester } = this;
        let isJSON = this.opt.json;
        if (typeof isJSON === "undefined") {
            isJSON = true;
        }
        let reply: any = requester.responseText;
        let right = true;
        if (isJSON) {
            try {
                reply = JSON.parse(reply);
            } catch (err) {
                this.error(err);
                right = false;
            }
        }
        if (right) {
            this.success(reply);
        }
    }
    protected error(err) {
        console.error(err);
    }
    protected success(text: any) {

    }
    public send() {
        console.log(this.requester);
        let method = this.opt.method;
        if (!method) {
            method = "GET";
        }
        let url = this.opt.url;
        if (!url) {
            url = location.href;
        }
        let async = this.opt.async;
        if (typeof async != "boolean") {
            async = true;
        }
        this.requester.open(method, url, async);
        if (!this.opt.crossDomain) {
            this.requester.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        this.requester.send();
    }
    public whenSuccess(success: (text: any) => void) {
        this.success = success;
        return this;
    }
}