# Restaura backup del 22-11-2024
$backupFolder = "backup_20241122"

Write-Host "Restaurando archivos desde $backupFolder ..." -ForegroundColor Cyan

# Restaurar perfil.page.ts
Copy-Item "$backupFolder\perfil.page.ts.bak" `
  -Destination "src\app\pages\perfil\perfil.page.ts" `
  -Force
Write-Host "✔ perfil.page.ts restaurado"

# Restaurar header.component.html
Copy-Item "$backupFolder\header.component.html.bak" `
  -Destination "src\components\header\header.component.html" `
  -Force
Write-Host "✔ header.component.html restaurado"

Write-Host "Restauración completa!" -ForegroundColor Green
