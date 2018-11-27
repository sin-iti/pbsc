import * as ClipborardJS from "clipboard";

var copyText = new ClipborardJS('[data-type="copy-text"]', {
    text: function(trigger: HTMLElement) {
        console.log(trigger);
        return trigger.innerText;
    }
});

copyText.on('success', function (event) {
    let copyed = event.trigger.getAttribute("data-copyed");
    if (copyed === "yes"){
        return ;
    }
    event.trigger.setAttribute("data-copyed", "yes");
    setTimeout(function (){
        event.trigger.removeAttribute("data-copyed");
    }, 800);
});

export {copyText};