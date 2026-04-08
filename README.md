# Cyberbriefing Sverige

En liten Next.js-app som ger svenska företag en daglig och beslutsvänlig briefing om aktuella cyberhot.

## Funktioner

- Daglig briefing med dagens viktigaste hot
- Varje hotkort visar:
  - Vad som har hänt
  - Allvarlighetsgrad (kritisk/hög/medel/låg)
  - "Påverkar det här oss?" per bransch
  - Rekommenderad åtgärd
- Enkel dashboard för snabb överblick
- Prenumerationsformulär för e-postutskick
- Arkiv med tidigare briefings
- Daglig briefing genereras en gång per datum (cache + lagring)

## Arkitektur

Appen är byggd för att kunna växa utan att bli komplex i första versionen.

- `src/lib/briefing-service.ts`: affärslogik för briefing och arkiv
- `src/lib/repositories/*`: repository-lager med fallback
  - PostgreSQL (om `DATABASE_URL` finns)
  - Lokala JSON-filer i `data/` (om DB saknas)
- `src/lib/cache.ts`: cache-lager
  - Valkey/Redis (om `VALKEY_URL` finns)
  - In-memory fallback
- `src/lib/contact-service.ts`: vidarekoppling till extern contact-form-tjänst (valfri)

## API-rutter

- `GET /api/briefings/today` - returnerar dagens briefing
- `GET /api/briefings/archive?limit=30` - returnerar historik
- `POST /api/subscribe` - registrerar e-post + bransch
- `POST /api/cron/daily` - skapar dagens briefing (för scheduler/cron)
  - skicka header `x-cron-secret` om `CRON_SECRET` är satt

## Kom igång lokalt

1. Installera beroenden:

```bash
npm install
```

2. Skapa miljöfil:

```bash
cp .env.example .env.local
```

3. Starta utvecklingsserver:

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## PostgreSQL (valfritt men rekommenderat)

Kör SQL i `sql/schema.sql` mot din databas och sätt `DATABASE_URL`.

## Valkey (valfritt men rekommenderat)

Sätt `VALKEY_URL` för att cacha dagens briefing så att den återanvänds under dagen.

## Contact Form Service (valfritt)

Sätt:

- `CONTACT_FORM_ENDPOINT`
- `CONTACT_FORM_API_KEY` (om tjänsten kräver nyckel)

Formulärdata sparas alltid internt först, och skickas sedan vidare om endpoint finns.

## Deploy

### Vercel (snabbast)

1. Importera repot i Vercel
2. Lägg in env-vars från `.env.example`
3. Deploy

För daglig generering kan du lägga en Vercel Cron som anropar `POST /api/cron/daily` varje morgon.

### OSC / container

Projektet använder standard Next.js (`output: standalone`) och kan deployas i containerplattformar.

1. Bygg:

```bash
npm run build
```

2. Starta:

```bash
npm run start
```

## Vidareutveckling

Bra nästa steg:

- Koppla in riktig threat-intelligence feed
- LLM-baserad textgenerering med redaktionella regler
- Segmenterad briefing per kundprofil
- E-postutskick via schemalagd worker
