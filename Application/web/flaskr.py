from flask import Flask, render_template

app = Flask(__name__)

@app.route('/control')
def static_page(page_name):
    return render_template('index.html')

if __name__ == '__main__':
    app.run()