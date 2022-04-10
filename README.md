# NeuroStellar - Igrannonica

Igrannonica je ASP.NET Core veb aplikacija za manipulaciju veštaèkim neuronskim mreama. Koristeæi aplikaciju, poèetnicima iz oblasti veštaèkih neuronskih mrea se omoguæava razumevanje samog koncepta preprocesiranja, treniranja i testiranja neuronskih mrea. S druge strane, ekspertima se prua manipulacija setovima podataka uz upotrebu brojnih parametara i moguænost istovremenog nadgledanja toka procesa.  

## Opis projekta

###Izvršavanje eksperimenata
Izvršavanje eksperimenata je omoguæeno prijavljenim korisnicima i sastoji se iz sledeæih koraka:

####Izbor seta podataka 
U navedenom koraku vrši se izbor seta podataka iz postojeæih setova ili po potrebi korisnik moe uèitati eljeni set podataka.

####Pikaz izabranog seta podataka
Nakon izvršenog izbora seta podataka, korisniku se tabelarno prikazuju uèitani podaci.

####Preprocesiranje
Preprocesiranje se sastoji iz koraka koji korisniku omoguæavaju:  izbor ulaznih kolona i izlazne kolone, uklanjanje greški, uklanjanje nedostajuæih vrednosti, izbor tipa enkodiranja. Cilj navedenog koraka je uveæanje kvaliteta samog seta podataka. 

####Izbor parametara treniranja
Korisniku se prua izbor parametara za treniranje mree. Ponuğeni parametri treniranja su:
*Tip problema(vrednosti mogu biti:regresioni, binarno-klasifikacioni, multi-klasifikacioni)
*Broj skrivenih slojeva(celobrojna vrednost)
*Broj neurona skrivenih slojeva(bira se za svaki sloj pojedinaèno, celobrojna vrednost)
*Optimizacija(moguæe vrednosti: Adam, Adadelta, Adagrad, Ftrl, Nadam, SDG, SDGMomentum, RMSProp)
*Funkcija obrade gubitka(vrednosti variraju u zavisnosti od tipa problema)
*Funkcije aktivacije skrivenih slojeva(vrednosti zavise o tipa problema i definišu se za svaki sloj pojedinaèno)
*Funkcija aktivacije izlaznog sloja(izbor zavisi od tipa problema) 
*Izbor metrika(ponuğeni izbor zavisi od tipa problema)

####Treniranje modela
Nakon izbora svih parametara, prua se moguænost treniranja modela.  

####Pregled rezultata treniranja
Uzevši u obzir prethodno izabrane metrike, korisniku se prikazuju rezultati treniranja.

####Predviğanja na osnovu postojeæih treniranih modela
Nakon treniranja modela, obavlja se njegovo èuvanje u H5 formatu. Samim tim, omoguæena je ponovna upotreba saèuvanog modela i vrši se predikcija za novi set podataka.
  


## Pokretanje aplikacije

### Neophodne komponente

* .NET 6.0
* NodeJS
* MongoDB
* Python

### Instalacija

* Za instalaciju zahtevanih datoteka potrebnih da bi se pokrenuo angular web sajt:
```
npm install -g @angular/cli
cd .\frontend\
npm install
```
* Za instalaciju .NET:
Visual Studio Installer > (Izaberite vasu verziju Visual Studio editora) > Modify > ASP.NET and web development > Modify

### Pokretanje programa

* Frontend
```
ng serve
```
 - za pokretanje na drugom portu:
```
ng serve --port=80
```

* Backend
```
api.sln - start without debugging
```

## Autori

Danijel AnÄ‘elkoviÄ‡

Ognjen Ä†irkoviÄ‡

Sonja GaloviÄ‡

Tamara JeriniÄ‡

Ivan LjubisavljeviÄ‡

Nevena BojoviÄ‡