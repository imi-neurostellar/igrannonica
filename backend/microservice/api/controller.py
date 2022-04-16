from cmath import log
from dataclasses import dataclass
from distutils.command.upload import upload
from gc import callbacks
from xmlrpc.client import DateTime
import flask
from flask import request, jsonify
import newmlservice
import tensorflow as tf
import pandas as pd
import json
import requests
import config
from datetime import datetime 

app = flask.Flask(__name__)
app.config["DEBUG"] = True
app.config["SERVER_NAME"] = config.hostIP

@dataclass
class Predictor:
    _id : str
    username: str
    inputs : list
    output : str
    isPublic: bool
    accessibleByLink: bool
    dateCreated: DateTime
    experimentId: str
    modelId: str
    h5FileId: str
    metrics: list


class train_callback(tf.keras.callbacks.Callback):
    def __init__(self, x_test, y_test,modelId):
        self.x_test = x_test
        self.y_test = y_test
        self.modelId=modelId
    #
    def on_epoch_end(self, epoch, logs=None):
        #print('Evaluation: ', self.model.evaluate(self.x_test,self.y_test),"\n")
       
        #print(epoch)
        
        #print(logs)
        
        #ml_socket.send(epoch)
        #file = request.files.get("file")
        url = config.api_url + "/Model/epoch"
        r=requests.post(url, json={"Stat":str(logs),"ModelId":str(self.modelId),"EpochNum":epoch}).text
        
        #print(r)
        #print('Evaluation: ', self.model.evaluate(self.x_test,self.y_test),"\n") #broj parametara zavisi od izabranih metrika loss je default

@app.route('/train', methods = ['POST'])
def train():
    print("******************************TRAIN*************************************************")
    
    f = request.files.get("file")
    data = pd.read_csv(f)
    paramsModel = json.loads(request.form["model"])
    paramsExperiment = json.loads(request.form["experiment"])
    paramsDataset = json.loads(request.form["dataset"])
    #dataset, paramsModel, paramsExperiment, callback)
    filepath,result = newmlservice.train(data, paramsModel, paramsExperiment,paramsDataset, train_callback)
    """
    f = request.json['filepath']
    dataset = pd.read_csv(f)
    filepath,result=newmlservice.train(dataset,request.json['model'],train_callback)
    print(result)
    """

    url = config.api_url + "/file/h5"
    files = {'file': open(filepath, 'rb')}
    r=requests.post(url, files=files,data={"uploaderId":paramsExperiment['uploaderId']})
    fileId=r.text
    predictor = Predictor(
        _id = "",
        username = paramsModel["username"],
        inputs = paramsExperiment["inputColumns"],
        output = paramsExperiment["outputColumn"],
        isPublic = False,
        accessibleByLink = False,
        dateCreated = datetime.now(),
        experimentId = paramsExperiment["_id"],
        modelId = paramsModel["_id"],
        h5FileId = fileId,
        metrics=[]
    )

    print(result)
    print(predictor)
    return jsonify(result)

@app.route('/predict', methods = ['POST'])
def predict():
    h5 = request.files.get("h5file")
    model = tf.keras.models.load_model(h5)
    paramsExperiment = json.loads(request.form["experiment"])
    paramsPredictor = json.loads(request.form["predictor"])
    print("********************************model loaded*******************************")
    result = newmlservice.predict(paramsExperiment, paramsPredictor, model)
    return result

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
app.run()