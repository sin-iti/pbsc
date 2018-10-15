import { StWebpack } from "./StWebpack";


let newConf =  StWebpack.getInstance();
newConf
    .addEntry('index')
    .addEntry('service')
    .addEntry('contact')
    .addEntry('about')
    .addEntry('event');
export default newConf.export();
