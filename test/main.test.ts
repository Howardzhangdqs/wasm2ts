import { expect, test } from "vitest";

import fs from "fs";
import path from "path";
import wasm2ts from "../dist/lib/binding";

const dir = fs.readdirSync(path.resolve(__dirname, "bin"))
    .filter((file) => file.endsWith(".wasm"))
    .map(file => path.resolve(__dirname, "bin", file));

const wasmContent = fs.readFileSync(dir[0]);
const wasmBase64 = wasm2ts.buffer2string(wasmContent);
const fibBase64 = "AGFzbQEAAAABiYCAgAACYAF/AX9gAAADg4CAgAACAAEEhYCAgAABcAEAAAWDgICAAAEAAQehgICAAAMObW9vbmJpdC5tZW1vcnkCAANmaWIAAAZfc3RhcnQAAQmIgICAAAEGAEEAC3AACs6AgIAAAsGAgIAAAQF/AkAgAEEARgR/QQAhAUEADAEFQQALGiAAQQFGBH9BASEBQQAMAQVBAAsaIABBAWsQACAAQQJrEABqDwsgAQuCgICAAAAL";


test("WASM to Base64", async () => {
    expect(wasmBase64).toBe(fibBase64);
});


test("WASM Base64 Compression", async () => {
    expect(
        await wasm2ts.compresser.compress(wasmBase64)
    ).toEqual({
        compressed: fibBase64,
        times: 0
    });
});


test("WASM Entry", async () => {
    const wasm = await wasm2ts.buffer2wasm(wasmContent);

    if (wasm.entry !== false)
        expect(wasm.entry.function).toEqual(["fib", "_start"]);
});


test("WASM Function", async () => {
    const wasm = wasm2ts.string2wasm(wasmBase64);

    if (wasm !== false)
        expect((wasm.exports.fib as Function)(10)).toBe(55);
});


test("Gzip Compress", async () => {
    expect(
        await wasm2ts.compresser.compress("YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh")
    ).toEqual({
        "compressed": "H4sIAAAAAAAACosMd8uIpAADAFZ9rhxAAAAA",
        "times": 1,
    })

    expect(
        await wasm2ts.compresser.decompress("H4sIAAAAAAAAC0tMJA0AAFYrOKAwAAAA", 1)
    ).toEqual("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
});