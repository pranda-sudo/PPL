# Testovací plán PPL Testy

Tento adresář obsahuje české checklisty pro testování aplikace na jednotlivých platformách.

## Platformy

- [Web / PWA](web-pwa.md)
- [Windows](windows.md)
- [macOS](macos.md)
- [iPhone / iOS](ios.md)
- [Android](android.md)

## Doporučený postup

1. Nejprve otestovat webovou verzi, protože je společným základem všech ostatních platforem.
2. Potom otestovat Windows a macOS desktop build.
3. Nakonec otestovat mobilní verze na iPhonu a Androidu.
4. U nalezené chyby vždy zapsat:
   - platformu,
   - zařízení,
   - verzi systému,
   - krok, při kterém chyba vznikla,
   - očekávaný výsledek,
   - skutečný výsledek,
   - screenshot, pokud je užitečný.

## Kritické oblasti

- Načtení databáze 1469 otázek.
- Výběr Letoun / Vrtulník / Obojí.
- Výběr kategorií.
- Režimy Učit se, Test, Zkouška, Chyby.
- Kontrolní zkouška 120 otázek / 240 minut.
- Vyhodnocení zkoušky.
- Ukládání statistik po zavření a znovuotevření aplikace.
- Offline fungování.
