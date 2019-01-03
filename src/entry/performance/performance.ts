import "./performance.scss";
import { setBodyHeight } from "./func/func";
import { FaqPop } from "./class/faqPop";
import { StIFrame } from "./class/StIFrame";
import { StAjax } from "./class/StAjax";

document.onreadystatechange = (evt: ProgressEvent) => {
    console.log(document.readyState);
    if (document.readyState === "complete") {
        docReady();
    }
}


function docReady() {
    setBodyHeight();
    //
    let stFrame = new StIFrame();
    stFrame.init();
    stFrame.switchQrcArea();
    //ajaxer
    let ajaxer = new StAjax({
        url: 'http://dev.akaba.cn/admin/api/getQrcInfo?acid=ADAOHRbx1me2mw&safe=5b85chno3ca6bg5',
        crossDomain: true,
    });
    ajaxer.whenSuccess(function (reply: any) {
        stFrame.qrc.wechat.link = reply.qrcode;
        stFrame.qrc.wechat.tip = reply.tip;
        stFrame.setQrcBlock('wechat');
    }).send();
    //
    let pop = new FaqPop();
    // 
    let faqLink = document.body.querySelector('.faq-link') as HTMLElement;
    faqLink.addEventListener('click', () => {
        pop.show();
    });
    //
    window.addEventListener('resize', () => {
        setBodyHeight();
    });
    // 
    let switchFuncBtn = document.body.querySelector('.switch-func-btn') as HTMLElement;
    switchFuncBtn.addEventListener('click', () => {
        stFrame.toggleShowController();
    });
}

