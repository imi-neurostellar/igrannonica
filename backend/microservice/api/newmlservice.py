from enum import unique
from itertools import count
import os
import pandas as pd
from sklearn import datasets, multiclass
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
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.preprocessing import OrdinalEncoder
import category_encoders as ce
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from dataclasses import dataclass
import statistics as s
from sklearn.metrics import roc_auc_score
import matplotlib.pyplot as plt
#from ann_visualizer.visualize import ann_viz;
def returnColumnsInfo(dataset):
    dict=[]
    datafront=dataset.copy()
    svekolone=datafront.columns
    kategorijskekolone=datafront.select_dtypes(include=['object']).columns
    allNullCols=0
    rowCount=datafront.shape[0]#ukupan broj redova
    colCount=len(datafront.columns)#ukupan broj kolona

    for kolona in svekolone:
        if(kolona in kategorijskekolone):
            unique=datafront[kolona].value_counts()
            uniquevalues=[]
            uniquevaluescount=[]
            for val, count in unique.iteritems():
                uniquevalues.append(val)
                uniquevaluescount.append(count)
            #print(uniquevalues)
            #print(uniquevaluescount)
            mean=0
            median=0
            minimum=0
            maximum=0
            nullCount=datafront[kolona].isnull().sum()
            if(nullCount>0):
                allNullCols=allNullCols+1
            frontreturn={'columnName':kolona,
                        'isNumber':False,
                        'uniqueValues':uniquevalues,
                        'uniqueValuesCount':uniquevaluescount,
                        'median':float(mean),
                        'mean':float(median),
                        'numNulls':int(nullCount),
                        'min':float(minimum),
                        'max':float(maximum),
            }
            dict.append(frontreturn)
        else:
            minimum=min(datafront[kolona])
            maximum=max(datafront[kolona])
            mean=datafront[kolona].mean()
            median=s.median(datafront[kolona].copy().dropna())
            nullCount=datafront[kolona].isnull().sum()
            if(nullCount>0):
                allNullCols=allNullCols+1
            frontreturn={'columnName':kolona,
                        'isNumber':1,
                        'uniqueValues':[],
                        'uniqueValuesCount':[],
                        'mean':float(mean),
                        'median':float(median),
                        'numNulls':int(nullCount),
                        'min':float(minimum),
                        'max':float(maximum),
            }
            dict.append(frontreturn)
        NullRows = datafront[datafront.isnull().any(axis=1)]
        #print(NullRows)
        #print(len(NullRows))
        allNullRows=len(NullRows)
    return {'columnInfo':dict,'allNullColl':int(allNullCols),'allNullRows':int(allNullRows),'rowCount':int(rowCount),'colCount':int(colCount)}

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

