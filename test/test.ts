import fs from "fs";
import path from "path";
import wasm2js from "../lib/binding";

const dir = fs.readdirSync(__dirname)
    .filter((file) => file.endsWith(".wasm"))
    .map(file => path.join(__dirname, file));

console.log(dir);

const wasm = wasm2js.string2wasm(wasm2js.buffer2string(fs.readFileSync(dir[0])));
const entry = wasm2js.checkWasmEntry(wasm);

console.log(wasm, entry);