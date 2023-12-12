/**
 * Convert a wasm file to a Base64 string
 */
export default (input: Buffer | string | Uint16Array): string => {
    if (typeof input === 'string') {
        return Buffer.from(input).toString('base64');
    } else if (input instanceof Uint16Array) {
        return Buffer.from(input.buffer).toString('base64');
    } else if (input instanceof Buffer) {
        return input.toString('base64');
    } else {
        throw new Error('Invalid input');
    }
};