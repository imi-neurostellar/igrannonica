# NeuroStellar - Igrannonica

Igrannonica je ASP.NET Core veb aplikacija za manipulaciju vetakim neuronskim mreama. Koristei aplikaciju, poetnicima iz oblasti vetakih neuronskih mrea se omoguava razumevanje samog koncepta preprocesiranja, treniranja i testiranja neuronskih mrea. S druge strane, ekspertima se prua manipulacija setovima podataka uz upotrebu brojnih parametara i mogunost istovremenog nadgledanja toka procesa.  

## Opis projekta

###Izvršavanje eksperimenata
Izvravanje eksperimenata je omogueno prijavljenim korisnicima i sastoji se iz sledeih koraka:

####Izbor seta podataka 
U navedenom koraku vri se izbor seta podataka iz postojeih setova ili po potrebi korisnik može učitati željeni set podataka.

####Pikaz izabranog seta podataka
Nakon izvrenog izbora seta podataka, korisniku se tabelarno prikazuju učitani podaci.

####Preprocesiranje
Preprocesiranje se sastoji iz koraka koji korisniku omoguavaju:  izbor ulaznih kolona i izlazne kolone, uklanjanje greki, uklanjanje nedostajuih vrednosti, izbor tipa enkodiranja. Cilj navedenog koraka je uveanje kvaliteta samog seta podataka. 

####Izbor parametara treniranja
Korisniku se prua izbor parametara za treniranje mree. Ponueni parametri treniranja su:
*Tip problema(vrednosti mogu biti:regresioni, binarno-klasifikacioni, multi-klasifikacioni)
*Broj skrivenih slojeva(celobrojna vrednost)
*Broj neurona skrivenih slojeva(bira se za svaki sloj pojedinano, celobrojna vrednost)
*Optimizacija(mogue vrednosti: Adam, Adadelta, Adagrad, Ftrl, Nadam, SDG, SDGMomentum, RMSProp)
*Funkcija obrade gubitka(vrednosti variraju u zavisnosti od tipa problema)
*Funkcije aktivacije skrivenih slojeva(vrednosti zavise o tipa problema i definiu se za svaki sloj pojedinano)
*Funkcija aktivacije izlaznog sloja(izbor zavisi od tipa problema) 
*Izbor metrika(ponueni izbor zavisi od tipa problema)

####Treniranje modela
Nakon izbora svih parametara, prua se mogunost treniranja modela.  

####Pregled rezultata treniranja
Uzevi u obzir prethodno izabrane metrike, korisniku se prikazuju rezultati treniranja.

####Predvianja na osnovu postojeih treniranih modela
Nakon treniranja modela, obavlja se njegovo uvanje u H5 formatu. Samim tim, omoguena je ponovna upotreba sauvanog modela i vri se predikcija za novi set podataka.
  


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

Danijel Anđelković

Ognjen Ćirković

Sonja Galović

Tamara Jerinić

Ivan Ljubisavljević

Nevena Bojović
