import { GzipCompresser, GzipDecompresser } from './compresser';

export const compress = async (input: string) => {
    let time = 0;

    do {
        const compressed = await GzipCompresser(input);

        if (compressed.length > input.length) return {
            compressed: input,
            times: time
        };
        input = compressed;

        time++;
    } while (true);
};

export const decompress = async (input: string, time: number) => {
    for (let i = 0; i < time; i++) {
        input = await GzipDecompresser(input);
    }

    return input;
};

export default {
    compress,
    decompress
}