# Audit: Lidská výkonnost (7. 11. 2026)

Databáze obsahuje 118 otázek tohoto okruhu. Po doplnění má 108 otázek pole `explanation`, 10 zůstává bez něj z důvodu rozporů či nutnosti ověřit zdroj. **Vyplněné vysvětlení samo o sobě není potvrzením správnosti původního `correctIndex`.**

## Nutná kontrola odpovědí

- `2-lidska-vykonnost-letoun-2-p2-10`: pouze dvě možnosti; označené „brnění“ je typický projev hyperventilace. Vrtulníková verze nabízí „cyanóza“.
- `2-lidska-vykonnost-letoun-2-p3-14` vs. `2-lidska-vykonnost-vrtulnik-p3-14`: stejná otázka, odlišné klíče 22 000 ft a 12 000 ft. Vyžaduje ověření přesné formulace.
- `2-lidska-vykonnost-letoun-2-p4-19` a `2-lidska-vykonnost-vrtulnik-p4-19`: „potápění“ není běžným přímým faktorem výškové hypoxie, ale je důležité pro dekompresní nemoc; terminologii ověřit.
- `2-lidska-vykonnost-letoun-2-p9-38` a `2-lidska-vykonnost-vrtulnik-p8-40`: odbourávání alkoholu uváděno jako 0,0001 bez jednotky; nelze bezpečně vysvětlit bez upřesnění jednotek.
- `2-lidska-vykonnost-letoun-2-p9-41` vs. `2-lidska-vykonnost-vrtulnik-p9-43`: shodné znění a možnosti, rozdílné označení správné odpovědi; tradiční model krátkodobé paměti pracuje se 7 ± 2 položkami po přibližně 10–20 s.
- `2-lidska-vykonnost-vrtulnik-p2-10`: „cyanóza“ jako odpověď dává fyziologicky smysl; porovnat s chybnou letounovou verzí.
- `2-lidska-vykonnost-vrtulnik-p12-59` vs. `2-lidska-vykonnost-letoun-2-p12-57`: totožné možnosti, rozdílné klíče („1“ vs. „1, 2, 3, 4“); stres ovlivňuje pozornost, koncentraci i paměť.
- `2-lidska-vykonnost-vrtulnik-p8-36`: odpověď „pilot je na přistání dlouhý“ neodpovídá obvyklému popisu iluze na dráze se stoupajícím sklonem (riziko příliš nízkého přiblížení). Vysvětlení obsahuje výstrahu, ale `correctIndex` zůstal beze změny.
- `2-lidska-vykonnost-vrtulnik-p5-22`: text odpovědi „prot i srážková světla“ obsahuje překlep v extrakci.

## Další postup

Ověřit uvedené otázky proti původním PDF a příslušné odborné literatuře, opravit nesprávné klíče a chybějící možnosti, teprve potom doplnit posledních 10 vysvětlení. Po opravě synchronizovat `docs/data/questions.json` a `ppl_app/data/questions.json`, případně generované JS kopie.
