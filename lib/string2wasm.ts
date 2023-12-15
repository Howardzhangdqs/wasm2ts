import chalk from "chalk";

/**
 * @file string2wasm.ts
 * @description Convert a base64 string to a WebAssembly instance.
 * @param {string} wasmString
 * @returns {WebAssembly.Instance}
 */
export default (wasmString: string, importObject: WebAssembly.Imports = {}): WebAssembly.Instance | false => {
    const wasm = Buffer.from(wasmString, 'base64');
    try {
        const wasmModule = new WebAssembly.Module(wasm);
        const wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
        return wasmInstance;
    } catch {
        console.log(chalk.yellow([
            `[Warning] WASM cannot be loaded. There might be some ffi functions need to be imported.`,
            `          TypeScript ExportType will be defined as \`${chalk.white("{ [key: string]: Function; }")}\``,
        ].join("\n")));
        return false;
    }
};