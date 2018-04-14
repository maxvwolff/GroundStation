from flask import Flask, render_template
import satData #not sure about importing
from trackingSatelite import Satellite 


app = Flask(__name__)

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/control')
def static_page():
    return render_template('index.html')

#when new list is needed from the client
@app.route('/update')
def static_page():
	#you have to take the satellite type as an input
	allSatData = getSatData(satType)
    finalList = []
    counter = 0
    latitude = "50.322959"
    longitude = "7.265666"
	#go through allSatData
	for i in allSatData:

        finalList.append([])
		line1 = i[0]
		line2 = i[1]
		line3 = i[2]

        satellite = Satellite(line1, line2, line3)


        startTime, endTime = satellite.getRiseTime(self, latitude, longitude)
        #frequency = 

        finalList[counter].append(line1)
        finalList[counter].append(line2)
        finalList[counter].append(line3)
        finalList[counter].append(startTime)
        finalList[counter].append(endTime)

        counter += 1
    return finalList

if __name__ == '__main__':
    app.run()


