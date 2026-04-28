# HjemTrygg – Beredskap gjort enkelt

En komplett SaaS-plattform for norsk hjemmeberedskap. Bygget med Next.js 14, Prisma, Stripe og OpenAI.

---

## 1. Kom i gang – lokal kjøring

### Forutsetninger
- Node.js 18 eller nyere
- PostgreSQL-database (lokal, Supabase eller Neon)
- npm eller yarn

### Steg for steg

```bash
# Klon repoet
git clone <repo-url> hjemtrygg
cd hjemtrygg

# Installer avhengigheter
npm install

# Sett opp miljøvariabler
cp .env.example .env.local
# Rediger .env.local og fyll inn DATABASE_URL og NEXTAUTH_SECRET som minimum

# Kjør databasemigrering
npx prisma migrate dev

# Fyll databasen med demo-data
npx prisma db seed

# Start utviklingsserver
npm run dev
```

Åpne http://localhost:3000 i nettleseren.

---

## 2. Sett opp database

### Supabase (anbefalt)
1. Gå til [supabase.com](https://supabase.com) og opprett et gratis prosjekt
2. Gå til **Settings > Database > Connection string**
3. Kopier URI-strengen og lim inn som `DATABASE_URL` i `.env.local`
4. Kjør: `npx prisma migrate deploy`

### Neon
1. Gå til [neon.tech](https://neon.tech) og opprett et gratis prosjekt
2. Kopier connection string fra dashboardet
3. Sett som `DATABASE_URL` i `.env.local`
4. Kjør: `npx prisma migrate deploy`

---

## 3. Stripe-oppsett

1. Opprett en konto på [stripe.com](https://stripe.com)
2. Gå til **Products** og opprett tre produkter:
   - **HjemTrygg Basis** – 99 kr/mnd (recurring)
   - **HjemTrygg Pluss** – 199 kr/mnd (recurring)
   - **HjemTrygg Premium** – 349 kr/mnd (recurring)
3. Kopier **Price ID** fra hvert produkt til `.env.local`:
   ```
   STRIPE_PRICE_BASIS=price_...
   STRIPE_PRICE_PLUSS=price_...
   STRIPE_PRICE_PREMIUM=price_...
   ```
4. Kopier **Secret Key** og **Publishable Key** fra Developers > API Keys

### Webhook (lokal utvikling)
```bash
# Installer Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Kopier webhook secret til STRIPE_WEBHOOK_SECRET
```

### Webhook (produksjon)
- Gå til **Developers > Webhooks** i Stripe Dashboard
- Legg til endpoint: `https://dittdomene.no/api/stripe/webhook`
- Velg events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`

---

## 4. OpenAI-oppsett (TryggBot)

1. Opprett konto på [platform.openai.com](https://platform.openai.com)
2. Gå til **API Keys** og opprett en ny nøkkel
3. Sett `OPENAI_API_KEY` i `.env.local`
4. Anbefalt modell: `gpt-4o-mini` (brukes automatisk, raskest og billigst)
5. Sett gjerne brukslimitter i OpenAI-dashboardet for å unngå uventede kostnader

Uten OpenAI-nøkkel kjører TryggBot i demo-modus med forhåndsdefinerte svar.

---

## 5. E-post-oppsett (magic link innlogging)

### Med Resend (anbefalt)
1. Opprett konto på [resend.com](https://resend.com)
2. Kopier API-nøkkel
3. Sett i `.env.local`:
   ```
   EMAIL_SERVER_HOST=smtp.resend.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=resend
   EMAIL_SERVER_PASSWORD=<din-api-nokkel>
   EMAIL_FROM=HjemTrygg <noreply@dittdomene.no>
   ```

---

## 6. Deploy til Vercel

1. Push koden til GitHub
2. Gå til [vercel.com](https://vercel.com) og importer repoet
3. Legg til alle miljøvariabler fra `.env.example` i **Settings > Environment Variables**
4. Vercel setter automatisk `NEXTAUTH_URL` til den deployede URL-en (sett den manuelt hvis ikke)
5. Oppdater Stripe webhook-endepunktet til din Vercel-URL

---

## 7. Deploy til Netlify

Netlify støtter Next.js via `@netlify/plugin-nextjs`.

1. Installer plugin:
   ```bash
   npm install @netlify/plugin-nextjs
   ```

2. Opprett `netlify.toml` i rotmappen:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. Legg til alle miljøvariabler i **Netlify Dashboard > Site Settings > Environment variables**

4. **Viktig:** Sett `NEXTAUTH_URL` manuelt til din Netlify-URL (Netlify setter ikke denne automatisk)

5. Konfigurer Stripe webhook til din Netlify-URL: `https://ditt-prosjekt.netlify.app/api/stripe/webhook`

---

## Miljøvariabler – krav til produksjon

| Variabel | Påkrevd | Beskrivelse |
|----------|---------|-------------|
| `DATABASE_URL` | Ja | PostgreSQL connection string |
| `NEXTAUTH_URL` | Ja | Full URL til appen (f.eks. https://hjemtrygg.no) |
| `NEXTAUTH_SECRET` | Ja | Random string (openssl rand -base64 32) |
| `EMAIL_SERVER_HOST` | Ja | SMTP-server for magic links |
| `EMAIL_SERVER_PASSWORD` | Ja | SMTP-passord |
| `STRIPE_SECRET_KEY` | Nei | Påkrevd for betalingsfunksjonalitet |
| `STRIPE_WEBHOOK_SECRET` | Nei | Påkrevd for Stripe webhooks |
| `OPENAI_API_KEY` | Nei | Påkrevd for TryggBot (AI-svar) |
| `ADMIN_EMAILS` | Nei | Kommaseparert liste over admin-e-poster |

---

## Teknologistack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js v5 (magic link + Google OAuth)
- **Betalinger:** Stripe Subscriptions
- **AI:** OpenAI gpt-4o-mini
- **Styling:** Tailwind CSS + shadcn/ui-komponenter
- **Hosting:** Vercel (primær), Netlify (støttes)

---

## Prosjektstruktur

```
hjemtrygg/
├── app/
│   ├── (marketing)/    # Offentlige sider (forside, priser, blogg, etc.)
│   ├── (app)/          # Innloggede app-sider (dashboard, sjekklister, etc.)
│   ├── api/            # API-ruter (auth, stripe, tryggbot, etc.)
│   └── globals.css
├── components/
│   ├── ui/             # Grunnleggende UI-komponenter
│   ├── marketing/      # Markedsføringsseksjoner
│   ├── app/            # App-komponenter
│   └── shared/         # Delte komponenter (Navbar, Footer, Logo)
├── lib/                # Hjelpefunksjoner og klientbiblioteker
├── prisma/             # Skjema og seed
└── .env.example
```
