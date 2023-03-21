$VERSION = $args[0]

if ($null -eq $VERSION ) {
    throw "You need to provide a release version of the pattern X.Y.Z"
}

$outputFolder = "$($PWD.Path)\release"

if (Test-Path $outputFolder) {
    Remove-Item $outputFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $outputFolder | Out-Null

#Pack compendiums for good measure 
.\pack.ps1

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

#prepare manifest
$filePath = "$outputFolder\module.json"
$content = Get-Content $filePath
$newContent = $content | ForEach-Object { $_ -replace "_VERSION", "$VERSION" }
Set-Content -Path $filePath -Value $newContent

Compress-Archive -Path "$outputFolder\*" -DestinationPath "$outputFolder\module.zip"

git tag v$VERSION
git push --tags

gh release create v$VERSION .\release\module.json .\release\module.zip --generate-notes