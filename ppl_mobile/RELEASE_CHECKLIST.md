# Pilotní akademie – kontrola před vydáním (iOS + Android)

Stav: **pouze interní technická příprava, není povoleno publikovat jako placenou aplikaci.**

## Co je připraveno
- Jediný webový obsah pro Android/iOS (Capacitor).
- Identifikátor aplikace `cz.ppltesty.app` a název **Pilotní akademie**.
- Skript `npm run check:mobile` pro kontrolu struktury a základní konfigurace.
- Ručně spustitelné GitHub Actions pro nepodepsaný **Android debug APK** a **iOS simulátor**.
- Bez tajných podpisových klíčů v GitHubu a bez automatického vydání.

## Nezbytné před zveřejněním
1. Přesunout **všechny** chráněné datové soubory s otázkami a odpověďmi z webového balíčku a GitHub Pages do serverové služby s kontrolou placeného členství. Aktuální balíček lze dekompilovat a odpovědi získat.
2. Dokončit a otestovat zabezpečené API Supabase, včetně vypršení členství a obnovování relace.
3. Vyřešit redirecty registrace, reset hesla a funkčnost přihlášení v nativním WebView na obou platformách. `capacitor://localhost` a `http://localhost` nejsou totéž co webová doména.
4. Vyřešit Apple In-App Purchase / Google Play Billing (nepoužívat webový Stripe pro digitální členství uvnitř mobilní aplikace bez posouzení aktuálních pravidel), obnovení přístupu, storno a případný režim pouze pro již platící uživatele.
5. Ověřit obchodní a licenční oprávnění k otázkám a obrázkům, zásady ochrany osobních údajů, žádosti o smazání účtu a formuláře App Privacy / Data Safety.
6. Vyhotovit ikony, splash obrazovky, screenshoty, texty obchodu a e-mail podpory.
7. Otestovat zařízení iPhone a Android: první instalace, registrace, přihlášení, odhlášení, bez členství, členství expirováno, nestabilní síť, návrat do aplikace a režim na výšku/vodorovně.
8. Apple: Xcode signing team, App Store Connect, TestFlight. Google: Play Console, signing key / Play App Signing, interní/uzavřené testování, AAB.
9. Před releasem spustit `npm run check:release`: **v aktuálním stavu má správně selhat**.

## Lokální vytvoření nativních projektů
```bash
cd ppl_mobile
npm install
npm run sync:web
npm run check:mobile
npx cap add android
npx cap add ios     # pouze na macOS + Xcode
npx cap sync
```
Projekt Android otevřít v Android Studiu, projekt iOS v Xcode. Projektové složky generované příkazy Capacitor nejsou v repozitáři, workflow je vytváří při interních sestaveních.

## Testovací sestavení na GitHubu
GitHub → Actions → **Mobile internal builds (Android / iOS)** → Run workflow. Výsledky jsou pouze interní, nepodepsané / debug; nejsou určené k publikaci a obsahují citlivé výukové podklady.
