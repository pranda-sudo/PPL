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
