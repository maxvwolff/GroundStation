import serial
import time
from trackingSatellite import Satellite
import ephem
import datetime

ser = serial.Serial('/dev/ttyUSB0', 115200) # /dev/tty.usbserial

observerLat = "50.322959"
observerLong = "7.265666"

azi = 0
ele = 0
trackingActive = False
trackingStopping = False
trackingEndDate = 0
sat = 0 # TODO null object?


def setAttitude(azi, ele):
	# waits for finishing signal for serial port
	azi_ = int(azi)
	ele_ = int(ele)
	toSend = str(azi_) + "," + str(ele_) + ","
	print("Moved to: AZI: " + str(azi_) + " ELE: " + str(ele_))
	for char in toSend:
		ser.write(char.encode())
	#wait	
	while ser.readline() != b"\r\n":
		pass


def enableTracking(line1, line2, line3):
	sat = Satellite(line1, line2, line3)
	riseT, endT = sat.getRiseTime(observerLat, observerLong)
	trackingEndDate = endT
	trackingActive = True

def disableTracking():
	trackingActive = False
	trackingStopping = True


#----- MAIN ----------

time.sleep(2)

while True:
	if trackingActive:
		ele, azi, alt, lat, lon = sat.getPosition(time.time(), observerLat, observerLong)
		setAttitude(azi, ele)
		if datetime.datetime.utcnow() > trackingEndDate:
			disableTracking()
	else
		if trackingStopping:
			setAttitude(0, 0)
			trackingStopping = False
		time.sleep(2)

