from statistics import mode
from typing_extensions import Self
import pandas as pd
import tensorflow as tf
import keras
import numpy as np
import matplotlib.pyplot as plt
from copyreg import constructor
import flask
from flask import request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
import csv
import json
import h5py
class Response:
    def __init__(self,tacnost,preciznost,recall,spec,f1,mse,mae,mape,rmse):

        self.tacnost=tacnost
        self.preciznost=preciznost
        self.recall=recall
        self.spec=spec
        self.f1=f1
        self.mse=mse
        self.mae=mae
        self.mape=mape
        self.rmse=rmse
  
class fCallback(tf.keras.callbacks.Callback):
    def __init__(self, x_test, y_test):
        self.x_test = x_test
        self.y_test = y_test

        
    def on_epoch_end(self, epoch, logs=None):
        print('Evaluation: ', self.model.evaluate(self.x_test,self.y_test),"\n")#broj parametara zavisi od izabranih metrika loss je default
        
    
def obuka(dataunos,params,modelunos):
    import numpy as np
    import pandas as pd
    import tensorflow as tf
    import matplotlib.pyplot as plt
    ### -1) Ucitavanje h5 modela PART3
    if(modelunos!=None):
       # print("Model je unet")
    model=modelunos
    
    ### 0) Pretvaranje data seta u novi, sa kolonama koje je korisnik izabrao za obuku
 
    data=pd.DataFrame()
    zeljenekolone=params["inputColumns"]
    for i in range(len(zeljenekolone)):
        data[zeljenekolone[i]]=dataunos[zeljenekolone[i]]
    #print(data.head(10))

   
    #predvidetikol=input("UNETI NAZIV KOLONE ČIJU VREDNOST TREBA PREDVIDETI ")
    ###sta se cuva od promenjivih broj kolone ili naziv kolone???
    predvidetikol=params["columnToPredict"]

    data[predvidetikol]=dataunos[predvidetikol]
    ### 1)Ucitavanje vrednosti 
    #print(1)
    #data1=pd.read_csv('titanic.csv')
    #data=data1.copy()
    #print(data.head())

    ### U promenjivoj kolone nalaze se nazivi svih kolona seta podataka
    kolone=data.columns
    #print(kolone[1])
    #print(data[kolone[1]].isnull().sum())
    #print(data[kolone[1]].head(10))


    ### 2)Proveravanje svih kolona za null vrednosti i popunjavanje medijanom ili srednjom vrednosti ili birisanje

    #####Part2 #####
    
    #brisanje=input("DA LI ZELITE DA IZBRSETE SVE KOLONE SA NULL VREDNOSTIMA? ")
    brisanje='ne'
    if(brisanje=='da'):
        data=data.dropna(axis=1)
    elif(brisanje=='ne'):
    #   brisanjer=input("DA LI ZELITE DA IZBRISETE SVE REDOVE SA NULL VREDNOSTIMA? ")
        brisanjer='ne'
        if(brisanjer=='da'):
            data=data.dropna()
        elif(brisanjer=='ne'):

            for i in range(len(kolone)):

                if(data[kolone[i]].isnull().any()):
                    tippodataka=data[kolone[i]].dtype
                    kolona=data[kolone[i]].copy()
            
                    if(tippodataka==np.float64 or tippodataka==np.int64):
                        #popunjavanje=input("UNETI NACIN POPUNJAVANJA PROMENJIVIH SA NULL VREDNOSTIMA ")
                        popunjavanje='medijana'
                        if(popunjavanje=='medijana'):
                            medijana=kolona.mean()
                            data[kolone[i]]=data[kolone[i]].fillna(medijana)
                        if(popunjavanje=='srednjavrednost'):
                            sv=data[kolone[i]].sum()/data[kolone[i]].count()
                            data[kolone[i]]=sv
                        if(popunjavanje=='brisanjekolone'):
                            data=data.dropna(axis=1)

                    elif(tippodataka==np.object_):
                        najcescavrednost=kolona.value_counts().index[0]
                        data[kolone[i]]=data[kolone[i]].fillna(najcescavrednost)
    
    kolone=data.columns
 
    ### 3)Izbacivanje kolona koje ne uticu na rezultat PART2
    nredova=data.shape[0]
    for i in range(len(kolone)):
        if((data[kolone[i]].nunique()>(nredova/2)) and( data[kolone[i]].dtype==np.object_)):
            data.pop(kolone[i])

    #print(data.head(10))

    ### 4)izbor tipa enkodiranja
    kolone=data.columns ### Azuriranje postojecih kolona nakon moguceg brisanja

    #enc=input("UNETI TIP ENKODIRANJA ")
    enc=params["encoding"]
    onehot=0

    ### 5)Enkodiranje svih kategorijskih promenjivih label-encode metodom

    if(enc=='label'):
        from sklearn.preprocessing import LabelEncoder
        encoder=LabelEncoder()
        for k in range(len(kolone)):
            if(data[kolone[k]].dtype==np.object_):
                data[kolone[k]]=encoder.fit_transform(data[kolone[k]])
        #print(data.head(20))

    ### 6)Enkodiranje svih kategorijskih promenjivih onehot metodom

    elif(enc=='onehot'):
        ### PART2###
        onehot==1
        kategorijskekolone=[]
        for k in range(len(kolone)):
            if(data[kolone[k]].dtype==np.object_):
                
                kategorijskekolone.append(kolone[k]) ###U kategorijske kolone smestaju se nazivi svih kolona sa kategorijskim podacima
        
        #print(kategorijskekolone)

        ### Enkodiranje 
        data=pd.get_dummies(data,columns=kategorijskekolone,prefix=kategorijskekolone)
        #print(data.head(10))

    kolone=data.columns ### Azuriranje kolona nakon moguceg dodavanja

    ### 7)Podela skupa na skup za trening i skup za testiranje


    xkolone=[]
    for k in range(len(kolone)):
            if(kolone[k]!=predvidetikol):
                
                xkolone.append(kolone[k])###U xkolone se smestaju nazivi kolona cije vrednosti nije potrebno predvideti !!!Prefiks one-hot!!!

    ### 7.1)Podela na x i y
    ###Dodavanje vrednosti u x
    x=data[xkolone].values
    ###Dodavanje vrednosti u y, samo za label enkodiranje, bez prefiksa
    y=data[predvidetikol].values

    #print(data[xkolone].head(10))
    #print(data[predvidetikol].head(10))

    ### 7.2)Unos velicina za trening i test skup
    #trening=int(input('UNETI VELIČINU TRENING SKUPA '))
    #test=int(input("UNETI VELICINU TESTNOG SKUPA"))
    test=params["randomTestSetDistribution"]
    

    ### 7.3)Da li korisnik zeli nasumicno rasporedjivanje podataka?
    #nasumicno=input("DA LI ŽELITE NASUMIČNO RASPOREDJIVANJE PODATAKA U TRENING I TEST SKUP? ")
    nasumicno=params["randomOrder"]
    ###!!!Dugme za nasumici izbor
    if(nasumicno):
        random=50
    else:
        random=0

    ### 7.4)Podela podataka
    from sklearn.model_selection import train_test_split
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=test,random_state=random)

    ### 8)Skaliranje podataka
    from sklearn.preprocessing import StandardScaler
    scaler=StandardScaler()
    scaler.fit(x_train)
    x_test=scaler.transform(x_test)
    x_train=scaler.transform(x_train)

    #####ZAVRSENA PRIPREMA PODATAKA#####

    #####OBUCAVANJE MODELA#####

    ### 9)Inicijalizacija vestacke neuronske mreze

    classifier=tf.keras.Sequential()

    ### 10)Dodavanje prvog,ulaznog sloja
    #aktivacijau=input("UNETI ŽELJENU AKTIVACIONU FUNKCIJU ULAZNOG SLOJA ")
    #brojnu=int(input("UNETI BROJ NEURONA ULAZNOG SLOJA "))

    aktivacijau=params["inputLayerActivationFunction"]
    brojnu=len(kolone)

    classifier.add(tf.keras.layers.Dense(units=brojnu,activation=aktivacijau,input_dim=x_train.shape[1]))

    ### 11)Dodavanje drugog, skrivenog sloja ###PART2###
    #aktivacijas=input("UNETI ŽELJENU AKTIVACIONU FUNKCIJU SKRIVENOG SLOJA ")
    #brojns=int(input("UNETI BROJ NEURONA SKRIVENOG SLOJA "))

    aktivacijas=params["hiddenLayerActivationFunction"]
    brojns=params["hiddenLayerNeurons"]
    brojskrivenih=params["hiddenLayers"]
    for i in range(brojskrivenih):
        classifier.add(tf.keras.layers.Dense(units=brojns,activation=aktivacijas))
    

    ### 12) Dodavanje treceg, izlaznog sloja
    #aktivacijai=input("UNETI ŽELJENU AKTIVACIONU FUNKCIJU IZLAZNOG SLOJA ")

    aktivacijai=params["outputLayerActivationFunction"]
    
    classifier.add(tf.keras.layers.Dense(units=1,activation=aktivacijai))


    ### 13) Kompajliranje neuronske mreze
    #gubici=input("UNETI FUNKCIJU OBRADE GUBITAKA ")
    #optimizator=input("UNETI ŽELJENI OPTIMIZATOR ")

    optimizator=params["optimizer"]

    ### 13.1)Izbor metrike za kompajler PART2
    metrike=params['metrics']
    #metrike=[]
    lossf=params["lossFunction"]
    '''
    while(1):
        m=params['lossFunction']
        
        if(m=='KRAJ'):
            break   
        metrike.append(m)'''
    classifier.compile(optimizer=optimizator, loss=lossf,metrics=metrike)
    performance_simple = fCallback(x_test, y_test)
    ### 14) 
    #uzorci=int(input("UNETI KOLIKO UZORAKA ĆE BITI UNETO U ISTO VREME "))
    #epohe=int(input("UNETI BROJ EPOHA"))
    uzorci=params["batchSize"]
    epohe=params["epochs"]
    history=classifier.fit(x_train,y_train,batch_size=uzorci,epochs=epohe,callbacks=[performance_simple],validation_split=0.2)

    ### 14.1)Parametri grafika iz history PART2
    metrikedf=pd.DataFrame() ###DataFrame u kom se nalaze podaci o rezultatima metrika za iscrtavanje na grafiku. Svaka kolona sadrzi vrednost metrike po epohama
    for i in range(len(metrike)):
        metrikedf[metrike[i]]=history.history[metrike[i]]
        #print(history.history[metrike[i]])
        #plt.plot(history.history[metrike[i]])
    plt.show()

    #print(metrikedf)

    #metrikedf.to_csv("metrike.csv")


    ### 15) Predvidjanje
    y_pred=classifier.predict(x_test)

    #print(y_pred)

    ### 15.1) Formatiranje podataka za metrike PART2
    y_pred=(y_pred>=0.5).astype('int')
    y_pred=y_pred.flatten()

    #print(y_pred)

    #print(y_test)
    ### 15.2) Kreiranje DataFrame-a u kom se nalaze kolone koje predstavljaju stvarne i predvidjene vrednosti, potrebne za iscrtavanje grafika i metrike PART2
    #rezultat=pd.DataFrame({"Stvarna vrednost ":y_test,"Predvidjena vrednost":y_pred})
    #print(rezultat.head(20))

    #####METRIKE##### PART2

    import  sklearn.metrics as sm
            

    ### 16)Tacnost
    tacnost=sm.accuracy_score(y_test,y_pred)
    #print('tacnost ',tacnost)

    ### 17)Preciznost
    preciznost=sm.precision_score(y_test,y_pred)
    #print('preciznost ',preciznost)

    ### 18)Recall
    recall=sm.recall_score(y_test,y_pred)
    #print('recall ',recall)

    ### 19)Specificity
    tn, fp, fn, tp = sm.confusion_matrix(y_test,y_pred).ravel()
    spec = tn / (tn+fp)
    #print('spec ',spec)

    ### 20)F1
    f1=sm.f1_score(y_test,y_pred)
    #print('f1 ',f1)

    ### 21)Classification report
    #classificationreport=sm.classification_report(y_test,y_pred)
    #print('classification ',classificationreport)

    ### 22)Mean squared error (mse)
    mse=sm.mean_squared_error(y_test,y_pred)
    #print('mse ',mse)

    ### 23)Mean absolute error (mae)
    mae=sm.mean_absolute_error(y_test,y_pred)
    #print('mae ',mae)

    ### 24)Mean absolute percentage error (mape)
    mape=sm.mean_absolute_percentage_error(y_test,y_pred)
    #print('mape ',mape)

    ### 25)Root mean square error (rmse) *** da bi se iskoristila u history, salje se u metrics preko funkcije
    import numpy as np
    rmse=np.sqrt(sm.mean_squared_error(y_test,y_pred))
    #print("rmse ",rmse)

    ### 26)Confusion matrix
    #cmatrix=sm.confusion_matrix(y_test,y_pred)
    #print('cmatrix ',cmatrix)

    
    ### 27)ROC
    fpr, tpr, _ = sm.roc_curve(y_test,y_pred)
    '''
    plt.plot(fpr, tpr, color='blue')
    plt.title('ROC')
    plt.xlim([0.0, 1.0])
    plt.xlabel('False Positive Rate')
    plt.ylim([0.0, 1.0])
    plt.ylabel('True Positive Rate')
    plt.show()
    '''
    ##### H5 CUVANJE ##### PART3
    nazivmodela=params['h5ModelName']
    classifier.save(nazivmodela, save_format='h5')
    
    r=Response(float(tacnost),float(preciznost),float(recall),float(spec),float(f1),float(mse),float(mae),float(mape),float(rmse))
    import jsonpickle
    return json.dumps(json.loads(jsonpickle.encode(r)), indent=2)
    return "Done"


