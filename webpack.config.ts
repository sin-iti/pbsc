import { StWebpack } from "./StWebpack";


let newConf =  StWebpack.getInstance();
newConf
    // .addEntry('index')
    // .addEntry('service')
    // .addEntry('contact')
    // .addEntry('about')
    .addEntry('test')
    // .addEntry('event');

    var a = newConf.export();
    a.mode = "production";
export default a;
