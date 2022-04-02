from cmath import nan
from enum import unique
from itertools import count
import pandas as pd
from sklearn import datasets
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
from sklearn.preprocessing import OrdinalEncoder
import category_encoders as ce
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from dataclasses import dataclass
import statistics as s

def returnColumnsInfo(dataset):
    dict=[]
    datafront=dataset.copy()
    svekolone=datafront.columns
    kategorijskekolone=datafront.select_dtypes(include=['object']).columns
    allNullCols=0
    for kolona in svekolone:
        if(kolona in kategorijskekolone):
            uniquevalues=datafront[kolona].unique()
            mean=0
            median=0
            nullCount=datafront[kolona].isnull().sum()
            if(nullCount>0):
                allNullCols=allNullCols+1
            frontreturn={'columnName':kolona,
                        'isNumber':False,
                        'uniqueValues':uniquevalues.tolist(),
                        'median':float(mean),
                        'mean':float(median),
                        'numNulls':float(nullCount)
            }
            dict.append(frontreturn)
        else:
            mean=datafront[kolona].mean()
            median=s.median(datafront[kolona])
            nullCount=datafront[kolona].isnull().sum()
            if(nullCount>0):
                allNullCols=allNullCols+1
            frontreturn={'columnName':kolona,
                        'isNumber':1,
                        'uniqueValues':[],
                        'mean':float(mean),
                        'median':float(median),
                        'numNulls':float(nullCount)
            }
            dict.append(frontreturn)
        NullRows = datafront[datafront.isnull().any(axis=1)]
        #print(NullRows)
        #print(len(NullRows))
        allNullRows=len(NullRows)

    return {'columnInfo':dict,'allNullColl':allNullCols,'allNullRows':allNullRows}

@dataclass
class TrainingResultClassification:
    accuracy: float
    precision: float
    recall: float
    tn: float
    fp: float
    fn: float
    tp: float
    specificity: float
    f1: float
    logloss: float
    fpr: float
    tpr: float
    metrics: dict
'''
@datasets
class TrainingResultRegression:
    mse: float
    mae: float
    mape: float
    rmse: float

@dataclass
class TrainingResult:
    metrics: dict
'''
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
    # https://www.analyticsvidhya.com/blog/2020/08/types-of-categorical-data-encoding/
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
    elif(encoding=='ordinal'):
        encoder = OrdinalEncoder()
        for col in data.columns:
            if(data[col].dtype==np.object_):
                data[col]=encoder.fit_transform(data[col])
 
    elif(encoding=='hashing'):
        category_columns=[]
        for col in data.columns:
            if(data[col].dtype==np.object_):
                category_columns.append(col)
        encoder=ce.HashingEncoder(cols=category_columns, n_components=len(category_columns))
        encoder.fit_transform(data)
    elif(encoding=='binary'):
        category_columns=[]
        for col in data.columns:
            if(data[col].dtype==np.object_):
                category_columns.append(col)
        encoder=ce.BinaryEncoder(cols=category_columns, return_df=True)
        encoder.fit_transform(data)
       
    elif(encoding=='baseN'):
        category_columns=[]
        for col in data.columns:
            if(data[col].dtype==np.object_):
                category_columns.append(col)
        encoder=ce.BaseNEncoder(cols=category_columns, return_df=True, base=5)
        encoder.fit_transform(data)
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
        random=123
    else:
        random=0
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=test, shuffle=params["shuffle"], random_state=random)
    #
    # Skaliranje vrednosti
    #
    '''
    scaler=StandardScaler()
    scaler.fit(x_train)
    x_test=scaler.transform(x_test)
    x_train=scaler.transform(x_train)
    '''
    
    #
    # Treniranje modela
    #
    #  
    hidden_layer_neurons = params["hiddenLayerNeurons"]

    if(problem_type=='multi-klasifikacioni'):
        func=params['hiddenLayerActivationFunctions']
        funcFirst=func.pop(0)
        inputDim = len(data.columns) - 1
        classifier=tf.keras.Sequential(units=hidden_layer_neurons,input_dim=inputDim,activation=funcFirst)
        for f in func:
            classifier.add(tf.keras.layers.Dense(units=hidden_layer_neurons,activation=func))
        output_func = params["outputLayerActivationFunction"]
        numberofclasses=len(output_column.unique())
        classifier.add(tf.keras.layers.Dense(units=numberofclasses,activation=output_func))

        optimizer = params["optimizer"]
        metrics=params['metrics']
        loss_func=params["lossFunction"]
        classifier.compile(optimizer=optimizer, loss=loss_func,metrics=metrics)
        batch_size = params["batchSize"]
        epochs = params["epochs"]
        history=classifier.fit(x_train, y_train, batch_size=batch_size, epochs=epochs, callbacks=callback(x_test, y_test))
    else:    
        classifier=tf.keras.Sequential()
        
        for func in params["hiddenLayerActivationFunctions"]:
            classifier.add(tf.keras.layers.Dense(units=hidden_layer_neurons,activation=func))
        output_func = params["outputLayerActivationFunction"]
        if(problem_type!="regresioni"):
            classifier.add(tf.keras.layers.Dense(units=1,activation=output_func))
        else:
            classifier.add(tf.keras.layers.Dense(units=1))
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
    #y_pred=classifier.predict(x_test)
    if(problem_type == "regresioni"):
        y_pred=classifier.predict(x_test)
        print(classifier.evaluate(x_test, y_test))
    elif(problem_type == "binarni-klasifikacioni"):    
        y_pred=classifier.predict(x_test)
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
    if(problem_type=="binarni-klasifikacioni"):
        accuracy = float(sm.accuracy_score(y_test,y_pred))
        precision = float(sm.precision_score(y_test,y_pred))
        recall = float(sm.recall_score(y_test,y_pred))
        tn, fp, fn, tp = sm.confusion_matrix(y_test,y_pred).ravel()
        specificity = float(tn / (tn+fp))
        f1 = float(sm.f1_score(y_test,y_pred))
        fpr, tpr, _ = sm.roc_curve(y_test,y_pred)
        logloss = float(sm.log_loss(y_test, y_pred))
        metrics= {"accuracy" : accuracy,
            "precision" : precision,
            "recall" : recall,
            "specificity" : specificity,
            "f1" : f1,
            "tn" : float(tn),
            "fp" : float(fp),
            "fn" : float(fn),
            "tp" : float(tp),
            "fpr" : fpr.tolist(),
            "tpr" : tpr.tolist(),
            "logloss" : logloss
            }
    elif(problem_type=="regresioni"):
        # https://www.analyticsvidhya.com/blog/2021/05/know-the-best-evaluation-metrics-for-your-regression-model/
        mse = float(sm.mean_squared_error(y_test,y_pred))
        mae = float(sm.mean_absolute_error(y_test,y_pred))
        mape = float(sm.mean_absolute_percentage_error(y_test,y_pred))
        rmse = float(np.sqrt(sm.mean_squared_error(y_test,y_pred)))
        rmsle = float(np.sqrt(sm.mean_squared_error(y_test, y_pred)))
        r2 = float(sm.r2_score(y_test, y_pred))
        # n - num of observations
        # k - num of independent variables
        n = 40
        k = 2
        adj_r2 = float(1 - ((1-r2)*(n-1)/(n-k-1)))
        metrics= {"mse" : mse,
            "mae" : mae,
            "mape" : mape,
            "rmse" : rmse,
            "rmsle" : rmsle,
            "r2" : r2,
            "adj_r2" : adj_r2
            }
    # TODO upload trenirani model nazad na backend
#return TrainingResult(metrics)