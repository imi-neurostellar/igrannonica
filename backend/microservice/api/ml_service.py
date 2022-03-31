import pandas as pd
import tensorflow as tf
import keras
import numpy as np
import csv
import json
import h5py
import sklearn.metrics as sm
from statistics import mode
from typing_extensions import Self
from copyreg import constructor
from flask import request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from dataclasses import dataclass

@dataclass
class TrainingResult:
    accuracy: float
    precision: float
    recall: float
    tn: float
    fp: float
    fn: float
    tp: float
    specificity: float
    f1: float
    mse: float
    mae: float
    mape: float
    rmse: float
    fpr: float
    tpr: float

def train(dataset, params, callback):
    problem_type = params["type"]
    data = pd.DataFrame()
    for col in params["inputColumns"]:
        data[col]=dataset[col]
    output_column = params["columnToPredict"]
    data[output_column] = dataset[output_column]
    #
    # Brisanje null kolona / redova / zamena
    #nullreplace=[
    #    {"column":"Embarked","value":"C","deleteRow":false,"deleteCol":true},
    #    {"column": "Cabin","value":"C123","deleteRow":"0","deleteCol":"0"}]
        
    null_value_options = params["nullValues"]
    null_values_replacers = params["nullValuesReplacers"]
    
    if(null_value_options=='replace'):
        print("replace null") # TODO
    elif(null_value_options=='delete_rows'):
        data=data.dropna()
    elif(null_value_options=='delete_columns'):
        data=data.dropna()
    #
    #print(data.isnull().any())
    #
    # Brisanje kolona koje ne uticu na rezultat
    #
    num_rows=data.shape[0]
    for col in data.columns:
        if((data[col].nunique()==(num_rows)) and (data[col].dtype==np.object_)):
            data.pop(col)
    #
    # Enkodiranje
    #
    encoding=params["encoding"]
    if(encoding=='label'):
        encoder=LabelEncoder()
        for col in data.columns:
            if(data[col].dtype==np.object_):
                data[col]=encoder.fit_transform(data[col])
    elif(encoding=='onehot'):
        category_columns=[]
        for col in data.columns:
            if(data[col].dtype==np.object_):
                category_columns.append(col)
        data=pd.get_dummies(data, columns=category_columns, prefix=category_columns)
    #
    # Input - output
    #
    x_columns = []
    for col in data.columns:
        if(col!=output_column):
            x_columns.append(col)
    x = data[x_columns].values
    y = data[output_column].values
    #
    # Podela na test i trening skupove
    #
    test=params["randomTestSetDistribution"]
    randomOrder = params["randomOrder"]
    if(randomOrder):
        random=50
    else:
        random=0
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=test, random_state=random)
    #
    # Skaliranje vrednosti
    #
    scaler=StandardScaler()
    scaler.fit(x_train)
    x_test=scaler.transform(x_test)
    x_train=scaler.transform(x_train)
    #
    # Treniranje modela
    #
    classifier=tf.keras.Sequential()
    hidden_layer_neurons = params["hiddenLayerNeurons"]
    for func in params["hiddenLayerActivationFunctions"]:
        classifier.add(tf.keras.layers.Dense(units=hidden_layer_neurons,activation=func))
    output_func = params["outputLayerActivationFunction"]
    classifier.add(tf.keras.layers.Dense(units=1,activation=output_func))
    optimizer = params["optimizer"]
    metrics=params['metrics']
    loss_func=params["lossFunction"]
    classifier.compile(optimizer=optimizer, loss=loss_func,metrics=metrics)
    batch_size = params["batchSize"]
    epochs = params["epochs"]
    history=classifier.fit(x_train, y_train, batch_size=batch_size, epochs=epochs, callbacks=callback(x_test, y_test), validation_split=0.2) # TODO params["validationSplit"]
    #
    # Test
    #
    model_name = params['_id']
    y_pred=classifier.predict(x_test)
    if(problem_type == "regresioni"):
        classifier.evaluate(x_test, y_test)
    elif(problem_type == "binarni-klasifikacioni"):
        y_pred=(y_pred>=0.5).astype('int')
    y_pred=y_pred.flatten()
    result=pd.DataFrame({"Actual":y_test,"Predicted":y_pred})
    classifier.save("temp/"+model_name, save_format='h5')
    #
    # Metrike
    #
    print("HELLO???")
    print(result)
    print("HELLO???")
    accuracy = float(sm.accuracy_score(y_test,y_pred))
    precision = float(sm.precision_score(y_test,y_pred))
    recall = float(sm.recall_score(y_test,y_pred))
    tn, fp, fn, tp = sm.confusion_matrix(y_test,y_pred).ravel()
    specificity = float(tn / (tn+fp))
    f1 = float(sm.f1_score(y_test,y_pred))
    mse = float(sm.mean_squared_error(y_test,y_pred))
    mae = float(sm.mean_absolute_error(y_test,y_pred))
    mape = float(sm.mean_absolute_percentage_error(y_test,y_pred))
    rmse = float(np.sqrt(sm.mean_squared_error(y_test,y_pred)))
    fpr, tpr, _ = sm.roc_curve(y_test,y_pred)
    # TODO upload trenirani model nazad na backend
    return TrainingResult(accuracy, precision, recall, float(tn), float(fp), float(fn), float(tp), specificity, f1, mse, mae, mape, rmse, fpr.tolist(), tpr.tolist())



    
