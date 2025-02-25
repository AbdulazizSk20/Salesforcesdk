const fs = require("fs");

let package = JSON.parse(fs.readFileSync('package.json'))
fs.writeFileSync("dist/package.json", `
{
    "name": "${package.name}",
    "version": "${package.version}",
    "description": "${package.description}",
    "main": "index.js",
    "types": "index.d.js"
}
`)