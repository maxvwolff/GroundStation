from flask import Flask, render_template
import satData 
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
	#go through allSatData
	for i in allSatData:
		name = i[0]
		line1 = i[1]
		line2 = i[2]
    return [1,2,3]

if __name__ == '__main__':
    app.run()


