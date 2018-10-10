export function deepCopy<T>(obj: T): T {
    let copiedObj = <T>{};
    for(let attr in obj) {
        let val = obj[attr];
        if (typeof val === "object") {
            copiedObj[attr] = deepCopy(val);
        } else {
            copiedObj[attr] = val;
        }
    }
    return copiedObj;
}