def train(dataset, paramsModel,paramsExperiment,paramsDataset,callback):
    problem_type = paramsModel["type"]
    #print(problem_type)
    data = pd.DataFrame()
    #print(data)
    for col in paramsExperiment["inputColumns"]:
        #print(col)
        data[col]=dataset[col]
    output_column = paramsExperiment["outputColumn"]
    data[output_column] = dataset[output_column]
    #print(data)

    ###NULL
    null_value_options = paramsExperiment["nullValues"]
    null_values_replacers = paramsExperiment["nullValuesReplacers"]

    if(null_value_options=='replace'):
        #print("replace null") #
        dict=null_values_replacers
        while(len(dict)>0):
            replace=dict.pop()
            col=replace['column']
            opt=replace['option']
            if(opt=='replace'):
                val = replace['value']
                if(data[col].dtype == 'int64'):
                    val = np.int64(val)
                elif(data[col].dtype == 'float64'):
                    val = np.float64(val)
                #elif(data[col].dtype == 'object'):
                data[col]=data[col].fillna(val)
    elif(null_value_options=='delete_rows'):
        data=data.dropna()
    elif(null_value_options=='delete_columns'):
        data=data.dropna(axis=1)
    #print(data.shape)
    
    #
    # Brisanje kolona koje ne uticu na rezultat
    #
    num_rows=data.shape[0]
    for col in data.columns:
        if((data[col].nunique()==(num_rows)) and (data[col].dtype==np.object_)):
            data.pop(col)
    #
    ### Enkodiranje
    '''
    encodings=paramsExperiment["encodings"]

    from sklearn.preprocessing import LabelEncoder
    kategorijskekolone=data.select_dtypes(include=['object']).columns
    encoder=LabelEncoder()
    for kolona in data.columns:
        if(kolona in kategorijskekolone):
            data[kolona]=encoder.fit_transform(data[kolona])
    '''
    
    
    encodings=paramsExperiment["encodings"]
    datafront=dataset.copy()
    svekolone=datafront.columns
    kategorijskekolone=datafront.select_dtypes(include=['object']).columns
    for kolonaEncoding in encodings:
        
        kolona = kolonaEncoding["columnName"]
        if kolona in data.columns:
            encoding = kolonaEncoding["encoding"]
        
            if(kolona in kategorijskekolone):
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
    #print(x_columns)
    x = data[x_columns].values
    y = data[output_column].values
    print('-----------------dfghfhgfhfg-------------------------------')
    print(x)
    print('-----------------dfghfhgfhfg-------------------------------')
    print(y)
    print('-----------------dfghfhgfhfg-------------------------------')
    print(output_column)
    print('-----------------dfghfhgfhfg-------------------------------')

    #
    # Podela na test i trening skupove
    #
    test=paramsExperiment["randomTestSetDistribution"]
    randomOrder = paramsExperiment["randomOrder"]
    if(randomOrder):
        random=123
    else:
        random=0
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=test, random_state=random)
    #print(x_train,x_test)

    #
    # Treniranje modela
    #
    #
    ###OPTIMIZATORI
    """
    if(params['optimizer']=='adam'):
        opt=tf.keras.optimizers.Adam(learning_rate=params['learningRate'])

    elif(params['optimizer']=='adadelta'):
        opt=tf.keras.optimizers.Adadelta(learning_rate=params['learningRate'])

    elif(params['optimizer']=='adagrad'): 
        opt=tf.keras.optimizers.Adagrad(learning_rate=params['learningRate'])

    elif(params['optimizer']=='adamax'):
        opt=tf.keras.optimizers.Adamax(learning_rate=params['learningRate'])

    elif(params['optimizer']=='nadam'):
        opt=tf.keras.optimizers.Nadam(learning_rate=params['learningRate'])

    elif(params['optimizer']=='sgd'):
        opt=tf.keras.optimizers.SGD(learning_rate=params['learningRate'])

    elif(params['optimizer']=='ftrl'):
        opt=tf.keras.optimizers.Ftrl(learning_rate=params['learningRate'])
    
    elif(params['optimizer']=='rmsprop'):
        opt=tf.keras.optimizers.RMSprop(learning_rate=params['learningRate'])

    ###REGULARIZACIJA
    #regularisation={'kernelType':'l1 ili l2 ili l1_l2','kernelRate':default=0.01 ili jedna od vrednosti(0.0001,0.001,0.1,1,2,3) ili neka koju je korisnik zadao,'biasType':'','biasRate':'','activityType','activityRate'}
    reg=params['regularisation']

    ###Kernel
    if(reg['kernelType']=='l1'):
        kernelreg=tf.keras.regularizers.l1(reg['kernelRate'])
    elif(reg['kernelType']=='l2'):
        kernelreg=tf.keras.regularizers.l2(reg['kernelRate'])
    elif(reg['kernelType']=='l1l2'):
        kernelreg=tf.keras.regularizers.l1_l2(l1=reg['kernelRate'][0],l2=reg['kernelRate'][1])

    ###Bias
    if(reg['biasType']=='l1'):
        biasreg=tf.keras.regularizers.l1(reg['biasRate'])
    elif(reg['biasType']=='l2'):
        biasreg=tf.keras.regularizers.l2(reg['biasRate'])
    elif(reg['biasType']=='l1l2'):
        biasreg=tf.keras.regularizers.l1_l2(l1=reg['biasRate'][0],l2=reg['biasRate'][1])

    ###Activity
    if(reg['kernelType']=='l1'):
        activityreg=tf.keras.regularizers.l1(reg['activityRate'])
    elif(reg['kernelType']=='l2'):
        activityreg=tf.keras.regularizers.l2(reg['activityRate'])
    elif(reg['kernelType']=='l1l2'):
        activityreg=tf.keras.regularizers.l1_l2(l1=reg['activityRate'][0],l2=reg['activityRate'][1])
    """  
    filepath=os.path.join("temp/",paramsExperiment['_id']+"_"+paramsModel['_id']+".h5")
    if(problem_type=='multi-klasifikacioni'):
        #print('multi')
        classifier=tf.keras.Sequential()
    
        classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][0],input_dim=x_train.shape[1]))#prvi skriveni + definisanje prethodnog-ulaznog
        for i in range(paramsModel['hiddenLayers']-1):#ako postoji vise od jednog skrivenog sloja
            #print(i)
            classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][i+1]))#i-ti skriveni sloj
        classifier.add(tf.keras.layers.Dense(units=5, activation=paramsModel['outputLayerActivationFunction']))#izlazni sloj

        

        classifier.compile(loss =paramsModel["lossFunction"] , optimizer = paramsModel['optimizer'] , metrics =['accuracy','mae','mse'])

        history=classifier.fit(x_train, y_train, epochs = paramsModel['epochs'],batch_size=paramsModel['batchSize'],callbacks=callback(x_test, y_test,paramsModel['_id']))
     
        hist=history.history
        #plt.plot(hist['accuracy'])
        #plt.show()
        y_pred=classifier.predict(x_test)
        y_pred=np.argmax(y_pred,axis=1)
        
        scores = classifier.evaluate(x_test, y_test)
        #print("\n%s: %.2f%%" % (classifier.metrics_names[1], scores[1]*100))
        
        
        classifier.save(filepath, save_format='h5')
        
        #vizuelizacija u python-u
        #from ann_visualizer.visualize import ann_viz;
        #ann_viz(classifier, title="My neural network")
        
        return filepath,hist

    elif(problem_type=='binarni-klasifikacioni'):
        #print('*************************************************************************binarni')
        classifier=tf.keras.Sequential()
    
        classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][0],input_dim=x_train.shape[1]))#prvi skriveni + definisanje prethodnog-ulaznog
        for i in range(paramsModel['hiddenLayers']-1):#ako postoji vise od jednog skrivenog sloja
            #print(i)
            classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][i+1]))#i-ti skriveni sloj
        classifier.add(tf.keras.layers.Dense(units=1, activation=paramsModel['outputLayerActivationFunction']))#izlazni sloj

        classifier.compile(loss =paramsModel["lossFunction"] , optimizer = paramsModel['optimizer'] , metrics =['accuracy','mae','mse'])

        history=classifier.fit(x_train, y_train, epochs = paramsModel['epochs'],batch_size=paramsModel['batchSize'],callbacks=callback(x_test, y_test,paramsModel['_id']))
        hist=history.history
        y_pred=classifier.predict(x_test)
        y_pred=(y_pred>=0.5).astype('int')

        #print(y_pred.flatten())
        #print(y_test)
        
        scores = classifier.evaluate(x_test, y_test)
        #print("\n%s: %.2f%%" % (classifier.metrics_names[1], scores[1]*100))
        #ann_viz(classifier, title="My neural network")
        
        classifier.save(filepath, save_format='h5')
        return filepath,hist

    elif(problem_type=='regresioni'):
        classifier=tf.keras.Sequential()
    
        classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][0],input_dim=x_train.shape[1]))#prvi skriveni + definisanje prethodnog-ulaznog
        for i in range(paramsModel['hiddenLayers']-1):#ako postoji vise od jednog skrivenog sloja
            #print(i)
            classifier.add(tf.keras.layers.Dense(units=paramsModel['hiddenLayerNeurons'], activation=paramsModel['hiddenLayerActivationFunctions'][i+1]))#i-ti skriveni sloj
        classifier.add(tf.keras.layers.Dense(units=1))

        classifier.compile(loss =paramsModel["lossFunction"] , optimizer = paramsModel['optimizer'] , metrics =['accuracy','mae','mse'])

        history=classifier.fit(x_train, y_train, epochs = paramsModel['epochs'],batch_size=paramsModel['batchSize'],callbacks=callback(x_test, y_test,paramsModel['_id']))
        hist=history.history
        y_pred=classifier.predict(x_test)
        #print(classifier.evaluate(x_test, y_test))
        classifier.save(filepath, save_format='h5')
        return filepath,hist
    def roc_auc_score_multiclass(actual_class, pred_class, average = "macro"):
    
        #creating a set of all the unique classes using the actual class list
        unique_class = set(actual_class)
        roc_auc_dict = {}
        for per_class in unique_class:
            
            #creating a list of all the classes except the current class 
            other_class = [x for x in unique_class if x != per_class]

            #marking the current class as 1 and all other classes as 0
            new_actual_class = [0 if x in other_class else 1 for x in actual_class]
            new_pred_class = [0 if x in other_class else 1 for x in pred_class]

            #using the sklearn metrics method to calculate the roc_auc_score
            roc_auc = roc_auc_score(new_actual_class, new_pred_class, average = average)
            roc_auc_dict[per_class] = roc_auc

        return roc_auc_dict
    #
    # Metrike
    #
    
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
    '''
    elif(problem_type=="multi-klasifikacioni"):
        
        cr=sm.classification_report(y_test, y_pred)
        cm=sm.confusion_matrix(y_test,y_pred)
        # https://www.kaggle.com/code/nkitgupta/evaluation-metrics-for-multi-class-classification/notebook
        accuracy=metrics.accuracy_score(y_test, y_pred)
        macro_averaged_precision=metrics.precision_score(y_test, y_pred, average = 'macro')
        micro_averaged_precision=metrics.precision_score(y_test, y_pred, average = 'micro')
        macro_averaged_recall=metrics.recall_score(y_test, y_pred, average = 'macro')
        micro_averaged_recall=metrics.recall_score(y_test, y_pred, average = 'micro')
        macro_averaged_f1=metrics.f1_score(y_test, y_pred, average = 'macro')
        micro_averaged_f1=metrics.f1_score(y_test, y_pred, average = 'micro')
        roc_auc_dict=roc_auc_score_multiclass(y_test, y_pred)
    '''
