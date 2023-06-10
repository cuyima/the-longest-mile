// This script has been dreadfully hacked from the original at https://github.com/CarlosFdez/pf2e-persistent-damage/blob/master/build-packs.ts and is, like the original, provided under the [ISC license](https://www.isc.org/licenses/)
//It has yet again been dreadfully hacked from https://github.com/xdy/xdy-pf2e-workbench

import fs from "fs-extra";
import path from "path";

function myRandomId() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(Array(16).keys())
        .map(() => letters[Math.floor(Math.random() * letters.length)])
        .join("");
}

fs.rmSync("temporary", { recursive: true, force: true });
const outDir = <string>fs.mkdirSync(path.resolve(".", "temporary"), { recursive: true });
if (!outDir) {
    throw new Error("Could not create output directory");
}

fs.mkdirsSync(path.resolve(outDir, "packs"));

function getFolders(path: fs.PathLike) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + "/" + file).isDirectory();
    });
}

function buildPacks() {
    const folders = getFolders(path.resolve(outDir, "packs/"));
    folders.forEach(folder => {
        console.log(folder)
    });
    for (const folderPath of folders) {
        const lines: string[] = [];
        const linesInternal: string[] = [];

        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            if (!filePath.endsWith(".js")) {
                continue;
            }

            try {
                //Do stuff
            } catch (err) {
                console.error(`Failed to read JSON file ${filePath}`, err);
            }
        }
        //const dir = path.resolve(outDir, "packs", "generated", path.basename(folderPath) + ".db");
        //fs.writeFileSync(dir, lines.join("\n"), "utf8");
        //const dir2 = path.resolve(outDir, "packs", "generated", path.basename(folderPath) + "-internal.db");
        //fs.writeFileSync(dir2, linesInternal.join("\n"), "utf8");
    }
    //fs.rmSync(path.resolve(outDir, "./packs/generated/asymonous-benefactor-macros/"), { recursive: true });
}

buildPacks();
fs.rmSync("./dist", { recursive: true, force: true });
fs.mkdirsSync(path.resolve("dist/packs/"));
fs.copySync(outDir, "./dist");
//fs.copySync("./packs/db", "./dist/packs/db");
fs.rmSync(outDir, { recursive: true, force: true });