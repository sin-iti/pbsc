import "./performance.scss";
import { setBodyHeight } from "./func/func";
import { FaqPop } from "./class/faqPop";

document.onreadystatechange = (evt: ProgressEvent) => {
    console.log(document.readyState);
    if (document.readyState === "complete") {
        docReady();
    }
}

function docReady() {
    setBodyHeight();
    let pop = new FaqPop();
    let faqLink = document.body.querySelector('.faq-link') as HTMLElement;
    faqLink.addEventListener('click', () => {
        pop.show();
    });
    window.addEventListener('resize', () => {
        setBodyHeight();
    });
}