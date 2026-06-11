# PPL Testy

Webova/PWA aplikace pro procvicovani PPL testovych otazek.

Aplikaci připravil pilot PPL pro praktickou přípravu na teoretické testy. Databáze vychází z podkladů ÚCL používaných pro přípravu pilotů. Repo je připravené tak, aby šlo později rozšířit také o ULL a další kvalifikace.

## Co je uvnitr

- `ppl_app/` - zdrojova staticka webova aplikace.
- `docs/` - verejna kopie webove aplikace pro GitHub Pages.
- `ppl_desktop/` - Electron wrapper pro vytvoreni Windows `.exe`.
- `ppl_mobile/` - Capacitor priprava pro iPhone/iOS a Android.
- `ppl_app/data/questions.js` - lokalni databaze 1469 otazek.
- `docs/manual-cs.md` - cesky uzivatelsky manual.
- `docs/iphone-testovani.md` - navod pro testovani na iPhonu.
- `docs/testing/` - testovaci checklisty pro jednotlive platformy.

## Spusteni lokálně

Ve slozce `ppl_app` spust:

```bash
python3 -m http.server 8766
```

Pak otevri:

```text
http://127.0.0.1:8766/
```

## Nasazeni na web

Pro GitHub Pages:

1. Nahraj repozitar na GitHub.
2. V nastaveni repozitare otevri `Pages`.
3. V poli `Source` vyber `Deploy from a branch`.
4. V poli `Branch` vyber `main` a slozku `/docs`.
5. Klikni na `Save`.
6. Po chvili bude aplikace na adrese `https://pranda-sudo.github.io/PPL/`.

Slozka `docs/` je zamerne pripravena jako publikovana kopie, protoze GitHub Pages umi jednoduse publikovat pouze root repozitare nebo `/docs`.

## Windows EXE

Na Windows pocitaci:

```powershell
cd ppl_desktop
npm install
npm run build:win
```

Vystup bude ve slozce:

```text
ppl_desktop\dist
```

Pro klasicky instalator:

```powershell
npm run build:win-installer
```
