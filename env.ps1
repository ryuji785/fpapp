# Load environment variables from .env and run Gradle tasks in the backend module.
Get-Content .env | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        Set-Item -Path env:$($matches[1]) -Value $matches[2]
    }
}
Set-Location backend
./gradlew $args
