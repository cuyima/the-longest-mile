import fs from "fs-extra";
import path from "path";
import { compilePack } from "@foundryvtt/foundryvtt-cli";


function getFolders(path: fs.PathLike) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}

function buildPacks() {
  const folders = getFolders("packs/");
  folders.forEach((folder) => {
    console.log(`Building pack: ${folder}`);
    compilePack(path.join("packs", folder),path.join("dist", folder));
  });
}

fs.rmSync("dist", { recursive: true, force: true });
buildPacks();