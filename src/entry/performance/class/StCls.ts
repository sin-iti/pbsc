export namespace StCls {

}

export class StCls {
    readonly elm: HTMLElement;
    constructor(elm: HTMLElement) {
        let key = "__st_cls__";
        if (elm[key]) {
            return elm[key];
        }
        this.elm = elm;
        this.elm[key] = this;
    }
    public string(): string {
        return this.elm.getAttribute("class");
    }
    public array(): string[] {
        let cls = this.string();
        let arr: string[] = cls.split(" ");
        return arr.filter(clsName => {
            return !!clsName;
        });
    }
    public has(checkName: string): boolean {
        let clsArr = this.array();
        if (clsArr.indexOf(checkName) >= 0) {
            return true;
        }
        return false;
    }
    public reset(classes: string): this {
        this.elm.setAttribute("class", classes);
        return this;
    }
    public add(name: string): this {
        let arr = this.array();
        if (arr.indexOf(name) < 0) {
            arr.push(name);
            this.reset(arr.join(" "));
        }
        return this;
    }
    public remove(name: string): this {
        let arr = this.array();
        if (arr.indexOf(name) >= 0) {
            arr = arr.filter(cls => {
                if (cls == name) {
                    return false;
                }
                return true;
            });
            this.reset(arr.join(" "));
        }
        return this;
    }
}