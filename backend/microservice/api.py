from copyreg import constructor
import flask
from flask import request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
import pandas as pd
import keras
import csv
import json
import mlservice
from mlservice import obuka

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods = ['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/data', methods = ['GET', 'POST'])
def data():
    if request.method == 'POST':
        f = request.json['filepath']  
        data = pd.read_csv(f)
        print(data)
        return obuka(data,request.json)
app.run()