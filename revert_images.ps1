$files = Get-ChildItem -Filter "*.html" | Select-Object -ExpandProperty Name

foreach ($file in $files) {
    # Get old content and extract image src attributes
    $oldContent = git show 0c368ad:$file
    $oldMatches = [regex]::Matches($oldContent, '<img[^>]+src="([^"]+)"')
    
    # Get current content
    $currentContent = Get-Content $file -Raw
    
    # Replace image src attributes sequentially
    $i = 0
    $newContent = [regex]::Replace($currentContent, '(<img[^>]+src=")([^"]+)(")', {
        param($match)
        if ($i -lt $oldMatches.Count) {
            $replacement = $match.Groups[1].Value + $oldMatches[$i].Groups[1].Value + $match.Groups[3].Value
            $script:i++
            return $replacement
        }
        return $match.Value
    })
    
    Set-Content -Path $file -Value $newContent -NoNewline
    Write-Host "Processed ${file}: replaced $i images"
}
