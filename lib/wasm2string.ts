import path from "path";
import { wasmOutputType } from "./binding";
import fs from "fs";

const template = fs.readFileSync(path.resolve(__dirname, "../../template/template.ts")).toString();

const buildRexExp = (name: string): RegExp => new RegExp(
    String.raw`\/\*\*\ ?${name}\ ?\*\*\/.*?\/\*\*\ ?${name}\ ?\*\*\/`,
    "g"
);

export default (wasm: wasmOutputType): string => {

    return template
        .replace(buildRexExp("WASM_STRING"), wasm.wasm.compressed)
        .replace(buildRexExp("COMPRESS_TIMES"), wasm.wasm.times.toString())
        .replace(buildRexExp("WASM_EXPORT_TYPE"), wasm.entry.function.map(f => `${f}: Function;`).join(" "));
};