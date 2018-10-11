import * as webpack from "webpack";
import * as path from "path";
import * as fs from "fs";
import { config } from "./webpack.baseConfig";
declare namespace StWebpack {
    export type EntryType = "ts" | "js" | "es6";
}
export class StWebpack {
    private conf:webpack.Configuration = config;    
    public separator: string = "/";
    public dir:string = __dirname;
    public addEntry(name: string, type: StWebpack.EntryType = "ts"): this {// index
        let [pageName, fileName] = name.split(this.separator);
        if (!fileName) {
            fileName = pageName;
        }
        name = [pageName, fileName].join(this.separator);
        let entry = this.conf.entry;       
        if (!this.existEntry(name, type)) {
            console.log('build');
            this.buildEntry(name, type);
        }
        let eventual = `${name}.${type}`;
        let dirname = path.dirname(eventual);
        entry[name] =  path.resolve(this.dir, `./src/entry/${eventual}`);
        return this;
    }
    public existEntry(name: string, type: StWebpack.EntryType = "ts"): boolean {
        let filePath = path.resolve(this.dir, `./src/entry/${name}.${type}`);
        return fs.existsSync(filePath);
    }
    public buildEntry(name: string, type: StWebpack.EntryType = "ts"): this {
        let filepath = path.resolve(this.dir, `./src/entry/`);
        let eventual = path.resolve(this.dir, `./src/entry/${name}.${type}`)
        name += "." + type;
        name = path.dirname(name);
        let pieces = name.split("/");
        for (let piece of pieces) {
            filepath = path.join(filepath, piece);
            console.log(filepath);
            if (!fs.existsSync(filepath)) {
                fs.mkdirSync(filepath);
            }
        }
        return this.writeFile(eventual);
    }
    public writeFile(file: string): this {
        let data = `let a = 5;`;
        fs.writeFileSync(file, data, {encoding: 'utf8'});
        return this;
    }
    public export(): webpack.Configuration {
        return this.conf;
    }
    static getInstance() {
        return new StWebpack();
    }
}

