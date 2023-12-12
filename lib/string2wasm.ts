/**
 * @file string2wasm.ts
 * @description Convert a base64 string to a WebAssembly instance.
 * @param {string} wasmString
 * @returns {WebAssembly.Instance}
 */
export default (wasmString: string, importObject: WebAssembly.Imports = {}): WebAssembly.Instance => {
    const wasm = Buffer.from(wasmString, 'base64');
    const wasmModule = new WebAssembly.Module(wasm);
    const wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
    return wasmInstance;
};