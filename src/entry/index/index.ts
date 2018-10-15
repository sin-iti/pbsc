import "./index.scss";

import {TimeLine} from "../../class/TimeLine";
import {Slider} from "../../class/Slider";
import { Agent } from "../../class/Agent";

let timeLineElm = <HTMLElement>document.body.querySelector('.timeline-map');
let timeLiner = new TimeLine(timeLineElm);

timeLiner.setAllNodesLeft();

let slider = new Slider();
slider.itemsBox = document.body.querySelector('.show-part .groups');
slider.orderBox = document.body.querySelector('.show-part .group-orders ol');

slider.buildOrderItem().init();

$(slider.orderBox).on('click', 'li', function () {
    let itemIndex = $(this).attr("data-index");
    slider.slideToOrder(parseInt(itemIndex));
});



if (!Agent.hasStyleOf('webkitTextFillColor')) {
    $('.main-section section h3.section-title .eng-title').each((index, elm) => {
        console.log(elm);
        $(elm).css({
            backgroundImage: "none"
        });
    });
}