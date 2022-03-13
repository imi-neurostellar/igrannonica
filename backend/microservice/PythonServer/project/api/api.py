from copyreg import constructor
import flask
from flask import request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
import pandas as pd
import keras
import csv
import json


app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/data', methods = ['GET', 'POST'])
def data():
    if request.method == 'POST':
        f = request.json['filepath']
        data = []
        with open(f) as file:
            csvfile = csv.reader(file)
            for row in csvfile:
                data.append(row)
        data = pd.DataFrame(data)
        print(data)
        return render_template('data.html', data = data.to_html(header=False, index=False))
app.run()