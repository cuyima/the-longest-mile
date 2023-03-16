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
    if ($F.Name -ne "release") {
       # Compress-Archive $F -Update -DestinationPath "$outputFolder\module.zip"
       Copy-Item -Path $F -Destination $outputFolder -Recurse -Force
    }
}

#clean packs
foreach ($F in (Get-ChildItem -Directory -Path "$($PWD.Path)\release\packs")) {
    if ($F.Name -ne "release") {
        Remove-Item $F -Recurse -Force
    }
}

Copy-Item -Path  "$($PWD.Path)\module.json" -Destination $outputFolder

#prepare manifest
$filePath = "$outputFolder\module.json"
$content = Get-Content $filePath
$newContent = $content | ForEach-Object { $_ -replace "_VERSION", "$VERSION" }
Set-Content -Path $filePath -Value $newContent

Compress-Archive -Path "$outputFolder\*" -DestinationPath "$outputFolder\module.zip"