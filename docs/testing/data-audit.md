# Audit databáze otázek PPL

Report po kontrole importu z PDF. Cílem je odhalit rozpadlé otázky, sloučené odpovědi, duplicity ID, chybějící obrázky a zbytky textu z patiček PDF.

- Celkem otázek: `1581`
- Duplicitní ID: `0`
- Otázky s obrázkem: `121`
- Chybějící obrázkové assety: `0`
- Výskyty patičky `verze 1.3 ze dne 12.08.2025`: `0`

## Počet odpovědí podle kategorií

| Kategorie | Otázek | 2 odp. | 3 odp. | 4 odp. | 5 odp. | Podezřelé <4 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Komunikace | 76 | 0 | 0 | 76 | 0 | 0 |
| Letove zasady | 166 | 0 | 0 | 165 | 1 | 0 |
| Lidska vykonnost | 118 | 1 | 0 | 117 | 0 | 1 |
| Meteorologie | 238 | 2 | 0 | 236 | 0 | 2 |
| Navigace | 270 | 0 | 0 | 270 | 0 | 0 |
| Obecna znalost o letadle | 255 | 0 | 0 | 254 | 1 | 0 |
| Pravo | 176 | 0 | 0 | 176 | 0 | 0 |
| Provedeni a planovani letu | 183 | 0 | 0 | 182 | 1 | 0 |
| Provozni postupy | 99 | 0 | 0 | 99 | 0 | 0 |

## Zbývající otázky s méně než 4 odpověďmi

Tyto položky zůstávají označené k ručnímu ověření proti PDF. Nejsou automaticky doplněné, protože zdrojový text u nich vypadá jako skutečný dvouvariantový výběr nebo vyžaduje potvrzení ze zdroje.

| Kategorie | Soubor | Strana | Číslo | Odp. | Zadání |
| --- | --- | ---: | ---: | ---: | --- |
| Lidska vykonnost | 2.-Lidska-vykonnost-letoun (2).pdf | 2 | 10 | 2 | Co z následujícího NENÍ projevem hyperventilace? |
| Meteorologie | 3-Meteorologie-vrtulnik.pdf | 24 | 121 | 2 | Výstrahy SIGMET jsou vydávány pro: |
| Meteorologie | 3-Meteorologie-vrtulnik.pdf | 25 | 126 | 2 | Jak se mění teplota vzduchu dle mezinárodní standardní atmosféry od MSL do výšky přibližně 10.000 m? |

## Kontrolované kopie databáze

- `ppl_app/data/questions.json`: `4e7c65d267189867`
- `docs/data/questions.json`: `4e7c65d267189867`
- `ppl_desktop/app/data/questions.json`: `4e7c65d267189867`
- `ppl_mobile/www/data/questions.json`: `4e7c65d267189867`
