$ids = for ($i = 1; $i -le 10; $i++) {
    $id = -join ((48..57) + (97..122) + (65..90) | Get-Random -Count 16 | ForEach-Object {[char]$_})
    $id
}

Write-Host "Generated IDs:"
$ids