# Testování na iPhonu

Jsou dvě cesty, jak aplikaci otestovat na iPhonu 16.

## 1. Rychlý test jako PWA

Tahle cesta nepotřebuje Xcode ani Apple Developer účet.

1. Nahraj webovou verzi přes GitHub Pages.
2. Otevři adresu aplikace v Safari na iPhonu.
3. Klepni na sdílení.
4. Zvol **Přidat na plochu**.
5. Spusť aplikaci z ikony na ploše.

Výhoda: rychlé testování vzhledu, otázek, statistiky a offline režimu.

## 2. Nativní test přes Xcode

Tahle cesta vytvoří skutečnou iOS aplikaci.

Na Macu:

```bash
cd ppl_mobile
npm install
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
```

V Xcode:

1. Přihlas se Apple ID.
2. V nastavení projektu vyber svůj tým v **Signing & Capabilities**.
3. Připoj iPhone 16.
4. Vyber iPhone jako cílové zařízení.
5. Klikni **Run**.

Pro distribuci přes TestFlight nebo App Store je potřeba Apple Developer Program.

## Poznámka

Aktuální aplikace funguje offline a ukládá statistiky lokálně v zařízení. Statistiky se zatím nesynchronizují mezi iPhonem, počítačem a dalšími zařízeními.
