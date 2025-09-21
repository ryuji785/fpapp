# Loads DB_URL, DB_USER, DB_PASSWORD from .env and executes the given command
Get-Content .env | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        Set-Item -Path env:$($matches[1]) -Value $matches[2]
    }
}
if ($args.Length -gt 0) {
    & $args
}
