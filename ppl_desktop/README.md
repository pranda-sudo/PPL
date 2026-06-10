# PPL Testy Desktop

Tahle slozka bali webovou aplikaci PPL Testy jako Electron desktop aplikaci.

## Jak vytvorit Windows EXE

Na Windows pocitaci:

1. Nainstaluj Node.js LTS.
2. Otevri PowerShell v teto slozce.
3. Spust:

```powershell
npm install
npm run build:win
```

Vystup bude ve slozce `dist`.

Pro klasicky instalator misto portable EXE:

```powershell
npm run build:win-installer
```

## Poznamka

Na macOS bez Windows balicich nastroju nejde spolehlive vyrobit finalni `.exe`.
Nejcistsi cesta je build spustit na Windows nebo pres GitHub Actions.
