import { getCorrectEvt } from "../func/func";

export namespace faqPop {

}

export class FaqPop {
    public elm: HTMLElement;
    constructor() {

    }
    protected popHtml(): string {
        return `
<div class="mask">
    <div class="pop">
        <div class="pop-header">
            <div class="title">常见问题</div>
            <button
                type="button"
                class="close btn"
            ></button>
        </div>
        <div class="pop-body">
            <div class="faq-list-box">
                <ul class="faq-list">
                    <li>
                        <div class="icon"></div>
                        <div class="text">
                            <div class="title">热门问题题</div>
                            <div class="content">热门题</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
        `;
    }
    protected buildPop(): HTMLElement {
        let frame = document.createElement("div");
        frame.innerHTML = this.popHtml();
        let elm = frame.children[0] as HTMLElement;

        return elm;
    }
    protected listenEvents(elm: HTMLElement) {
        let close = elm.querySelector('.close');
        close.addEventListener('click', () => {
            this.wantToClose();
        });
        this.listenAnimationEnd();
    }
    protected listenAnimationEnd() {
        let evtName = getCorrectEvt('animation', "end");
        console.log(evtName);
        this.elm.addEventListener(evtName, () => {
            this.whenAnimationEnd();
        });
    }
    protected whenAnimationEnd() {
        let closeStatus = this.elm.getAttribute("data-action");
        this.elm.removeAttribute("data-action");
        if (closeStatus === "close") {
            this.elm.parentNode.removeChild(this.elm);
        }
    }
    protected wantToClose() {
        this.elm.setAttribute("data-action", "close");
    }
    public show() {
        if (!this.elm) {
            this.elm = this.buildPop();
            this.listenEvents(this.elm);
        }
        document.body.appendChild(this.elm);
    }
}