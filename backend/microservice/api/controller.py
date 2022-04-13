import flask
from flask import request, jsonify
import ml_socket
import newmlservice
import tensorflow as tf
import pandas as pd
import json
import requests
import config

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config["SERVER_NAME"] = "127.0.0.1:5543"
  
class train_callback(tf.keras.callbacks.Callback):
    def __init__(self, x_test, y_test):
        self.x_test = x_test
        self.y_test = y_test
    #
    def on_epoch_end(self, epoch, logs=None):
        print(epoch)
        #ml_socket.send(epoch)
        #file = request.files.get("file")
        url = config.api_url + "/Model/epoch"
        requests.post(url, epoch).text
        #print('Evaluation: ', self.model.evaluate(self.x_test,self.y_test),"\n") #broj parametara zavisi od izabranih metrika loss je default

@app.route('/train', methods = ['POST'])
def train():
    print("******************************TRAIN*************************************************")
    f = request.files.get("file")
    data = pd.read_csv(f)
    #dataset, paramsModel, paramsExperiment, callback)
    result = newmlservice.train(data, request.json["model"], request.json["experiment"], request.json["dataset"], train_callback)
    print(result)
    return jsonify(result)

@app.route('/predict', methods = ['POST'])
def predict():
    f = request.json['filepath']
    dataset = pd.read_csv(f)
    m = request.json['modelpath']
    model = tf.keras.models.load_model(m)
    print("********************************model loaded*******************************")
    newmlservice.manageH5(dataset,request.json['model'],model)
    return "done"

@app.route('/preprocess',methods=['POST'])
def returnColumnsInfo():
    print("********************************PREPROCESS*******************************")
    dataset = json.loads(request.form["dataset"])
    file = request.files.get("file")
    data=pd.read_csv(file)
    
    #dataset={}
    #f = request.json['filepath']
    #data=pd.read_csv(f)

    preprocess = newmlservice.returnColumnsInfo(data)
    #samo 10 jedinstvenih posto ih ima previse, bilo bi dobro da promenimo ovo da to budu 10 najzastupljenijih vrednosti
    for col in preprocess["columnInfo"]:
        col["uniqueValues"] = col["uniqueValues"][0:10]
        col["uniqueValuesCount"] = col["uniqueValuesCount"][0:10]
    dataset["columnInfo"] = preprocess["columnInfo"]
    dataset["nullCols"] = preprocess["allNullColl"]
    dataset["nullRows"] = preprocess["allNullRows"]
    dataset["colCount"] = preprocess["colCount"]
    dataset["rowCount"] = preprocess["rowCount"]
    dataset["isPreProcess"] = True
    print(dataset)
    return jsonify(dataset)
    
print("App loaded.")
ml_socket.start()
app.run()