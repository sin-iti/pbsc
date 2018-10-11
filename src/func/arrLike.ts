type ArrayLike<T> = {
    length: number;
    [index: number]: T;
}

type LoopCallback<T> = (item: T, index: number) => void | false;

export function loopItem<T>(arrLike: ArrayLike<T>, func: LoopCallback<T>) {
    let len = arrLike.length;
    for (let index = 0; index < len; index ++) {
        let item = arrLike[index];
        let goOn = func(item, index);
        if (goOn === false) {
            break;
        }
    }
}