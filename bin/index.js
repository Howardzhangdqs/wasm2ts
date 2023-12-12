#!/usr/bin/env node

const { ArgumentParser } = require("argparse");

const parser = new ArgumentParser({
    description: "Bundle Wasm to TS (wasm2ts)",
});

parser.add_argument("-v", "--version", {
    action: "version",
    version: require("../package.json").version,
});

parser.add_argument("-o", "--output", {
    help: "Output file",
});

parser.add_argument("-i", "--input", {
    help: "Input file",
    required: true,
});

const args = parser.parse_args();

(async () => {

    const fs = require("fs");
    const path = require("path");
    const betterWasm2js = require("../dist/lib/binding.js");

    if (path.extname(args.input) !== "wasm") {
        throw new Error("Input file must be a wasm file");
    };

    const absolutePath = path.resolve(args.input);

    const input = fs.readFileSync(absolutePath);
    const output = await betterWasm2js.default._(input);

    console.log(output);

    const outputPath = path.resolve(args.output || args.input.replace(/\.wasm$/, ".ts"));

    fs.writeFileSync(outputPath, output);

})();