import buffer2string from "./buffer2string";
import string2wasm from "./string2wasm";
import checkWasmEntry from "./checkWasmEntry";
import compresser from "./compress";
import wasm2string from "./wasm2string";

export type wasmOutputType = {
    wasm: {
        compressed: string;
        times: number;
    },
    entry: {
        function: string[];
        memory: string[];
        table: string[];
        global: string[];
    } | false,
};

const buffer2wasm = async (wasmBuffer: Buffer): Promise<wasmOutputType> => {
    const wasmString = buffer2string(wasmBuffer);
    const compressedWasm = await compresser.compress(wasmString);
    
    const wasmInstance = string2wasm(wasmString);
    if (wasmInstance === false) return {
        wasm: compressedWasm,
        entry: false,
    }

    const wasmEntry = checkWasmEntry(wasmInstance);
    return {
        wasm: compressedWasm,
        entry: wasmEntry,
    };
};

const main = async (wasmBuffer: Buffer) => {
    const wasm = await buffer2wasm(wasmBuffer);
    return wasm2string(wasm);
};

export default {
    buffer2string,
    buffer2wasm,
    string2wasm,
    checkWasmEntry,
    compresser,

    _: main,
};