# Winlogbeat Installation Guide

1. Download the zip file from https://www.elastic.co/downloads/beats/winlogbeat
2. Extract the folder in your Program Files
3. Rename the folder as winlogbeat
4. Replace the winlogbeat.yml file with the one provided
5. Change any instance of local host in the winlogbeat.yml config file with the IPv4 address of the host computers Default Switch


## Open power shell as administator and run the following


PS C:\Windows\system32> cd ..

PS C:\Windows> cd ..

PS C:\> cd 'program files'

PS C:\program files> cd winlogbeat

PS C:\program files\winlogbeat> PowerShell.exe -ExecutionPolicy UnRestricted -File .\install-service-winlogbeat.ps1

PS C:\program files\winlogbeat>.\winlogbeat.exe setup -e

PS C:\program files\winlogbeat> Start-Service winlogbeat


## Updating Winlogbeat IP Configuration
When restarting the computer with the docker container running ELK, the IPv4 address of the Default Switch will change

To find the IPv4 adress of the default switch
1. Run cmd on computer
2. Enter command 'ipconfig'
3. Locate Default Switch
4. Replace the ip in the winlogbeat file with the new one
5. Run the following as an administrator in Power Shell
   
PS C:\Windows\system32> cd ..

PS C:\Windows> cd ..

PS C:\> cd 'program files'

PS C:\program files> cd winlogbeat

PS C:\program files\winlogbeat>.\winlogbeat.exe setup -e

PS C:\program files\winlogbeat> Start-Service winlogbeat
