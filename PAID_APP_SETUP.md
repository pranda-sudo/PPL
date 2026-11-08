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

## Stav implementace k 8. 11. 2026 (GitHub v37)

- ✅ Public Supabase project URL: `https://rnoykjhrmparxtopwnrm.supabase.co` vložen do tří veřejných konfigurací.
- ✅ Ceník a studentský účet na webu, zdrojové a mobilní kopii; klientský login používá Supabase Auth, **pokud** je v konfiguraci vyplněn publishable key.
- ✅ Připravené Edge Functions `create-checkout`, `stripe-webhook`, `premium-questions`, a `supabase/config.toml`.
- ✅ `create-checkout`: před vznikem Stripe Checkout kontroluje přihlášení a serverový whitelist plánů.
- ✅ `stripe-webhook`: ověřuje Stripe podpis a návrhově spravuje jednorázové přístupy a měsíční členství.
- ✅ `premium-questions`: před poskytnutím otázek ověřuje identitu a aktuální členství; correct_answer je jen ve výsledku odpovědi.
- ✅ GitHub CI kontrola `.github/workflows/academy-static.yml` kontroluje synchronizaci mobil/web, bezpečný default plateb a výskyt tajných klíčů.
- ⛔ Zatím **není provedena žádná SQL migrace na hostovaný projekt**. Připojený Supabase plugin v aktuálním běhu neposkytl dostupné databázové akce. Připojení v ChatGPT samo migraci nespouští.
- ⛔ Není dostupný Supabase **publishable key**. V konfiguraci zůstává prázdný: login je z bezpečnostních důvodů vypnutý.
- ⛔ Stripe účet, serverové tajné klíče a `price_...` produkty nebyly připojeny. Žádná Edge Function nebyla nasazena. `paymentsEnabled: false` je ve všech klientských konfiguracích a nesmí se měnit bez úspěšného testu.
- ⛔ Prodej a uzamčení otázek zatím není aktivní, zejména protože současné výukové JSON/JS soubory jsou ve veřejném GitHub Pages. Před prodejem vyžadujeme kontrolu zdrojů, autorských práv a kvality obsahu.

### Další technické kroky (musí být provedeny po zajištění přístupů)

1. V projektu `rnoykjhrmparxtopwnrm` aplikovat `supabase/migrations/20261107_pilot_academy.sql`, ověřit všech pět tabulek a RLS.
2. Nastavit Supabase Auth: Site URL `https://pilot.petrranda.cz`, povolené redirecty `https://pilot.petrranda.cz/ucet.html`, odesílání potvrzovacích e-mailů; otestovat registraci, přihlášení, obnovení hesla a logování.
3. Přečíst Supabase **Publishable key** z Dashboard Settings → API Keys a vložit ho pouze do `pilot-public-config.js` ve třech kopích. Nikdy nevkládat secret/service_role nebo Stripe secret do klientského JS.
4. Ověřit TLS certifikát, DNS a nasazení `pilot.petrranda.cz`, protože webový nástroj zatím stránky přes vlastní doménu nepřečetl.
5. Založit a v režimu **test** ověřit čtyři Stripe Price ID a webhook; nakonfigurovat `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` bezpečně jako **Edge Function secrets** v Supabase.
6. Nasadit funkce a ověřit ve Stripe test režimu: platba úspěšná/neúspěšná, předplatné obnovené/zrušené, opakované doručení události, refundace/chargeback, zákaz přístupu po expiraci. Před ostrým provozem je nutné dokončit refund/dispute workflow, hardening idempotence a aktuální Stripe API kompatibilitu.
7. Přesunout licenčně ověřený komerční obsah mimo veřejný GitHub. Aktualizovat klientské testy, aby chráněný obsah získávaly pouze z `premium-questions`.
8. Připravit obchodní podmínky, GDPR a fakturační proces; teprve po kompletních testech `paymentsEnabled: true`.

**Důležité:** Nenasazovat draft Stripe funkcí přímo do produkce bez integračních testů. Neobsahují ještě kompletní řešení vratek, neúspěšných obnovení či souběžných nákupů.
