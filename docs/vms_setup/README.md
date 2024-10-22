# SEG491X-T64-Capstone

## Step 1: Install VirtualBox
1. Go to https://www.virtualbox.org/wiki/Downloads 
2. Install VirtualBox 7.0.14 : Windows host

## Step 2 : Install Visual C++ Redistributable 
1. Go to https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170
2. Install https://aka.ms/vs/17/release/vc_redist.x64.exe

## Step 3 : Create a Virtual Machine (first image)
1. Click Machine & New in VirtualBox GUI.
2. Choose name & windows & create virtual hard disk now 

## Step 4 : Create a Virtual Hard Disk 
1. Enter name & file location & virtual disk format & disable floppy drive in the motherboard tab 
2. Enable seria ports 

## Step 5 : Deploy the VM 
1. Click Machine & Start & Normal Start 
2. Click Devices & Insert Guest Additions CD image 
3. Open and run VBoxWindowsAdditions-amd64.exe file
4. Click Machine & Settings and select Sharef Folders : 
    Enter the path of the folder you want shared on your host machine

## Step 6 : Snapchots and videos recording 
1. Click Machine Tools & select Snapshots to open a section with snapshot options. Click Take icon to create a new snapshot.
2. Find the snapchot just tooken under the Snapshots subfolder of the VM folder. 


1. Click Machine & Settings & Video Capture tab and enable video capture. 


