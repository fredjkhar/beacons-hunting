Winlogbeat Installation Guide

1. Download the zip file from https://www.elastic.co/downloads/beats/winlogbeat
2. Extract the folder in your Program Files
3. Rename the folder as winlogbeat
4. Replace the winlogbeat.yml file with the one provided


Open power shell as administator and run the following


PS C:\Windows\system32> cd ..

PS C:\Windows> cd ..

PS C:\> cd 'program files'

PS C:\program files> cd winlogbeat

PS C:\program files\winlogbeat> PowerShell.exe -ExecutionPolicy UnRestricted -File .\install-service-winlogbeat.ps1


Status   Name               DisplayName
------   ----               -----------
Stopped  winlogbeat         winlogbeat


PS C:\program files\winlogbeat>.\winlogbeat.exe setup -e

PS C:\program files\winlogbeat> Start-Service winlogbeat


In the discover page you should be able to change the log source to -winlogbeat and view the logs being sent to elasticsearch