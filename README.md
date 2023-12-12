# WASM to TypeScript

Compile WebAssembly .wasm files to a TypeScript module.

## CLI

```sh
wasm2ts -i example.wasm -o example.ts
```

## Installation

```sh
npm install wasm2ts -g
```

## Example

Wat Code:

```wat
;; example.wasm

(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func))
  (func (;0;) (type 0) (param i32) (result i32)
    ;; Some wat code
    end)
  (func (;1;) (type 0) (param i32) (result i32)
    ;; Some wat code
    end)
  (func (;2;) (type 1))
  (table (;0;) 0 0 funcref)
  (memory (;0;) 1)
  (export "wasm.memory" (memory 0))
  (export "fib" (func 0))
  (export "fib2" (func 1))
  (export "_start" (func 2))
  (elem (;0;) (i32.const 0) func))
```

```sh
$ wasm2ts -i fib.wasm
Output file: D:\path\to\ts\fib.ts
File size: 1062 bytes
```

Generated TypeScript Code:

```ts
// Base64 2 Uint8Array
const Base2Uint8 = (base64: string) => {
    const binstr = atob(base64);
    const len = binstr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binstr.charCodeAt(i);
    }
    return bytes;
};

type ExportType = { fib: Function; fib2: Function; _start: Function; };

export default async (importObject: WebAssembly.Imports): Promise<ExportType> => {

    let wasmstr = "AGFzbQEA...Some Base64 Code...IAAAAs=";
    
    const wasm = Base2Uint8(wasmstr);

    const wasmModule = new WebAssembly.Module(wasm);
    const wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
    const wasmExports = wasmInstance.exports as ExportType;

    return wasmExports;
};
```

`wasm2ts` will compress the wasm file using Gzip if this will make the file smaller.

## License

MIT