# Define the log name and the time range for the events
$logName = "Microsoft-Windows-Sysmon/Operational"
$startTime = (Get-Date).AddHours(-0.1) # Modify this as needed

# Define relevant event ID for network events
$relevantEventID = 3

# Define processes important for detecting beaconing
$importantProcesses = @(
    "svchost.exe",
    "lsass.exe",
    "explorer.exe",
    "iexplore.exe",
    "chrome.exe",
    "firefox.exe",
    "net.exe",
    "curl.exe",
    "wget.exe",
    "powershell.exe"
    # Add more processes as needed
)

# Query Sysmon events
$events = Get-WinEvent -FilterHashtable @{LogName=$logName; StartTime=$startTime; ID=$relevantEventID}

# Start the XML document
$xmlOutput = "<Events>`n"

# Process each event
foreach ($event in $events) {
    $eventXml = [xml]$event.ToXml()
    $processName = $eventXml.Event.EventData.Data | Where-Object {$_.Name -eq "Image"} | Select-Object -ExpandProperty "#text"

    # Check if the process is important for detecting beaconing
    if ($importantProcesses -contains $processName) {
        $systemXml = $eventXml.Event.System.OuterXml
        $eventDataXml = $eventXml.Event.EventData.OuterXml

        # Reconstruct the event with desired structure
        $xmlOutput += "<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'>"
        $xmlOutput += $systemXml
        $xmlOutput += $eventDataXml
        $xmlOutput += "</Event>`n"
    }
}

$xmlOutput += "</Events>"

# Save to XML to a file
$xmlOutput | Out-File -FilePath "D:\Project Capstone\Scripts\NetworkEventsPastHour.xml" -Encoding UTF8
Write-Host "XML file has been saved to D:\Project Capstone\Scripts\NetworkEventsPastHour.xml"