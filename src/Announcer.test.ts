import { Announcer } from "./Announcer";

const announcer = new Announcer(90);
const _seen :{[key: number]: number} = {};

for (let index = 0; index < 90; index++) {
    const next = announcer.next();
    if(typeof next !== "number" || next <= 0) {
        throw new Error("Not number")
    }
    if(_seen[next] === 1) {
        throw new Error("Already seen");
    }
    _seen[next] = 1;
}
console.log(Object.keys(_seen).length);
console.log(_seen);