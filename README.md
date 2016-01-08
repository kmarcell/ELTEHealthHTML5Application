
Az ELTE health projekt adatainak grafikus ábrázolása HTML5 és d3.js használatával.

Leírás
---------------

A projekt d3.js és couchDB (NoSQL adatbázis) függőségeket használatával jeleníti meg a begyűjtött adatokat egy honlapon, ahol az adatokat grafikonok ábrázolják.
A d3.js-t a honlap maga használja fel, míg a couchDB adatbázis kezelőt telepítenünk kell és importálnunk kell az elérhető adatokat.
Az elkészített webes szolgáltatás a meglévő adatok közül csak a 'sessions' fájlokban lévő adatokat tudja kezelni.

Üzembehelyezés:
---------------

1. Az elérhető adatokat transformálnunk kell a működéshez, méghozzá úgy, hogy a meglévő JSON formátumú adatokat fájlonként kiegészítjük a fájlnévben szereplő hozzárendelt felhasználó azonosítójával.
Ehhez a JSON fájlban a "sessions" azonosító elé szúrjuk be a struktúrába a 'userId' értékhez az azonosítót, úh. { "userId" : "exampleId", "sessions": [...]} struktúrát kapjunk.
Ez a lépés könnyen szkriptelhető.

2. Ezután telepítenünk kell a couchDB programot a cél számítógépre/virtuális gépre.
3. Hozzuk létre az adatbázist a couchDB -ben. Használjuk a webes szolgáltatásban szereplő downloadData.js fájlban specifikált URL-ben szereplő nevet.
   Az adatbázis létrehozásához használhatjuk a couchDB admin felületét, ami hostname:5984/_utils/ URL alatt elérhető vagy
   létrehozhatjuk terminálból a: curl -X PUT hostname:5984/<adatbázisnév> paranncsal.
3. Töltsük fel a couchDB-t a transformált adatokkal, ehhez használhatjuk a cURL programot az alábbi példa szerint. Az egyes JSON adatfájlokat fájlonként tudjuk feltölteni.
   curl -x PUT -h localhost:/database_name @data.json
   curl -X POST hostname:5984/<adatbázisnév> -d @<fájlnév>.json -H "Content-Type: application/json"
4. Töltsük fel az alábbi transformációt tartalmazó 'design' fájl a couchDB-be.
   Ehhez használhatjuk a hostname:5984/_utils/ felületet vagy a cURL parancsot.
   A létrehozott adatbázisban hozzuk létre a "_design/sessions" azonosítójú fájlt. Ebben hozzunk létre egy 'views' mezőt és adjuk neki értékül a:
   
   {
	   "by_user_id": {
		   "map": "function(doc) { if(doc.userId && doc.sessions) { for(var idx in doc.sessions) {emit(doc.userId, doc.sessions[idx]);}}}"
	   }
   }
   
   transformációs függvényt.
   Ezzel létrehoztuk egy nézetét az adatoknak, melyet le is kérdezhetünk böngészőből vagy használhatjuk a
   wget hostname:5984/labor/_design/sessions/_view/by_user_id parancsot.
   
5. Az /etc/couchdb/local.ini fájlban engedélyeznünk kell, hogy az adatokat megjelenítő honlap letölthesse az adatokat a couchDB-ből, amit a 'cross-domain restriction' akadályoz.
   Ehhey adjuk az 'origins' változóhoz '=' jellel a couchDB-t hívó honlap forráscímét és portját, például:
   origins = https://localhost:8123, http://localhost:8123.
6. Telepítsünk egy http web szervert (pl. apache2) és állítsuk be a webes szolgáltatást (honlapot) valamely URL címre és portra.
7. Ne felejetsük el a downloadData.js -ben szereplő URL-t és a telepített couchDB nézetének URL-jét egyeztetni. Ezzel kész is az üzembe helyezés.
