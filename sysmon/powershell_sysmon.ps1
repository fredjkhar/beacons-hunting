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

# Save the XML file
$xmlOutput | Out-File -FilePath $outputFilePath -Encoding UTF8

# Display a message indicating the file has been saved
Write-Host "XML file has been saved to $outputFilePath"