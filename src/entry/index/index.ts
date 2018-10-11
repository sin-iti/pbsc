import "./index.scss";
import {TimeLine} from "../../class/TimeLine";

let timeLineElm = <HTMLElement>document.body.querySelector('.timeline-map');
let timeLiner = new TimeLine(timeLineElm);

timeLiner.setAllNodesLeft();

console.log(timeLiner);