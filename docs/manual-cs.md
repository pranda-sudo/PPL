# Uživatelský manuál: PPL Testy

PPL Testy je aplikace pro procvičování teoretických otázek PPL. Umožňuje učit se po předmětech, dělat krátké testy, spustit kontrolní zkoušku a sledovat vlastní úspěšnost.

Aplikaci připravil pilot PPL pro praktickou přípravu na teoretické testy. Databáze vychází z podkladů ÚCL používaných pro přípravu pilotů. Do budoucna je možné aplikaci rozšířit také o ULL a další kvalifikace.

## Spuštění aplikace

### Webová verze

Otevřete odkaz aplikace v prohlížeči. Aplikace funguje jako PWA, takže ji lze v podporovaném prohlížeči nainstalovat na plochu.

V Chrome nebo Edge:

1. Otevřete aplikaci.
2. Vpravo v adresním řádku nebo v menu prohlížeče zvolte instalaci aplikace.
3. Po instalaci se aplikace spouští jako samostatné okno.

### Windows / macOS aplikace

Pokud máte desktopovou verzi, spusťte instalátor nebo portable aplikaci. Ovládání je stejné jako u webové verze.

## Výběr typu výcviku

V levém panelu je sekce **Typ** se třemi volbami:

- **Letoun PPL(A)**: zobrazí otázky pro letoun a společné otázky.
- **Vrtulník PPL(H)**: zobrazí otázky pro vrtulník a společné otázky.
- **Obojí A + H**: zobrazí otázky pro obě varianty.

Aktivní volba je zvýrazněná. Po změně typu se aktuální sada otázek automaticky přepočítá.

## Výběr předmětů

V sekci **Kategorie** lze vybrat jeden nebo více předmětů. Pokud chcete procvičovat pouze meteorologii, ponechte zaškrtnutou jen **Meteorologie**.

Při výběru jednoho předmětu v režimu **Test** aplikace vytvoří sérii ze všech dostupných otázek daného předmětu pro zvolený typ.

## Režimy aplikace

### Učit se

Režim pro průběžné procvičování. Aplikace používá vybrané předměty a zvolený typ letoun/vrtulník/obojí.

Pokud je zapnuté **Více opakovat chyby**, otázky, ve kterých uživatel chybuje, se v procvičování objevují častěji.

### Test

Režim pro testování z vybraných předmětů.

- Při výběru více předmětů se použije počet otázek nastavený v poli **Počet otázek**.
- Při výběru jednoho předmětu se vytvoří série ze všech otázek daného předmětu.

### Zkouška

Kontrolní zkouška odpovídá rozložení předmětů:

| Předmět | Počet otázek | Čas |
| --- | ---: | ---: |
| Právo | 12 | 20 min |
| Lidská výkonnost | 12 | 20 min |
| Meteorologie | 12 | 20 min |
| Komunikace | 12 | 25 min |
| Letové zásady | 12 | 25 min |
| Provozní postupy | 12 | 25 min |
| Provedení a plánování letu | 16 | 35 min |
| Obecné znalosti o letadle | 16 | 35 min |
| Navigace | 16 | 35 min |
| **Celkem** | **120** | **240 min** |

Po spuštění zkoušky se zobrazí časovač. Po kliknutí na **Vyhodnotit zkoušku** aplikace vytvoří výsledkový protokol.

### Chyby

Režim pro opakování otázek, na které uživatel odpověděl špatně. Pokud se v otázce postupně zlepšíte, aplikace ji může z chybových otázek odebrat.

## Odpovídání na otázky

Klikněte na jednu z odpovědí. Aplikace odpověď ihned vyhodnotí:

- správná odpověď se označí zeleně,
- špatná odpověď se označí červeně,
- správná varianta se zároveň zvýrazní.

Tlačítko **Ukázat odpověď** zobrazí správnou odpověď bez započítání chyby.

Tlačítko **Umím** označí aktuální otázku jako zvládnutou a posune vás dál.

Pokud otázka odkazuje na obrázek nebo přílohu, obrázek se zobrazí přímo pod zadáním otázky.

## Navigace v otázkách

Pod statistikami je **Mapa otázek**. Každý čtvereček odpovídá jedné otázce.

- Bílé číslo: otázka zatím není zodpovězená.
- Zelené číslo: odpověď byla správná.
- Červené číslo: odpověď byla špatná.
- Ohraničené číslo: aktuálně otevřená otázka.

Kliknutím na číslo se můžete vrátit ke konkrétní otázce.

K pohybu lze použít také tlačítka:

- **Předchozí otázka**
- **Další otázka**

## Přehled předmětů

Panel **Přehled předmětů** ukazuje průběžnou úspěšnost v jednotlivých předmětech:

- počet hotových otázek,
- celkový počet otázek v předmětu,
- procentuální úspěšnost.

To pomáhá najít slabé oblasti.

## Statistiky

V levém panelu je dlouhodobá statistika:

- **Celkem**: počet zodpovězených pokusů,
- **Úspěšnost**: dlouhodobé procento správných odpovědí,
- **Chybové otázky**: počet otázek uložených pro opakování.

Tlačítko **Vynulovat statistiky** smaže lokální statistiky v daném zařízení.

## Offline používání

Aplikace obsahuje otázky lokálně a podporuje offline režim. Po prvním načtení by měla fungovat i bez internetu.

Statistiky jsou uložené v zařízení, ve kterém aplikaci používáte.

## Důležité poznámky

- Statistiky se zatím nesynchronizují mezi zařízeními.
- Pokud používáte aplikaci na více počítačích nebo telefonech, každé zařízení má vlastní lokální statistiku.
- Otázky vycházejí z nahrané databáze a je vhodné je před veřejným vydáním průběžně kontrolovat.
