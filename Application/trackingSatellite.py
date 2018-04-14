#tracking satellite

import sys
import math
import ephem
import time
#set An Object to observe
#line1 = "PCSAT"
#line2 = "1 26931U 01043C   18095.85171223 -.00000041 +00000-0 +16145-4 0  9998"
#line3 = "2 26931 067.0518 056.0551 0006884 282.6954 077.3377 14.30499478862137"

#satellite = ephem.readtle(line1, line2, line3)

#iss = ephem.readtle("ISS (ZARYA)",
#	"1 25544U 98067A   09270.78646569  .00012443  00000-0  87997-4 0  6860",
#	"2 39136  64.8711  14.6826 0026886 244.6642 115.1699 15.15992719273683")


#spotting once
#riseTime, riseAzimuth, maximumAltitudeTime, maximumAltitude, setTime, setAzimuth = observer.next_pass(satellite)

#for p in range(3):
#	tr, azr, tt, altt, ts, azs = observer.next_pass(iss)
#	print """Date/Time (UTC)       Alt/Azim	  Lat/Long	Elev"""
#	print """====================================================="""
#	while tr < ts:
#		observer.date = tr
#		iss.compute(observer)
#		print "%s | %4.1f %5.1f | %4.1f %+6.1f | %5.1f" % \
#			(tr, 
#			 math.degrees(iss.alt), 
#			 math.degrees(iss.az), 
#			 math.degrees(iss.sublat), 
#			 math.degrees(iss.sublong), 
#			 iss.elevation/1000.)
#		tr = ephem.Date(tr + 20.0 * ephem.second)
#	print
#	observer.date = tr + ephem.minute
#print("Satellite:", line1, "Rise Time:", riseTime, "riseAzimuth:", riseAzimuth, "maximumAltitudeTime:",
#maximumAltitudeTime, "maximumAltitude", maximumAltitude, "setTime:", setTime, "setAzimuth:", setAzimuth)

#currentTime = riseTime
#timeIntervall = 60.0 #for updating the position (in seconds)
#print """Date/Time (UTC)       Alt/Azim	  Lat/Long	Elev"""
#print """====================================================="""
#while currentTime < setTime:
#	observer.date = currentTime
#	satellite.compute(observer)
#	print "%s | %4.1f %5.1f | %4.1f %+6.1f | %5.1f" % \
#		(currentTime, 
#		math.degrees(satellite.alt), 
#		math.degrees(satellite.az), 
#		math.degrees(satellite.sublat), 
#		math.degrees(satellite.sublong), 
#		satellite.elevation/1000.)
#	currentTime = ephem.Date(currentTime + timeIntervall * ephem.second)
#	observer.date = currentTime + ephem.minute
#	print(observer.date)



class Satellite(object):
	"""docstring for satellite"""
	def __init__(self,  line1, line2, line3):
		self.line1 = line1
		self.line2 = line2
		self.line3 = line3
		self.ephemObject = ephem.readtle(self.line1, self.line2, self.line3)

	def getPosition(self, time, obsLat, obsLong):
		#observer.date = time
		observer = ephem.Observer()

		observer.lat = ephem.degrees(obsLat)
		observer.long = ephem.degrees(obsLong)
		self.ephemObject.compute(observer)

		altitude = math.degrees(self.ephemObject.alt)
		azimuth = math.degrees(self.ephemObject.az)
		latitude = math.degrees(self.ephemObject.sublat)
		longitude = math.degrees(self.ephemObject.sublong)
		elevation = self.ephemObject.elevation/1000.
		return altitude, azimuth, elevation, latitude, longitude

	def getRiseTime(self, obsLat, obsLong):
		observer = ephem.Observer()
		observer.lat = ephem.degrees(obsLat)
		observer.long = ephem.degrees(obsLong)
		
		riseTime, riseAzimuth, maximumAltitudeTime, maximumAltitude, setTime, setAzimuth = observer.next_pass(self.ephemObject)
		return riseTime




#main programm

'''

observer = ephem.Observer()

#setting our position (Betzing)
#observer.lat = "50.322987"
#observer.long = "7.265501"


#setting the position from the website
observer.lat = ephem.degrees("49.44778")
observer.long = ephem.degrees("11.06833")


line1 = "FIREBIRD 4"
line2 = "1 40378U 15003C   18096.54851022  .00001850  00000-0  79157-4 0  9999"
line3 = "2 40378  99.0952 344.1349 0133288 108.6336 252.9418 15.16925357175466b"
satellite = Satellite(line1, line2, line3)
print(satellite.getRiseTime(observer))
time = time.time()
print("ele azi alt lat lon")
print(satellite.getPosition(time, observer))

'''