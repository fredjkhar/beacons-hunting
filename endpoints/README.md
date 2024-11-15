# Installing Sysmon and Winlogbeat on client machines (Windows)

## Installation/Setup
### Step 1: Install and configure Sysmon
1. Download Sysmon from https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
2. Navigate to where Sysmon is installed and run **with administrative priviledges** `./sysmon64.exe -accepteula -i`
3. Copy the Sysmon configuration file from the repository (`sysmon-config.xml`) to where Sysmon is installed
4. Run `./sysmon64.exe -c sysmonconfig.xml` **with administrative priviledges**
5. Sysmon is now installed and configured

### Step 2: Install and run Winlogbeat
1. Download Winlogbeat from https://www.elastic.co/downloads/beats/winlogbeat and unzip it. 
2. Copy the config file (`winlogbeat.yml`) to where `winlogbeat.exe` is located
3. Run `PowerShell.exe -ExecutionPolicy UnRestricted -File .\install-service-winlogbeat.ps1` **with administrative priviledges**
4. Run `.\winlogbeat.exe setup -e` **with administrative priviledges**
5. Run `Start-Service winlogbeat` **with administrative priviledges**
6. You should start seeing sysmon events being ingested by elastic
![alt text](./images/kibana-dashboard.png)
    




