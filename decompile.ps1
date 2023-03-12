$outputFolder = "$($PWD.Path)\decompile"
if (Test-Path $outputFolder) {
    Remove-Item $outputFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $outputFolder | Out-Null

foreach ($G in (Get-ChildItem -File -Path "$($PWD.Path)\packs")) {
    New-Item -ItemType Directory -Path $outputFolder\$($G.BaseName) | Out-Null
    $jsonStrings = (Get-Content "$G" -Raw) -split "\r?\n"
    foreach ($jsonString in $jsonStrings) {
        $jsonObject = ConvertFrom-Json $jsonString
        $slug = $jsonObject.system.slug
        $outputFilePath = "$outputFolder\$($G.BaseName)\$slug.json"
        if($null -eq $slug) {
            continue
        }
        $jsonString | Out-File $outputFilePath
    }
}