# Belgrade Events

Web aplikacija za pregled događaja u Beogradu. Aplikacija omogućava korisnicima pregled predstojećih događaja i mesta održavanja, prikaz lokacija na mapi, vremenske prognoze i čuvanje omiljenih događaja. Administratori imaju dodatne mogućnosti za upravljanje sadržajem.

## Tehnologije

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Docker
- Docker Compose
- Cheerio – web scraping podataka o događajima
- Google Maps API
- OpenWeather API

## Pokretanje projekta

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/md20242001/belgrade-events.git
cd belgrade-events
```

### 2. Podešavanje `.env` fajla

U korenu projekta napraviti `.env` fajl i podesiti potrebne promenljive okruženja:

```env
JWT_SECRET=unesite_jwt_secret
JWT_EXPIRES=7d

OPENWEATHER_API_KEY=unesite_api_kljuc
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=unesite_api_kljuc
```

Konekcija ka PostgreSQL bazi unutar Docker okruženja definisana je u `docker-compose.yml` fajlu.

### 3. Kreiranje Docker volume-a

PostgreSQL podaci čuvaju se u Docker volume-u `belgrade_events_pgdata`.

Pre prvog pokretanja potrebno je kreirati volume:

```bash
docker volume create belgrade_events_pgdata
```

### 4. Pokretanje aplikacije

Aplikacija i PostgreSQL baza pokreću se pomoću Docker Compose-a:

```bash
docker compose up --build -d
```

Docker Compose pokreće:

- `belgrade-events-app` – Next.js aplikaciju
- `belgrade-events-postgres` – PostgreSQL 17 bazu

Status kontejnera može se proveriti komandom:

```bash
docker compose ps
```

### 5. Kreiranje tabela u bazi

Nakon prvog pokretanja potrebno je izvršiti migracije:

```bash
docker compose exec app npm run db:migrate
```

### 6. Unos početnih podataka

Početni podaci mogu se uneti komandom:

```bash
docker compose exec app npm run db:seed
```

### 7. Pristup aplikaciji

Aplikacija je dostupna na:

`http://localhost:3000`

### Zaustavljanje aplikacije

Aplikacija i baza mogu se zaustaviti komandom:

```bash
docker compose down
```

Podaci PostgreSQL baze ostaju sačuvani u Docker volume-u `belgrade_events_pgdata`.

Za ponovno pokretanje aplikacije dovoljno je:

```bash
docker compose up -d
```

## Autor

Milica  
Broj indeksa: 2001/24