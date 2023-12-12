// 获取Wasm模块实例的入口函数

export default (wasm: WebAssembly.Instance) => {
    const exp = Object.keys(wasm.exports);
    return {
        function: exp.filter(key => wasm.exports[key] instanceof Function),
        memory: exp.filter(key => wasm.exports[key] instanceof WebAssembly.Memory),
        table: exp.filter(key => wasm.exports[key] instanceof WebAssembly.Table),
        global: exp.filter(key => wasm.exports[key] instanceof WebAssembly.Global),
    };
};