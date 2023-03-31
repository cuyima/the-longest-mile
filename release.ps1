$VERSION = $args[0]
$errors

if ((git rev-parse --abbrev-ref HEAD) -ne "master") {
    $errors += "You must release from master.`n"
}

if (git status --porcelain) {
    $errors += "Your local repository contains changes.`n"
}

if (git status -uno | Select-String 'branch is behind' -Quiet ) {
    $errors += "Your branch is not up to date.`n"
}

if ($null -eq $VERSION ) {
    $errors += "You need to provide a release version of the pattern X.Y.Z`n"
}

if ($errors) {
    Write-Error "The following errors occurred:`n$errors"
    exit
}

$outputFolder = "$($PWD.Path)\release"

#Pack compendiums for good measure 
.\pack-compendium.ps1

#Copy relevant folders
.\prepare-deploy.ps1

#prepare manifest
$filePath = "$outputFolder\module.json"
$content = Get-Content $filePath
$newContent = $content | ForEach-Object { $_ -replace "_VERSION", "$VERSION" }
Set-Content -Path $filePath -Value $newContent

Compress-Archive -Path "$outputFolder\*" -DestinationPath "$outputFolder\module.zip"

git tag v$VERSION
git push --tags

gh release create v$VERSION .\release\module.json .\release\module.zip --generate-notes