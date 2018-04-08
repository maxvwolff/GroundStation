import serial
import time
from trackingSatellite import Satellite
import ephem
import datetime

ser = serial.Serial('/dev/ttyUSB0', 115200) # /dev/tty.usbserial

azi = 0
ele = 0

def setAttitude(azi, ele):
	azi_ = int(azi)
	ele_ = int(ele)
	toSend = str(azi_) + "," + str(ele_) + ","
	print("Moved to: AZI: " + str(azi_) + " ELE: " + str(ele_))
	for char in toSend:
		ser.write(char.encode())

time.sleep(2)

observer = ephem.Observer()

observer.lat = ephem.degrees("50.322959")
observer.long = ephem.degrees("7.265666")

while True:
	# Step 1: Wait for user input
	print("Insert the 3 TLE lines:")
	#line1 = input("line1: ")
	#line2 = input("line2: ")
	#line3 = input("line3: ")

	line1 = "TECHSAT 1B"
	line2 = "1 25397U 98043D   18096.83582934  .00000001  00000-0  19560-4 0  9992"
	line3 = "2 25397  98.6440  38.4781 0000826 166.1597 193.9604 14.23642840 25576"

	trackTime = int(input("How long do you want to track after rise? Seconds: "))

	sat = Satellite(line1, line2, line3)
	riseTime = sat.getRiseTime(observer).tuple()
	print(riseTime)

	ele, azi, alt, lat, lon = sat.getPosition(time.time(), observer)
	setAttitude(azi, ele)

	riseDate = datetime.datetime(riseTime[0], riseTime[1], riseTime[2], riseTime[3], riseTime[4], int(riseTime[5]))
	print(riseDate.time())

	while datetime.datetime.utcnow() < riseDate and ele < 0:
		print(str((riseDate - datetime.datetime.utcnow()).total_seconds()) + " more seconds until rise!")
		time.sleep(5)	

	tStart = datetime.datetime.utcnow()

	# Step 2: Point to sat
	print("Pointing...")

	ele, azi, alt, lat, lon = sat.getPosition(time.time(), observer)
	setAttitude(azi, ele)

	# Step 3: Track sat
	while True:#datetime.datetime.utcnow() < tStart + datetime.timedelta(0, trackTime) and ele > 0:
		ele, azi, alt, lat, lon = sat.getPosition(time.time(), observer)
		setAttitude(azi, ele)
		while ser.readline() != b"\r\n":
			pass

	print("Finished tracking!")


	while True:
		if not pos1:
			setAttitude(0, 100)
			pos1 = True
		else:
			setAttitude(180,0)
			pos1 = False

		while ser.readline() != b"\r\n":
			pass
		print("Done!")