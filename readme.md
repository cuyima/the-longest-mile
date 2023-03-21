# The Longest Mile - Content Pack
A Foundry module containing homebrew content for The Longest Mile campaign.
___
## Converting a Foundry export to a compendium entry
JSONs exported from foundry will not work as is for a compendium because they do not have a unique ID. You can bulk convert foundry exports to compendium entries by placing them into the `\input-items` directory and running the `convert-to-entry.ps1`. The script will remove all world specific data from the entries and generate a random Foundry compatible ID for convenience if not present. It will attempt to rename the entry to name its slug, however not all entries have them, in which case they will be skipped.

## Compiling the entries into a compendium
Foundry does not read "loose" JSONs, so they have to be compiled into a compendium DB file. The `pack-compendium.ps1` runs on the `\packs` folder and will combine all JSONS into their own DB packages named after the subfolder they're in. For example, all files in the `deities` folder will be compiled into a compendium called `deities.db`.

## Adding a new compendium
If you want to add or rename a compendium, you need to adjust the `module.json`. You can simply add a new "packs" entry in the JSON and change name, path and label. Note that you also need to create the appropriate subfodler in `\packs` to match the path.

Generally, most custom content counts as an item for Foundry, meaning most compendiums will be item compendiums.

## Referencing Compendium content in an entry
UUIDs consist of the following pattern: `Compendium.module-id.compendium-name.entry-id`. For an entry in the deities compendium, an example would look like this: `Compendium.the-longest-mile.deities.Bf6icD7q57eAtNr1`. To reference this entry in a different one we can use `@UUID[Compendium.the-longest-mile.deities.Bf6icD7q57eAtNr1]` like normal.
___
## Unpacking existing compendiums
If you already have compendium files that you want to unpack, you can use the `unpack-compendium.ps1`. This script will unpack all DB files located in the `\input-items` folder and add the entry JSONs to their respective compendium in the `\output-items` folder. It will attempt naming each entry after its slug, which doesn't work on entries that have none.
___
## ID Generation
If you are not exporting content from Foundry and are instead creating your entries from scratch, you need to give them a unique ID. You can use the `id-gen.ps1` to generate 10 random IDs in a foundry compatible format.
___
## Deploy
To deploy the module locally, copy and rename the `foundryconfig.json.template` to `foundryconfig.json` and enter the full path to your local Foundry install. Then execute the `deploy-local.ps1`. Changes may require a restart of Foundry to show up.

## Releasing
I added a release script to get this into Foundry more easily. As long as git and github cli are installed it is essentially a one-click release. To get a release on github execute the `release.ps1` script like this: `release.ps1 X.Y.Z`, with X.Y.Z being the version numbers.