def predict(experiment, predictor, model):
    #model.predict()
    # ovo je pre bilo manageH5 
    return "TODO"


def manageH5(dataset,params,h5model):
    problem_type = params["type"]
    #print(problem_type)
    data = pd.DataFrame()
    #print(data)
    for col in params["inputColumns"]:
        #print(col)
        data[col]=dataset[col]
    output_column = params["columnToPredict"]
    data[output_column] = dataset[output_column]
    #print(data)

    ###NULL
    null_value_options = params["nullValues"]
    null_values_replacers = params["nullValuesReplacers"]
    
    if(null_value_options=='replace'):
        #print("replace null") # TODO
        dict=params['null_values_replacers']
        while(len(dict)>0):
            replace=dict.pop()
            col=replace['column']
            opt=replace['option']
            if(opt=='replace'):
                replacevalue=replace['value']
                data[col]=data[col].fillna(replacevalue)
    elif(null_value_options=='delete_rows'):
        data=data.dropna()
    elif(null_value_options=='delete_columns'):
        data=data.dropna()
    
    #print(data.shape)
    
    #
    # Brisanje kolona koje ne uticu na rezultat
    #
    num_rows=data.shape[0]
    for col in data.columns:
        if((data[col].nunique()==(num_rows)) and (data[col].dtype==np.object_)):
            data.pop(col)
    #
    ### Enkodiranje
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
    #print(data)

    #
    # Input - output
    #
    x_columns = []
    for col in data.columns:
        if(col!=output_column):
            x_columns.append(col)
    #print(x_columns)
    x2 = data[x_columns]
    #print(x2)
    #print(x2.values)
    x2 = data[x_columns].values
    #print(x2)
    y2 = data[output_column].values
    h5model.summary()
    #ann_viz(h5model, title="My neural network")

    h5model.compile(loss=params['lossFunction'], optimizer=params['optimizer'], metrics=params['accuracy',''])

    history=h5model.fit(x2, y2, epochs = params['epochs'],batch_size=params['batchSize'])
    
    y_pred2=h5model.predict(x2)
     
    y_pred2=np.argmax(y_pred2,axis=1)
    #y_pred=h5model.predict_classes(x)
    score = h5model.evaluate(x2,y_pred2, verbose=0)
    #print("%s: %.2f%%" % (h5model.metrics_names[1], score[1]*100))
    #print(y_pred2)
    #print( 'done')