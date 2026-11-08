# Pilotní akademie – Stripe testovací nastavení

Stav k 8. 11. 2026: **PŘIPRAVENO V GITHUBU, ale Stripe produkty ani propojení nejsou vytvořené.** Platební tlačítka na webu zůstávají vypnutá (`paymentsEnabled: false`). Veřejná databáze otázek nesmí být považována za chráněný placený obsah.

## Účet a prostředí

- Stripe Dashboard: použij **Pískoviště / Sandbox**, ne ostrý účet.
- Supabase projekt: `rnoykjhrmparxtopwnrm`.
- Web: `https://pilot.petrranda.cz`.
- Webhook URL připravena pro pozdější registraci ve Stripe: `https://rnoykjhrmparxtopwnrm.supabase.co/functions/v1/stripe-webhook`.
- **Nikdy** neukládej `sk_test_`, `sk_live_` ani `whsec_` do GitHubu nebo do veřejného JS. Patří pouze do Supabase Edge Function Secrets.

## Čtyři produkty / ceny v Stripe Sandbox

V Stripe otevři **Katalog produktů → Přidat produkt**. Zadej cenu v CZK a odpovídající typ platby.

| Kód v aplikaci | Název produktu v Stripe | Cena | Typ | Tajný název proměnné pro Price ID |
|---|---|---:|---|---|
| `month` | Pilotní akademie – měsíční členství | 399 Kč | Opakovaná, každý 1 měsíc | `STRIPE_PRICE_MONTHLY` |
| `quarter` | Pilotní akademie – přístup 90 dní | 990 Kč | Jednorázová | `STRIPE_PRICE_QUARTER` |
| `half` | Pilotní akademie – přístup 180 dní | 1 690 Kč | Jednorázová | `STRIPE_PRICE_HALF_YEAR` |
| `year` | Pilotní akademie – přístup 365 dní | 2 490 Kč | Jednorázová | `STRIPE_PRICE_YEAR` |

**Důležité:** Cenu nelze měnit jen v HTML. `create-checkout` validuje Stripe Price: aktivní CZK, přesnou částku v haléřích a typ opakování. Jestliže se ceník změní, musí se aktualizovat Stripe Price ID i kontrolní částky na backendu.

## Nasazení (až po konfiguraci a kontrole backendu)

1. U každého produktu získat odpovídající `price_...` ID (nikoliv `prod_...` ID).
2. V Supabase Edge Functions nastavit výhradně **serverové secrets** `STRIPE_SECRET_KEY` (sk_test), čtyři `STRIPE_PRICE_...` hodnoty, `PUBLIC_SITE_URL`. Supabase si musí dodat `SUPABASE_URL` a důvěryhodné admin oprávnění dle nasazení.
3. Nasadit `create-checkout` a `stripe-webhook` ze zdrojů v GitHubu.
4. Založit Stripe webhook pro příslušné testovací události: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`; **dále je třeba dopracovat refundy, spory, nezaplacené faktury a robustní synchronizaci stavu**.
5. Vlož `whsec_...` podpisový secret webhooku jen do Supabase secret `STRIPE_WEBHOOK_SECRET`.
6. Testovat správný přechod předplatného a ručně zkontrolovat tabulku `public.memberships`, že se členství aktivovalo pouze po zaplacení a po vrácení platby ztratí platnost.
7. Zajistit obchodní podmínky, doklady, GDPR, proces vratek a automatické obnovování. Ověřit komerční oprávnění ke zkouškovým otázkám.
8. Teprve po vyřešení všech bodů zapnout `paymentsEnabled: true` ve všech třech `pilot-public-config.js`. Bez toho tlačítka pouze upozorňují, že platby nejsou aktivní.

## Předproduční blokery v současném návrhu

- Aktuální `stripe-webhook` je návrh. Je potřeba aktualizovat mapování Stripe předplatného pro zvolenou verzi API, ověřování cen v událostech, race conditions, zrušení přístupů po refundaci a refund/dispute logiku. **Nenasazovat pro reálné platby bez těchto úprav.**
- V aplikaci jsou výukové otázky zveřejněné ve statických JS souborech. Placená verze musí používat zabezpečené API, nikoliv jen skrýt menu.
- Aktuální registrace neřeší kompletní e-mailové šablony a správu uživatelského účtu.
- Nepoužívej produkční klíče pro testy.

## Testovací scénáře

- Neplatný JWT → `401`.
- Chybějící serverový Stripe secret → `503`.
- Změněné/falešné Stripe Price ID → `503`.
- Správná úspěšná platba → aktivní členství až po ověřené webhook události.
- Neúspěšná platba → žádné členství.
- Opakovaná webhook událost → žádný další členský nárok.
- Obnova předplatného → správný konec období.
- Zrušení, neuhrazená faktura, refundace a spor → správné omezení / odebrání přístupu.
- Expirace členství → API otázky odmítne další přístup.

## Ověřené Stripe sandbox produkty – vytvořeno 8. 11. 2026

Všechny čtyři produkty a jejich výchozí Price ID jsou **skutečně vytvořeny** v sandbox účtu `acct_1UQsnRC1UC9efvKa` (Petr Randa sandbox), `livemode=false`. Jejich částky a typy byly ověřeny přes Stripe API:

| Tarif | Product ID | Price ID | Cena | Typ |
|---|---|---|---:|---|
| Měsíční | `prod_VaijifLs7bkc4E` | `price_1UZXHiC1UC9efvKajcz82GGj` | 399 Kč | recurring / month |
| 90 dní | `prod_VaikOnPUH3vYDA` | `price_1UZXIhC1UC9efvKaMGDZXEEF` | 990 Kč | one_time |
| 180 dní | `prod_VaikyvfIL3Pq3z` | `price_1UZXInC1UC9efvKaYhaZUW81` | 1 690 Kč | one_time |
| 365 dní | `prod_VaikR8Fp2oyygp` | `price_1UZXIsC1UC9efvKaWxZoa8N9` | 2 490 Kč | one_time |

Daňové nastavení dle posledního rozhodnutí provozovatele: **neplátce DPH**. Stripe Price mají `tax_behavior=unspecified`; není nastaven automatický výpočet daně. Toto není právní posouzení povinnosti DPH při přeshraničním digitálním prodeji. Před ostrým prodejem ověřit režim u účetní.

Price ID jsou netajné identifikátory. Jsou i v `supabase/.env.example`, ale **zatím nejsou nahrány do hostovaných Supabase Edge Function Secrets**. Produktové ID `prod_...` se nesmí zaměňovat s cenovým `price_...`.

## Skutečné propojení Stripe Sandbox → Supabase (8. 11. 2026)

**Provedeno a ověřeno:**

- ✅ Supabase Edge Function `create-checkout` je nasazená v projektu `rnoykjhrmparxtopwnrm`, verze 1; serverový whitelist používá přesná Price ID čtyř sandbox tarifů a ověřuje částku, měnu a periodu přes Stripe API.
- ✅ Supabase Edge Function `stripe-webhook` je nasazená, verze 1; příjem Stripe událostí používá podpisové ověřování a bez signing secretu vrací chybu.
- ✅ Ve Stripe účtu `acct_1UQsnRC1UC9efvKa` je vytvořená a ověřená testovací webhook destinace `we_1UZXo7C1UC9efvKaXX8w9l9S`, URL `https://rnoykjhrmparxtopwnrm.supabase.co/functions/v1/stripe-webhook`.
- ✅ Webhook je výhradně sandbox (`livemode=false`) a ve Stripe je `enabled`. Produkty a ceny jsou vytvořeny jako testovací.
- ✅ Webová platba zůstává bezpečně vypnutá (`paymentsEnabled: false`). Placené otázky stále nejsou zamčené.

