### Python 3.13

# Beacon Simulator

The beacon simulator script (`beacon-simulator`) is used to simulate beaconing activity. This can help in testing detection models and network monitoring tools by sending periodic traffic to a specified destination.

---

## **How to Use the Beacon Simulator**

### **1. Prerequisites**
- Ensure you have Python installed on your machine.
- The script is executable on any machine capable of running Python.
- Ensure you have a VM ready to receive beacons

### **2. On the VM**
 - Desactivate firewalls (if windows it is under system and security)
 - Open PowerShell as Administrator and run the following command : 
    Run VM Listener : 
        System.Net.Sockets.TcpListener('0.0.0.0', 9999)
        $listener.Start()
 - VM is now ready to receive beacons

### **3. On the host**
 - Desactivate firewalls 
 - Go to script path 
 - run the following command : 
    Run python Script : 
        python beacon-simulator.py -ip 192.168.37.128 -p 9999 -i 150 -j 10 --tcp -m 100
    Change the variables accordingly to the VM ip, -p, -i, -j, --tcp, -m : 
        python beacon-simulator.py -ip <target_ip> -p <target_port> -i <interval> -j <jitter> --tcp -m <max_payload>


### **4. On Wireshark**

 - Under VMnet8 we can vizualise the activity between IP host and VM`s IP 

### **5. Screenshots**





# Installing Sysmon and Winlogbeat with the setup script 

## **How to Use the script**



### **README for Setup Script**
Save this file as `scripts/config/README.md`:

```markdown
# Sysmon and Winlogbeat Setup Script

The setup script (`setup.ps1`) automates the installation and configuration of **Sysmon** and **Winlogbeat**. It ensures logs are collected and forwarded according to the specified configuration files.



## **How to Use the Setup Script**

### **1. Prerequisites**
- **Administrator Privileges**: The script requires elevated permissions to install and configure services.
- **Internet Access**: Required to download Sysmon, Winlogbeat, and configuration files.


### **2. Repository Structure**
 **Ensure the repository is structured as follows:**

 scripts/
    sysmon-config.yml     # Sysmon configuration file
    winlogbeat.yml        # Winlogbeat configuration file
    config/
        setup.ps1         # PowerShell script for 
  Navigate to the file where the script is located : cd C:\path\to\scripts\config
  Execute the script : powershell.exe -ExecutionPolicy Bypass -File .\setup.ps1


    

### **3. Script Workflow**

    
The script performs the following steps:

    Creates a temporary folder for storing downloaded files.
    Downloads and extracts:
    Sysmon: From the official Sysinternals website.
    Winlogbeat: From Elastic's official site.
    Fetches sysmon-config.yml and winlogbeat.yml from the repository.
    Configures and installs:
    Sysmon: Using the downloaded configuration file.
    Winlogbeat: As a Windows service.
    Cleans up temporary files after installation.


### **4. Verifications for sysmon and winlogbeat**

    To check for sysmon : sc query sysmon64 

    To check for winlogbeat : sc query winlogbeat

