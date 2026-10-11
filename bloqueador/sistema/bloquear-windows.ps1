# Bloquea sitios para adultos en todo el equipo editando el archivo hosts.
# Uso (PowerShell como Administrador):
#   powershell -ExecutionPolicy Bypass -File .\bloquear-windows.ps1           (activar)
#   powershell -ExecutionPolicy Bypass -File .\bloquear-windows.ps1 -Quitar   (desactivar)
param([switch]$Quitar)

$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Ejecuta PowerShell como Administrador." -ForegroundColor Red; exit 1
}

$hosts  = "$env:SystemRoot\System32\drivers\etc\hosts"
$lista  = Join-Path $PSScriptRoot "..\extension\dominios.txt"
$inicio = "# >>> BLOQUEADOR-ADULTOS >>>"
$fin    = "# <<< BLOQUEADOR-ADULTOS <<<"

Copy-Item $hosts "$hosts.respaldo" -Force

# Quita un bloque anterior, si existe.
$lineas = Get-Content $hosts
$dentro = $false
$limpio = foreach ($l in $lineas) {
    if ($l -eq $inicio) { $dentro = $true; continue }
    if ($l -eq $fin) { $dentro = $false; continue }
    if (-not $dentro) { $l }
}

if (-not $Quitar) {
    $bloque = @($inicio,
        "216.239.38.120 www.google.com",
        "216.239.38.120 www.youtube.com m.youtube.com youtubei.googleapis.com",
        "204.79.197.220 www.bing.com")
    foreach ($d in Get-Content $lista) {
        $d = $d.Trim()
        if ($d -and -not $d.StartsWith("#") -and $d.Contains(".")) { $bloque += "0.0.0.0 $d www.$d" }
    }
    $bloque += $fin
    $limpio = @($limpio) + $bloque
    Write-Host "Bloqueo activado." -ForegroundColor Green
} else {
    Write-Host "Bloqueo desactivado." -ForegroundColor Yellow
}

Set-Content -Path $hosts -Value $limpio -Encoding ASCII
ipconfig /flushdns | Out-Null
