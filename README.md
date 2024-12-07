# Beacons Hunter
#### SEG491X-T64-Capstone

## Project Overview

Beacon Hunter is a system designed to detect potential beaconing activities in network traffic. Beaconing is a common behavior observed in compromised machines that periodically communicate with a Command & Control (C2) server. By applying statistical methods (MAD and Skew scores) to IP traffic patterns, Beacon Hunter helps identify suspicious communications that may indicate malicious activity.

In a typical attack scenario, a host machine (victim) is compromised through phishing or social engineering, resulting in the installation of a malicious file. This file sends periodic “beacon” signals to a C2 server, letting attackers know the system is compromised and awaiting further instructions. By detecting these regular intervals and patterns, defenders can identify potential threats early and respond accordingly.


## System Architecture

<img width="746" alt="Screenshot 2024-12-06 at 8 46 05 PM" src="https://github.com/user-attachments/assets/cb4ffd65-41dc-4532-a4fc-26387b570b9c">

#### 1.	Vue.js (Frontend):
Presents an interactive interface for viewing IP pair scores, connection counts, and associated processes. Users can click on any IP pair to view a detailed time-series graph.
#### 2.	Django (Backend):
Performs the core calculations (MAD, Skew, and final scores) and serves processed data to the frontend.
#### 3.	Nginx (HTTP Proxy):
Acts as a reverse proxy, routing requests from the internet to the appropriate containerized service.
#### 4.	ElasticSearch (Data Store):
Stores Windows logs, which are ingested from host machines. These logs form the raw data upon which beacon detection calculations are performed.
#### 5.	Kibana (Data Visualization):
Provides a powerful interface for exploring logs, indices, and other metadata stored in ElasticSearch.
#### 6.	Winlogbeat & Sysmon (Host Agents):
Deployed on target machines to collect and forward Windows event logs to ElasticSearch. These logs serve as input for the beacon detection engine.

## Key Features:

- __Statistical Analysis of Traffic:__ Uses Median Absolute Deviation (MAD) and Skew scores to quantify the regularity of communications between source and destination IP pairs.
- __Scoring System:__ Generates a final score (between 0 and 1) that indicates the likelihood of beaconing. Higher scores suggest more consistent, periodic traffic.
- __Intuitive Reporting:__ Displays aggregated data in a user-friendly table. Users can drill down into specific IP pairs to view time-series charts illustrating connection patterns.
- __Whitelisting Capability__ Allows users to whitelist known safe processes and IP addresses, reducing false positives and focusing on truly suspicious activity.

<img width="1661" alt="Screenshot 2024-12-06 at 8 47 16 PM" src="https://github.com/user-attachments/assets/bdbf7705-be41-4aa0-b7a5-bd5f2577f782">

![Uploading Screenshot 2024-12-06 at 8.49.12 PM.png…]()


## Access Points:

- __Frontend (Vue.js):__ Accessible via http://34.67.212.1/.
- __Kibana Interface:__ For more detailed data exploration, accessible via http://34.67.212.1:5601/. Navigate to discover

## Continuous Integration & Deployment:

__GitHub Actions:__ Builds and tests the project on each Pull Request. When changes are merged, new images are pushed to Docker Hub.
__Act (Local CI Testing):__ Enables local testing of GitHub Actions workflows before pushing ####changes.
__Google Cloud Engine VM:__ Pulls updated images from Docker Hub and restarts containers, ensuring the running environment remains up-to-date.


**This system was developed by a team of University of Ottawa students as a proof-of-concept tool for enhanced beacon detection in network traffic..**



