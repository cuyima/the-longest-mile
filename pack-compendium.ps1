Get-ChildItem -Path "$($PWD.Path)\packs" -File | Remove-Item -Force
foreach ($G in (Get-ChildItem -Directory -Path "$($PWD.Path)\packs")) {
    foreach ($F in (Get-ChildItem -File -Path "$($G.FullName)\*")) {
        $content = (Get-Content $F.FullName -Raw) -Replace '\r?\n' -Replace '\t'
        Add-Content "$($G.FullName).db" $content -Force
    }
}