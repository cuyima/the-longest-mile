// This script has been dreadfully hacked from the original at https://github.com/CarlosFdez/pf2e-persistent-damage/blob/master/build-packs.ts and is, like the original, provided under the [ISC license](https://www.isc.org/licenses/)
//It has yet again been dreadfully hacked from https://github.com/xdy/xdy-pf2e-workbench spiced up with with some cursed VTT CLI magic https://github.com/foundryvtt/foundryvtt-cli

import fs from "fs-extra";
import path from "path";
import { ClassicLevel } from "classic-level";
import chalk from "chalk";

function getFolders(path: fs.PathLike) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + "/" + file).isDirectory();
  });
}
function buildPacks() {
  const folders = getFolders("packs/");
  folders.forEach((folder) => {
    handlePack(folder);
  });
}

async function handlePack(compendiumName: string) {
  let packDir = `dist/packs/${compendiumName}`;
  const inputDir = `packs/${compendiumName}`;

  // Create packDir if it doesn't exist already
  if (!fs.existsSync(packDir)) {
    fs.mkdirSync(packDir, { recursive: true });
  }

  console.log(
    `[Packing ${chalk.blue(compendiumName)} from "${chalk.blue(
      inputDir
    )}" into "${chalk.blue(packDir)}"`
  );

  try {
    await packClassicLevel(packDir, inputDir);
  } catch (err) {
    console.error(err);
  }
}

async function packClassicLevel(packDir, inputDir) {
  // Load the directory as a ClassicLevel db
  const db = new ClassicLevel(packDir, {
    keyEncoding: "utf8",
    valueEncoding: "json",
  });
  const batch = db.batch();

  const files = fs.readdirSync(inputDir);
  const seenKeys = new Set();
  for (const file of files) {
    const fileContents = fs.readFileSync(path.join(inputDir, file), "utf-8");
    const value = JSON.parse(fileContents);
    const key = value._id;
    delete value._id;
    seenKeys.add(key);
    batch.put(key, value);
    console.log(
      `Packed ${chalk.blue(key)}${chalk.blue(
        value.name ? ` (${value.name})` : ""
      )}`
    );
  }

  for (const key of await db.keys().all()) {
    if (!seenKeys.has(key)) {
      batch.del(key);
      console.log(`Removed ${chalk.blue(key)}`);
    }
  }
  await batch.write();
  await db.close();
}

fs.rmSync("dist", { recursive: true, force: true });
buildPacks();
