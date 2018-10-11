import { StWebpack } from "./StWebpack";


let newConf =  StWebpack.getInstance();
newConf.addEntry('index');
export default newConf.export();
