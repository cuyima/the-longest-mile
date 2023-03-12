function GenerateId {
    $id = -join ((48..57) + (97..122) + (65..90) | Get-Random -Count 16 | ForEach-Object { [char]$_ })
    return $id
}

function CleanJson {
    param (
        $jsonObject
    )
    $jsonObject = $jsonObject | Select-Object -ExcludeProperty _stats, flags, system.schema
    $jsonObject.system = $jsonObject.system | Select-Object -ExcludeProperty schema


    if ($null -eq $jsonObject._id) {
        $id = GenerateId
        $jsonObject | Add-Member -MemberType NoteProperty -Name "_id" -Value $id
    }

    return  $jsonObject
}


$outputFolder = "$($PWD.Path)\output-items"
if (Test-Path $outputFolder) {
    Remove-Item $outputFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $outputFolder | Out-Null

foreach ($G in (Get-ChildItem -File -Path "$($PWD.Path)\input-items")) {
    $jsonObject = Get-Content "$G" -Raw | ConvertFrom-Json
    $slug = $jsonObject.system.slug
    if ($null -eq $slug) {
        continue
    }
    $outputFilePath = "$outputFolder\$slug.json"
    $jsonObject = CleanJson -jsonObject $jsonObject
    $jsonObject | ConvertTo-Json -Depth 10 | Set-Content -Path "$outputFilePath"
}