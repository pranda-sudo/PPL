# PPL Testy

Webova/PWA aplikace pro procvicovani PPL testovych otazek.

## Co je uvnitr

- `ppl_app/` - staticka webova aplikace, jde nasadit na GitHub Pages, Netlify nebo Vercel.
- `ppl_desktop/` - Electron wrapper pro vytvoreni Windows `.exe`.
- `ppl_app/data/questions.js` - lokalni databaze 1469 otazek.

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

Nejjednodussi je nasadit slozku `ppl_app` jako staticky web.

Pro GitHub Pages:

1. Nahraj repozitar na GitHub.
2. V nastaveni repozitare otevri `Pages`.
3. Nastav publikovani z branch `main`.
4. Jako zdroj pouzij slozku `/ppl_app`, pokud hosting podporuje custom folder; jinak presun obsah `ppl_app` do rootu nebo pouzij GitHub Actions.

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
