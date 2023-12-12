/** WASM_COMPRESS **/
function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const reader = stream.getReader();
        let chunks = [];
        reader.read().then(function process({ done, value }) {
            if (done) {
                resolve(Buffer.concat(chunks));
                return;
            }
            chunks.push(value);
            return reader.read().then(process);
        }).catch(reject);
    });
};

// Decompresser
async function GzipDecompresser(content: string) {
    // base64 string to binary
    const buffer = Buffer.from(content, 'base64');

    // binary to readableStream
    const contentStream = new ReadableStream({
        start(controller) {
            controller.enqueue(buffer);
            controller.close();
        }
    });

    // readableStream to gunzipStream
    const gunzipStream = contentStream.pipeThrough(new DecompressionStream("gzip"));

    let uint8array = await streamToBuffer(gunzipStream);

    // binary to base64 string
    const decoder = new TextDecoder();
    return decoder.decode(uint8array);
};

/** WASM_COMPRESS **/// Base64 2 Uint8Array
const Base2Uint8 = (base64: string) => {
    const binstr = atob(base64);
    const len = binstr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binstr.charCodeAt(i);
    }
    return bytes;
};

type ExportType = { /** WASM_EXPORT_TYPE **/ /** WASM_EXPORT_TYPE **/ };

export default async (importObject: WebAssembly.Imports): Promise<ExportType> => {

    let wasmstr = "/** WASM_STRING **/ /** WASM_STRING **/";
    /** WASM_COMPRESS **/
    const COMPRESS_TIMES = /** COMPRESS_TIMES **/ 0 /** COMPRESS_TIMES **/;
    for (let i = COMPRESS_TIMES; i; i--) wasmstr = await GzipDecompresser(wasmstr);
    /** WASM_COMPRESS **/
    const wasm = Base2Uint8(wasmstr);

    const wasmModule = new WebAssembly.Module(wasm);
    const wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
    const wasmExports = wasmInstance.exports as ExportType;

    return wasmExports;
};
