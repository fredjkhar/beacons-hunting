# PowerShell Script to Extract and Save Sysmon Network Events
# This script is designed to extract Sysmon network connection events (Event ID 3) related to a specified list of important processes. 
# It aims to assist in detecting potential beaconing activities by malicious software by focusing on network connections initiated by processes such as svchost.exe, lsass.exe, explorer.exe, among others. 
# The script queries the Sysmon operational log for events within the last few minutes, filters these events based on the defined process names, and then constructs an XML document containing the filtered events. 
# Finally, the script saves the constructed XML document to a specified file path, providing a focused dataset for further analysis or investigation into network activities related to the specified processes. 
# Adjust the list of processes and the time range as needed to tailor the script to specific monitoring requirements.

# NOTE THAT THIS SCRIPT IS FOR TESTING PURPOSES

# Define the log name and the time range for the events
$logName = "Microsoft-Windows-Sysmon/Operational"
$startTime = (Get-Date).AddHours(-0.1) # Modify this as needed

$events = Get-WinEvent -FilterHashtable @{LogName=$logName; Id=3; StartTime=$startTime}

$xmlOutput = "<Events>n"

# Process each event
foreach ($event in $events) {
    $eventXml = [xml]$event.ToXml()
    $systemXml = $eventXml.Event.System.OuterXml
    $eventDataXml = $eventXml.Event.EventData.OuterXml

    # Reconstruct the event with desired structure
    $xmlOutput += "<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'>"
    $xmlOutput += $systemXml
    $xmlOutput += $eventDataXml
    $xmlOutput += "</Event>n"
}

$xmlOutput += "</Events>"

# Define the relative path for the output file
$outputFilePath = Join-Path -Path $PSScriptRoot -ChildPath "NetworkEventsPastHour.xml"

# Save to XML to a file
$xmlOutput | Out-File -FilePath "Path\to\NetworkEventsPastHour.xml" -Encoding UTF8
Write-Host "XML file has been saved."
