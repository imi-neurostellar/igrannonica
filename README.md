# NeuroStellar - Igrannonica

Igrannonica je ASP.NET Core veb aplikacija za manipulaciju veštačkim neuronskim mrežama. Koristeći aplikaciju, početnicima iz oblasti veštačkih neuronskih mreža se omogućava razumevanje samog koncepta preprocesiranja, treniranja i testiranja neuronskih mreža. S druge strane, ekspertima se pruža manipulacija setovima podataka uz upotrebu brojnih parametara i mogućnost istovremenog nadgledanja toka procesa.  


## Opis projekta
### Registracija korisnika
Korisnicima se pruža mogućnost registacije na veb aplikaciju _IgrAnnonica_. Priliko registracije, potrebno je da korisnik unese svoje ime, prezime, korisničko ime, e-mail adresu i željenu lozinku. Nakon registracije, korisnik će biti preusmeren na stranicu za prijavljene korisnike. 

### Prijavljivanje korisnika 
Korisnici koji su registrovani su u mogućnosti da se prijave na aplikaciju _IgrAnnonica_ i na taj način stiču mogućnost da učitavaju setove podataka, kreiraju eksperimente i treniraju modele veštačke neuronske mreže.

### Izvršavanje eksperimenata
 Izvršavanje eksperimenata je omogućeno prijavljenim korisnicima i sastoji se iz sledećih koraka:

#### Izbor seta podataka
 U navedenom koraku vrši se izbor seta podataka iz postojećih setova ili po potrebi korisnik može učitati željeni set podataka.

#### Pikaz izabranog seta podataka
 Nakon izvršenog izbora seta podataka, korisniku se tabelarno prikazuju učitani podaci.

#### Preprocesiranje
 Preprocesiranje se sastoji iz koraka koji korisniku omogućavaju:  izbor ulaznih kolona i izlazne kolone, uklanjanje greški, uklanjanje nedostajućih vrednosti, izbor tipa enkodiranja. Cilj navedenog koraka je uvećanje kvaliteta samog seta podataka. 

#### Izbor parametara treniranja
 Korisniku se pruža izbor parametara za treniranje mreže. Ponuđeni parametri treniranja su:

- Tip problema (vrednosti mogu biti: regresioni, binarno-klasifikacioni, multi-klasifikacioni)

- Broj skrivenih slojeva (celobrojna vrednost)

- Broj neurona skrivenih slojeva (bira se za svaki sloj pojedinačno, celobrojna vrednost)

- Optimizacija (moguće vrednosti: Adam, Adadelta, Adagrad, Ftrl, Nadam, SDG, SDGMomentum, RMSProp)

- Funkcija obrade gubitka (vrednosti variraju u zavisnosti od tipa problema)

- Funkcije aktivacije skrivenih slojeva (vrednosti zavise o tipa problema i definišu se za svaki sloj pojedinačno)

- Funkcija aktivacije izlaznog sloja (izbor zavisi od tipa problema) 

- Izbor metrika (ponuđeni izbor zavisi od tipa problema)


#### Treniranje modela
 Nakon izbora svih parametara, pruža se mogućnost treniranja modela.  
#### Pregled rezultata treniranja
 Uzevši u obzir prethodno izabrane metrike, korisniku se prikazuju rezultati treniranja.

#### Predviđanja na osnovu postojećih treniranih modela
 Nakon treniranja modela, obavlja se njegovo čuvanje u H5 formatu. Samim tim, omogućena je ponovna upotreba sačuvanog modela i vrši se predikcija za novi set podataka.

### Pregled javnih setova podataka
Pregled javnih setova podataka je omogućen svim korisnicima koji otvore veb stranicu aplikacije _IgrAnnonica_ . Međutim, samo prijavljeni korisnici imaju dozvolu da iste iskoriste za određeni proces naveden u sekciji _Izvršavanje eksperimenata_.

### Pregled javnih treniranih modela
Pregled javnih treniranih modela omogućen je svim korisnicima aplikacije _IgrAnnonica_ . Korišćenje takvih modela u određenim koracima iz sekcije _Izvršavanje eksperimenata_ omogućeno je isključivo prijavljenim korisnicima. 
  


## Pokretanje aplikacije

### Neophodne komponente

* .NET 6.0
* NodeJS
* MongoDB
* Python 3.10

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
api.sln - start without debugging


## Autori

Danijel Anđelković

Ognjen Ćirković

Sonja Galović

Tamara Jerinić

Ivan Ljubisavljević

Nevena Bojović
