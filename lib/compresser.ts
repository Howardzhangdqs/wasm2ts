// 
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
}


// Compresser
export const GzipCompresser = async (content: string) => {
    // base64 string to binary
    const encoder = new TextEncoder();
    const uint8array = encoder.encode(content);

    // binary to readableStream
    const contentStream = new ReadableStream({
        start(controller) {
            controller.enqueue(uint8array);
            controller.close();
        }
    });

    // readableStream to gzipStream
    const gzipStream = contentStream.pipeThrough(new CompressionStream("gzip"));

    let buffer = await streamToBuffer(gzipStream);
    return buffer.toString('base64');
};


// Decompresser
export const GzipDecompresser = async (content: string) => {
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