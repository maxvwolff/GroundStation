from urllib.request import urlopen

def getSatData(satType):
	'''
	satType: can be 'cubesat', 'amateur' or 'weather'
	returns a list of TLE-data-triples
	'''
	url = "http://www.celestrak.com/NORAD/elements/" + str(satType) + ".txt"

	TLEdata = []
	data = urllib2.urlopen(url) # it's a file like object
	currentSat = []
	for line in data:
		if line != None:
			line = line.join(line.splitlines())
			currentSat.append(line)
			if line[0] == '2':
				TLEdata.append(currentSat)
				currentSat = []
	return TLEdata

#print(getSatData("amateur"))