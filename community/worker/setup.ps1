# MB Capital Community — Einrichtung in einem Rutsch (Windows / PowerShell)
# Voraussetzung: einmal `wrangler login` bestaetigt.
# Aufruf:  cd community\worker ;  powershell -ExecutionPolicy Bypass -File .\setup.ps1

$ErrorActionPreference = "Stop"
$env:NO_COLOR = 1
Set-Location $PSScriptRoot
$WR = "node_modules\wrangler\bin\wrangler.js"

function Wr { param([Parameter(ValueFromRemainingArguments = $true)]$a) & node $WR @a 2>&1 | Out-String }

Write-Host "`n[1/6] Anmeldung pruefen ..." -ForegroundColor Yellow
$who = Wr whoami
if ($who -match "not authenticated") { Write-Host $who; throw "Nicht angemeldet. Erst 'node $WR login' ausfuehren und im Browser bestaetigen." }
Write-Host $who

Write-Host "[2/6] D1-Datenbank ..." -ForegroundColor Yellow
$cfg = Get-Content wrangler.toml -Raw
if ($cfg -match 'database_id\s*=\s*"([0-9a-f-]{36})"') {
  $dbid = $Matches[1]
  Write-Host "  vorhanden: $dbid"
} else {
  $out = Wr d1 create mbc-community
  Write-Host $out
  if ($out -notmatch '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})') {
    throw "database_id nicht gefunden — Ausgabe oben pruefen."
  }
  $dbid = $Matches[1]
  $cfg = $cfg -replace 'database_id\s*=\s*"[^"]*"', ('database_id = "' + $dbid + '"')
  Set-Content wrangler.toml $cfg -NoNewline -Encoding UTF8
  Write-Host "  angelegt: $dbid"
}

Write-Host "[3/6] Tabellen anlegen ..." -ForegroundColor Yellow
Write-Host (Wr d1 execute mbc-community --remote --file=./schema.sql --yes)

Write-Host "[4/6] Secrets setzen ..." -ForegroundColor Yellow
function New-Secret { param([int]$n = 48)
  $b = New-Object byte[] $n
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
  [Convert]::ToBase64String($b) -replace '[+/=]', '' | ForEach-Object { $_.Substring(0, [Math]::Min($n, $_.Length)) }
}
$auth  = New-Secret 48
$admin = New-Secret 32

$auth  | & node $WR secret put AUTH_SECRET  | Out-Null
$admin | & node $WR secret put ADMIN_TOKEN  | Out-Null

$store = Join-Path $HOME "mb-community-secrets.txt"
@"
MB Capital Community — Zugangsdaten (NICHT ins Repo, nicht weitergeben)
Erstellt: $(Get-Date -Format 'dd.MM.yyyy HH:mm')

ADMIN_TOKEN  = $admin        <- Login fuer /community/admin
AUTH_SECRET  = $auth         <- niemals aendern, solange Nutzer angemeldet sind

Noch offen (spaeter nachtragen):
  node $WR secret put TURNSTILE_SECRET
  node $WR secret put BREVO_API_KEY
"@ | Set-Content $store -Encoding UTF8
Write-Host "  gespeichert in: $store"

Write-Host "[5/6] Deployen ..." -ForegroundColor Yellow
$dep = Wr deploy
Write-Host $dep

Write-Host "[6/6] Fertig." -ForegroundColor Green
if ($dep -match '(https://[a-z0-9.-]*workers\.dev)') {
  Write-Host ("`n  Vorschau:   " + $Matches[1] + "/community/") -ForegroundColor Cyan
  Write-Host ("  Moderation: " + $Matches[1] + "/community/admin") -ForegroundColor Cyan
}
Write-Host "`n  ADMIN_TOKEN steht in $store" -ForegroundColor Cyan
Write-Host "  Turnstile und Brevo fehlen noch — siehe DEPLOY.md, Schritte 2 und 4.`n"
