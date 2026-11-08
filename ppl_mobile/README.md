# Pilotní akademie – Android a iOS

Zdrojový základ mobilní aplikace pro Android a iOS přes Capacitor. **Zatím nebyla vydána v App Store ani Google Play.** Založení vývojářských účtů a podpis vydání je samostatný krok.

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


## Před publikací – důležité

- **Název:** Pilotní akademie.
- **Capacitor App ID:** `cz.ppltesty.app` (stávající identifikátor; neměnit bez kontroly registrace v obou obchodech).
- **Webové zdroje:** `www/`, synchronizované s `docs/` a `ppl_app/`.
- **Backend:** stávající Supabase projekt, stejná studentská identita a členství.
- **Platby:** `paymentsEnabled: false`, žádná produkční integrace Stripe ani in-app purchase. Mobilní aplikace zatím nesmí nabízet externí Stripe Checkout na nákup digitálních kurzů v rozporu s pravidly obchodů.
- **Zabezpečení:** UI uzamčení nepředstavuje ochranu dat: veřejné JS/JSON soubory s otázkami musí být přesunuty na server před skutečným placeným vydáním. Nutno dořešit dříve uložené offline kopie.
- **Povolení k obsahu:** vyřešit licenční souhlasy pro použití zkouškových otázek.
- **Důležité:** ještě neexistují nativní projekty `android/`, `ios/`, podepsané APK/AAB/IPA ani TestFlight build. Vytvoří se lokálně přes Capacitor příkazy výše.

## Checklist obchodu Google Play

1. Dokončit ověření vývojářského účtu a požadované testování nového účtu.
2. Připravit grafické podklady, náhledy, popis, podporu, zásady ochrany osobních údajů a formulář bezpečnosti dat.
3. Vyřešit Google Play Billing pro prodej digitálního obsahu uvnitř aplikace (či ověřit případnou dostupnou výjimku).
4. Dodat build AAB s aktuálním target SDK a podepsáním; ověřit Google Play policies v době vydání.
5. Nejprve interní/uzavřené testování, až potom produkční vydání.

## Checklist Apple App Store

1. Aktivovat Apple Developer Program až před podepisováním a publikací.
2. Připravit App Store Connect kartu, metadata, screenshoty, privacy details a funkční proces pro smazání účtu.
3. Vyřešit App Store In-App Purchase a příslušná pravidla digitálních předplatných, včetně obnovení a zrušení.
4. Ověřit Xcode/iOS SDK požadavky v době vydání, podepsat build a odeslat do TestFlight.
5. Otestovat přihlášení, obnovení přístupu a pravidla recenzního řízení.

Tato připravenost není tvrzením, že aplikace nyní splňuje podmínky schválení.
