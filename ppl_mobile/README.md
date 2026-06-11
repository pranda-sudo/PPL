# PPL Testy Mobile

Tahle slozka je priprava pro mobilni aplikaci pres Capacitor.

## iPhone / iOS

Na Macu s Xcode:

```bash
cd ppl_mobile
npm install
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
```

V Xcode:

1. Vyber tym Apple Developer u polozky `Signing & Capabilities`.
2. Pripoj iPhone kabelem nebo pres Wi-Fi.
3. Jako cil vyber svuj iPhone.
4. Klikni `Run`.

Pro TestFlight/App Store se build archivuje pres `Product > Archive`.

## Android

```bash
cd ppl_mobile
npm install
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

Pak se projekt otevre v Android Studiu.

## Aktualizace obsahu aplikace

Mobilni wrapper pouziva obsah ve slozce `www`. Kdyz se zmeni webova aplikace, zkopiruj aktualni `ppl_app` do `ppl_mobile/www` a spust:

```bash
npm run cap:sync
```
