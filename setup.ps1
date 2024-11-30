# Variables
$GitHubRepo = "https://raw.githubusercontent.com/fredjkhar/beacons-hunting/main/config"
$SysmonExeUrl = "https://download.sysinternals.com/files/Sysmon.zip"
$WinlogbeatExeUrl = "https://artifacts.elastic.co/downloads/beats/winlogbeat/winlogbeat-8.9.1-windows-x86_64.zip"
$TempFolder = "$env:TEMP\beacons-setup"
$SysmonConfigFile = "$GitHubRepo/sysmon-config.yml"
$WinlogbeatConfigFile = "$GitHubRepo/winlogbeat.yml"

# Step 1: Create temporary folder
Write-Host "Creating temporary folder..."
New-Item -Path $TempFolder -ItemType Directory -Force | Out-Null

# Step 2: Download Sysmon
Write-Host "Downloading Sysmon..."
Invoke-WebRequest -Uri $SysmonExeUrl -OutFile "$TempFolder\Sysmon.zip"
Expand-Archive -Path "$TempFolder\Sysmon.zip" -DestinationPath "$TempFolder\Sysmon" -Force

# Step 3: Install Sysmon
Write-Host "Installing Sysmon..."
Invoke-WebRequest -Uri $SysmonConfigFile -OutFile "$TempFolder\sysmon-config.yml"
Start-Process -FilePath "$TempFolder\Sysmon\Sysmon64.exe" -ArgumentList "-accepteula -i $TempFolder\sysmon-config.yml" -Wait -NoNewWindow

# Step 4: Download Winlogbeat
Write-Host "Downloading Winlogbeat..."
Invoke-WebRequest -Uri $WinlogbeatExeUrl -OutFile "$TempFolder\Winlogbeat.zip"
Expand-Archive -Path "$TempFolder\Winlogbeat.zip" -DestinationPath "$TempFolder\Winlogbeat" -Force

# Step 5: Configure Winlogbeat
Write-Host "Configuring Winlogbeat..."
Invoke-WebRequest -Uri $WinlogbeatConfigFile -OutFile "$TempFolder\Winlogbeat\winlogbeat.yml"

# Step 6: Install and Start Winlogbeat
Write-Host "Installing Winlogbeat..."
Set-Location -Path "$TempFolder\Winlogbeat"
Start-Process -FilePath "powershell.exe" -ArgumentList ".\install-service-winlogbeat.ps1" -Wait -NoNewWindow
Start-Service -Name "winlogbeat"

# Step 7: Clean Up
Write-Host "Cleaning up temporary files..."
Remove-Item -Path $TempFolder -Recurse -Force

# Completion Message
Write-Host "Sysmon and Winlogbeat setup completed successfully!"