**Zbývající bezpečné nastavení v uživatelských administracích:**

1. V **Stripe Sandbox → Developers / API keys** vygenerovat testovací Stripe secret `sk_test_...` (nebo odpovídající restricted key s potřebnými oprávněními). **Neukládat do GitHubu ani sem do chatu.**
2. V **Supabase → Edge Functions → Secrets** uložit `STRIPE_SECRET_KEY` s hodnotou testovacího Stripe secretu. Nepřepínat na produkční klíč.
3. V **Stripe Sandbox → Workbench → Webhooks / Event Destinations → Pilotní akademie** otevřít destinaci, odhalit její testovací **Signing secret `whsec_...`**. V Supabase Edge Function Secrets uložit `STRIPE_WEBHOOK_SECRET`. **Nezaměňovat se Stripe API klíčem.**
4. Další secrets mohou mít testovací hodnoty `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_QUARTER`, `STRIPE_PRICE_HALF_YEAR`, `STRIPE_PRICE_YEAR` podle tabulky výše. `create-checkout` už však obsahuje bezpečně kontrolované veřejné testovací Price ID; tyto proměnné jsou volitelné a případné jiné hodnoty platbu zamítnou.
5. Ověřit, že `SUPABASE_URL` a serverový `SUPABASE_SERVICE_ROLE_KEY` jsou dostupné Edge Functions jako projektové systémové proměnné. **Nedávat žádný serverový klíč do HTML, JS ani GitHubu.**
6. Otestovat vstupní podpis webhooku a token přihlášeného studenta, pak testovací Checkout, aktivaci, obnovu, zamítnutí, refundaci a spor. **Současný handler vyžaduje před produkčním použitím dokončit refund/dispute logiku a ověřit aktuální Stripe API struktury.**
7. Teprve po testech i vyřešení autorských práv aktivovat webové placení.

**Proč nejsou secrets nahrané automaticky:** Připojené Supabase nástroje umí nasadit Edge Functions, migrace i SQL, ale nemají operaci pro bezpečné nastavení Edge Function Secrets. Secrets se nesmějí obcházet přes veřejný GitHub nebo klientskou konfiguraci. Stripe konektor zase neumožňuje přes MCP nastavit secrets v Supabase.

**UPOZORNĚNÍ:** Už vytvořený Stripe webhook může do konfigurace secrets vracet `503` a testovací Stripe může zaznamenat neúspěšné doručení. Neprovádět testovací nákupy, dokud nebudou secrets nastavené a zpracování webhooku bezpečně ověřené.
