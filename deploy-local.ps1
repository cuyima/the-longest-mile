$dataPath = (Get-Content ".\foundryconfig.json" | ConvertFrom-Json).dataPath
$moduleName = (Get-Content ".\module.json" | ConvertFrom-Json).name

.\prepare-deploy.ps1

New-Item -ItemType SymbolicLink -Path "$dataPath/$moduleName" -Target ".\release\"
Start-Process powershell -ArgumentList "-Command `"New-Item -ItemType SymbolicLink -Path `"$dataPath/$moduleName`" -Target `"$($PWD.Path)`"`"" -WindowStyle Hidden -Verb RunAs
