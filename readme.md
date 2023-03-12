# The Longest Mile - Content Pack
A Foundry module containing homebrew content for The Longest Mile campaign.
___
## Converting a foundry export to a compendium entry
JSONs exported from foundry will not work as is for a compendium because they do not have a unique ID. You can bulk convert foundry exports to compendium entries by placing them into the `\input-items` directory and running the `cleanup.ps1`. The script will remove all world specific data from the entries and generate a random Foundry compatible ID for convenience if not present.

## Compiling the entries into a compendium
Foundry does not read "loose" JSONs, so they have to be compiled into a compendium DB file. The `compile.ps1` runs on the `\packs` folder and will combine all JSONS into their own DB packages named after the subfolder they're in. For example, all files in the `deities` folder will be compiled into a compendium called `deities.db`.

## Adding a new compendium
If you want to add or rename a compendium, you need to adjust the `module.json`. You can simply add a new "packs" entry in the JSON and change name, path and label. Note that you also need to greate the appropriate subfodler in `\packs` to match the path.

Generally, most custom content counts as an item for Foundry, meaning most compendiums will be item compendiums.

## Referencing Compendium content in an entry
UUIDs consist of the following pattern: `Compendium.module-id.compendium-name.entry-id`. For an entry in the deities compendium, an example would look like this: `Compendium.the-longest-mile.deities.Bf6icD7q57eAtNr1`. To reference this entry in a different one we can use `@UUID[Compendium.the-longest-mile.deities.Bf6icD7q57eAtNr1]` like normal.
___
## Unpacking existing compendiums
If you already have compendium files that you want to unpack, you can use the `decompile.ps1`. This script will unpack all DB files located in the `\packs` folder and add the entry JSONs to their respective compendium in the `\decompile` folder.
___
## ID Generation
If you are not exporting content from Foundry and are instead creating your entries from scratch, you need to give them a unique ID. You can use the `id-gen.ps1` to generate 10 random IDs in a foundry compatible format.