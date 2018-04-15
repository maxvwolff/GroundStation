from flask import Flask, render_template, jsonify

from satData import getSatData#not sure about importing
from trackingSatellite import Satellite 

import datetime

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

@app.route('/')
def static_page():
    return render_template('index.html')

#when new list is needed from the client
@app.route('/getlist', methods=['POST'])
def getList():
    #you have to take the satellite type as an input
    satType = "cubesat"
    allSatData = getSatData(satType)
    finalList = []
    counter = 0
    latitude = "50.322959"
    longitude = "7.265666"
    #go through allSatData
    for i in allSatData:
        line1 = i[0]
        line2 = i[1]
        line3 = i[2]

        satellite = Satellite(line1, line2, line3)

        startTime, endTime = None, None

        try:
            startTime, endTime = satellite.getRiseAndSetTime(latitude, longitude)
            startTime, endTime = startTime.tuple(), endTime.tuple()
            riseDate = datetime.datetime(startTime[0], startTime[1], startTime[2], startTime[3], startTime[4], int(startTime[5]))
            setDate = datetime.datetime(endTime[0], endTime[1], endTime[2], endTime[3], endTime[4], int(endTime[5]))
        except:
            continue
        #if it won't be in the sky, don't add it to the list
        finalList.append([])

        finalList[counter].append(line1)
        finalList[counter].append(line2)
        finalList[counter].append(line3)
        finalList[counter].append(riseDate.timestamp())
        finalList[counter].append(setDate.timestamp())

        counter += 1

    return jsonify(success=1, output=finalList)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)


