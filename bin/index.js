#!/usr/bin/env node

const { ArgumentParser } = require("argparse");
const chalk = require("chalk");

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

    if (path.extname(args.input) !== ".wasm") {
        throw new Error("Input file must be a wasm file");
    };

    const absolutePath = path.resolve(args.input);

    const input = fs.readFileSync(absolutePath);
    const output = await betterWasm2js.default._(input);

    const outputPath = path.resolve(args.output || args.input.replace(/\.wasm$/, ".ts"));

    console.log(`Output file: ` + chalk.underline.white(`${outputPath}`));
    console.log(`File size: ` + chalk.white(`${output.length} bytes`));

    fs.writeFileSync(outputPath, output);

})();