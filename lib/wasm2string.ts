import path from "path";
import { wasmOutputType } from "./binding";
import fs from "fs";

const template = fs.readFileSync(path.resolve(__dirname, "../../template/template.ts")).toString();

const buildRexExp = (name: string): RegExp => new RegExp(
    String.raw`\/\*\*\ ?${name}\ ?\*\*\/.*?\/\*\*\ ?${name}\ ?\*\*\/`,
    "gms"
);

export default (wasm: wasmOutputType): string => {

    let str = template
        .replace(buildRexExp("WASM_STRING"), wasm.wasm.compressed)
        .replace(buildRexExp("COMPRESS_TIMES"), wasm.wasm.times.toString())
        .replace(
            buildRexExp("WASM_EXPORT_TYPE"),
            wasm.entry.function.map(f => `${f}: Function;`).join(" ")
        );

    // console.log(str.replace(buildRexExp("WASM_COMPRESS"), ""))

    if (wasm.wasm.times === 0) str = str.replace(buildRexExp("WASM_COMPRESS"), "");
    else str = str.replace(/\/\*\*\ ?WASM_COMPRESS\ ?\*\*\//g, "");

    return str;
};