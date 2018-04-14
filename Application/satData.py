from urllib.request import urlopen
#import urllib2

def getSatData(satType):
	'''
	satType: can be 'cubesat', 'amateur' or 'weather'
	returns a list of TLE-data-triples
	'''
	url = "http://www.celestrak.com/NORAD/elements/" + str(satType) + ".txt"

	TLEdata = []
	with urlopen(url) as data: # it's a file like object
		currentSat = []
		for line in data:
			line = line.decode()
			if line != None:
				line = line.join(line.splitlines())
				currentSat.append(line)
				if line[0] == '2' or len(line) == 3:
					TLEdata.append(currentSat)
					currentSat = []
	return TLEdata

#print(getSatData("amateur"))