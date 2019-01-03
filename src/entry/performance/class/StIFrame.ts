import { loopItems } from "../func/func";
import { StCls } from "./StCls";
import * as QRCode from "qrcode";

export namespace StIFrame {

}

export class StIFrame {
    // readonly src = "http://act.dthudong.cn/addons/execute/sign-show-index?acid=B2IOSkWk2WiwkJU&safe=n1331r7px8gaw39";
    readonly src = "http://dev.akaba.cn/addons/execute/sign-show-index?acid=ADAOHRbx1me2mw&safe=5b85chno3ca6bg5";
    readonly elm: HTMLIFrameElement = document.querySelector("iframe");
    public qrc = {
        wechat: {
            link: '',
            tip: ''
        },
        activity: {
            link: '',
            tip: '扫描二维码即可参与活动'
        }
    };
    public init() {
        this.elm.src = this.src;
        this.buildQrc(this.src).then((url) => {
            this.qrc.activity.link = url;
        });

    }
    public buildQrc(qrc: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(qrc, function (err, url) {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });

    }
    public sendMessage(msg: string | Object) {
        if (typeof msg != "string") {
            msg = JSON.stringify(msg);
        }
        this.elm.contentWindow.postMessage(msg, this.elm.src);
    }
    public toggleShowController() {
        this.sendMessage({
            action: 'toggleShowController'
        });
    }
    public setQrcBlock(type: 'wechat' | 'activity') {
        let info = this.qrc[type];
        let qrcBlock = document.body.querySelector('.qrcode-area .qrcode-block');
        let img = qrcBlock.querySelector('img');
        let caption = qrcBlock.querySelector('figcaption');
        img.src = info.link;
        caption.innerText = info.tip;
        return this;
    }
    public switchQrcArea() {
        let buttons = document.body.querySelectorAll('.qrcode-area .btn-group button') as NodeListOf<HTMLButtonElement>;
        let self = this;
        loopItems(buttons, btn => {
            btn.addEventListener('click', function () {
                let cls = new StCls(this);
                if (cls.has("active")) {
                    return;
                }
                let actBtns = document.body.querySelectorAll('.qrcode-area .btn-group  button.active') as NodeListOf<HTMLButtonElement>;
                loopItems(actBtns, actBtn => {
                    let actClass = new StCls(actBtn);
                    actClass.remove("active");
                });
                cls.add("active");
                let type = btn.getAttribute("data-type") as 'wechat' | 'activity';
                self.setQrcBlock(type);
            });
        });

    }
}