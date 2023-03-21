$outputFolder = "$($PWD.Path)\release"
$dataPath = (Get-Content ".\foundryconfig.json" | ConvertFrom-Json).dataPath
$moduleName = (Get-Content ".\module.json" | ConvertFrom-Json).name

if (Test-Path $outputFolder) {
    Remove-Item $outputFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $outputFolder | Out-Null

#Pack compendiums for good measure 
.\pack-compendium.ps1

#Copy relevant folders
foreach ($F in (Get-ChildItem -Directory -Path "$($PWD.Path)")) {
    if ($F.Name -ne "release" -and $F.Name -ne "input-items" -and $F.Name -ne "output-items") {
       Copy-Item -Path $F -Destination $outputFolder -Recurse -Force
    }
}

#clean packs
foreach ($F in (Get-ChildItem -Directory -Path "$outputFolder\packs")) {
    Remove-Item -Path $F -Recurse -Force
}

Copy-Item -Path  "$($PWD.Path)\module.json" -Destination $outputFolder

Copy-Item .\release\* -Destination "$dataPath/$moduleName" -Recurse -Force