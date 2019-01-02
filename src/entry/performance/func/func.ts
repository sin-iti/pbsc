export function setBodyHeight() {
    let header = document.body.querySelector('.main header') as HTMLElement;
    let headerHeight = header.offsetHeight;
    let fullHeight = window.innerHeight;
    let bodyHeight = fullHeight - headerHeight - 1;//1px作为缓冲
    let body = document.body.querySelector('.main .body') as HTMLElement;
    body.style.height = bodyHeight + 'px';
}
let evtCache: any = {};
let properties = {
    "animation": {
        "end": {
            "-moz-": "mozAnimationEnd",
            "-webkit-": "webkitAnimationEnd",
            "-o-": "oAnimationEnd",
            "-ms-": "MSAnimationEnd",
        }
    }
}
export function getCorrectEvt(evtName: "animation", status: "end" | "start" = "end") {
    let key = evtName + status;
    if (!(key in evtCache)) {
        let style = window.getComputedStyle(document.body);
        let prefixes = ["", "-moz-", "-ms-", "-o-"];
        let correctPrefix = '';
        for (let prefix of prefixes) {
            let testCssName = prefix + prefix;
            if (testCssName in style) {
                correctPrefix = prefix;
                break;
            }
        }
        if (!correctPrefix) {
            evtCache[key] = key;
        } else {
            evtCache[key] = properties[evtName][correctPrefix];
        }
    }
    return evtCache[key];
}

