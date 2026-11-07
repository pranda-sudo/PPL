# Pilotní akademie – připravovaná placená verze

**Stav: návrh, zatím bez spuštěné registrace, Stripe plateb a bez paywallu.**

## Co je už dostupné

- `docs/clenstvi.html`: responzivní prezentace tarifů, bez výběru peněz.
- `docs/ucet.html`: připravené UI pro registraci a přihlášení; formuláře jsou bezpečně vypnuté, dokud není nastaven veřejný Supabase projekt.
- `docs/pilot-public-config.js` (a synchronizované kopie): prázdné **veřejné** nastavení Supabase URL a publishable key. Bez tajných klíčů.
- Položky `Členství a tarify` a `Studentský účet` jsou již v menu na webu i v mobilní kopii.
- Stejná stránka v `ppl_app` a `ppl_mobile/www`.
- `supabase/migrations/20261107_pilot_academy.sql`: výchozí tabulky pro studenty, přístup, studijní pokrok a idempotenci Stripe událostí.
- Původní veřejné testy nejsou zamčené, aby nepřestaly fungovat.

## Navržené tarify (návrh, bez DPH upřesnění)
| Tarif | Cena | Obnovení |
| --- | --- | --- |
| Měsíční | 299 Kč | Automatické měsíční |
| 3 měsíce | 699 Kč | Jednorázové |
| 6 měsíců | 1 190 Kč | Jednorázové |
| 12 měsíců | 1 990 Kč | Jednorázové |

Dobu jednorázového přístupu počítat od potvrzené platby podle jednotné obchodní definice 90 / 180 / 365 dnů.

## Nasazení – co zbývá

1. Založit projekt Supabase a propojit ověřené domény v Authentication. Do všech tří `pilot-public-config.js` souborů zapsat **jen veřejné** Supabase URL a publishable key. Před spuštěním otestovat ověřovací e-maily, URL přesměrování a reset hesla.
2. Spustit migraci v SQL editoru; zapnout e-mailovou verifikaci a zkontrolovat RLS politiky.
3. Založit Stripe účet a čtyři produkty/ceny v CZK (test mode); do backendu uložit přesné price ID. **Nedávat Stripe secret key ani Supabase secret key do GitHub Pages.**
4. Implementovat bezpečnou serverovou funkci **create-checkout**: ověřit JWT, vybírat Stripe Price ID pouze ze serverového seznamu, vytvořit Checkout Session, zabránit neoprávněnému prodloužení nebo duplicitním předplatným.
5. Implementovat Stripe webhook, ověřovat podpis z raw body; deduplikovat události. Členství aktivovat **až po potvrzeném zaplacení**, ne podle návratu z Checkout stránky. Zpracovat renewals, unpaid/failed, refunds, disputes, cancellation a expiraci.
6. Implementovat endpoint pro otázky i vyhodnocení. Každý požadavek autorizovat na serveru, bezpečně dávkovat obsah a vracet řešení až po odpovědi studenta.
7. Přesunout pouze obsah s prokazatelným právem ke komerčnímu použití. Nynější `docs/data/questions.json` a další veřejné soubory jsou komukoli dostupné.
8. Doplnit GDPR, obchodní podmínky, odstoupení od digitálního obsahu, storna, reklamační postupy, cenu včetně/bez DPH a fakturaci. Neprovádět ostrý prodej před právním ověřením.
9. Otestovat nákup, neúspěšnou platbu, vrácení platby, konec členství, reset hesla, více zařízení, offline režim, ochranu dat a mobilní aplikaci. Teprve pak aktivovat uzamčení.

## Bezpečnostní pravidla

- **GitHub Pages je veřejný hosting.** Statické JS/JSON nelze použít jako účinnou ochranu placených otázek.
- Kontrola předplatného musí probíhat na serveru i při požadavku na obsah, ne jen v prohlížeči.
- Klient nikdy nesmí zapisovat stav členství.
- Průkazy PPL, IFR, OFL/VFL: ověřit správnost, aktuálnost a licenční použitelnost dat před monetizací.
- Vlastní doména `pilot.petrranda.cz` musí mít platný HTTPS certifikát.

## Oficiální dokumentace
- Supabase: https://supabase.com/docs/guides/functions/auth
- Supabase Stripe webhooks: https://supabase.com/docs/guides/functions/examples/stripe-webhooks
- Stripe Checkout: https://docs.stripe.com/payments/checkout
- Stripe fulfillment: https://docs.stripe.com/checkout/fulfillment

**Poznámka:** Migrace je připravena pro pozdější backend; nebyla spuštěna proti žádné databázi a neumožňuje platby bez další implementace.
