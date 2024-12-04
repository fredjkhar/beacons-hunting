import socket, time, random, argparse

parser = argparse.ArgumentParser(description="Example command: 'python3 .\\beacon-simulator.py -ip 192.168.128.34 -p 2000 -i 10 -j 3 -m 512' or 'python3 .\\beacon-simulator.py -ip 10.0.0.15 -p 3000 --interval 60 --jitter 5 --max_payload 2048 --tcp'")
parser.add_argument("-ip", dest="ip", type=str, help="Use -ip to specify the destination IP address you want to target.", required=True)
parser.add_argument("-p", "--port", type=int, dest="port", help="Use -p to set the target port number.", required=True)
parser.add_argument("-i", "--interval", type=int, dest="interval", help="Use -i to define the time interval between beacons in seconds.", required=True)
parser.add_argument("-j", "--jitter", type=int, dest="jitter", help="Use -j to set a jitter value, which adds randomness to the interval in seconds.", required=True)
parser.add_argument("--tcp", dest="tcp", action="store_true", help="Use -t to select the TCP protocol (default option). This is not mandatory.", required=False)
parser.add_argument("--udp", dest="udp", action="store_true", help="Use -u to select the UDP protocol. This is optional and defaults to TCP.", required=False)
parser.add_argument("-m", "--max_payload", type=int, dest="max_payload", help="Use -m to specify the maximum size of the payload in bytes.", required=True)
args = parser.parse_args()

server_ip = args.ip
server_port = args.port
max_size = args.max_payload
data = "a"
interval = args.interval
variance = args.jitter
jitter = random.randint(interval - variance, interval + variance)

def tcp_beacon():
    count = 0
    while True:
        message_size = random.randint(0,max_size)
        message = "".join([data]*message_size)
        message = bytes(message, 'utf-8')
        jitter = random.randint(interval - variance, interval + variance)
        print("amount of jitter: ",jitter)
        print("data sent: ",message)
        client_tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client_tcp.connect((server_ip, server_port))
        client_tcp.sendall(message)
        client_tcp.close()
        count = count +1
        print("Number of beacons sent: ",count)
        time.sleep(jitter)

def udp_beacon():
    count = 0
    while True:
        message_size = random.randint(0,max_size)
        message = "".join([data]*message_size)
        message = bytes(message, 'utf-8')
        jitter = random.randint(interval - variance, interval + variance)
        print("Amount of jitter: ",jitter)
        print("Data sent: ",message)
        client_udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        client_udp.sendto(message, (server_ip, server_port))
        client_udp.close()
        count = count +1
        print("Number of beacons sent: ",count)
        time.sleep(jitter)

if args.tcp:
    tcp_beacon()
elif args.udp:
    udp_beacon()
else:
    tcp_beacon()