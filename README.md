Belgrade Events
Web aplikacija za pregled događaja u Beogradu. Aplikacija omogućava korisnicima pregled predstojećih događaja i mesta održavanja, prikaz lokacija na mapi, vremenske prognoze i čuvanje omiljenih događaja. Administratori imaju dodatne mogućnosti za upravljanje sadržajem.

Tehnologije
Next.js 
React 
TypeScript 
Tailwind CSS 
PostgreSQL 
Drizzle ORM 
Docker 
Cheerio – web scraping podataka o događajima 
Google Maps API 
OpenWeather API  

Pokretanje projekta
1. Kloniranje repozitorijuma
git clone https://github.com/md20242001/belgrade-events.git
cd belgrade-events

2. Instalacija paketa
npm install

3. Pokretanje PostgreSQL baze
Za lokalni razvoj koristi se PostgreSQL 17 kroz Docker. Baza se zove belgrade_events, a Docker container belgrade-events-postgres.

docker run --name belgrade-events-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=belgrade_events -p 5432:5432 -v belgrade_events_pgdata:/var/lib/postgresql/data -d postgres:17
Ako je container već kreiran, dovoljno je:

docker start belgrade-events-postgres

4. Podešavanje .env fajla
U korenu projekta napraviti .env fajl i podesiti potrebne promenljive okruženja. Konekcija ka lokalnoj PostgreSQL bazi koristi bazu belgrade_events.

DATABASE_URL=postgres://postgres:postgres@localhost:5432/belgrade_events
JWT_SECRET=unesite_jwt_secret
JWT_EXPIRES=7d

OPENWEATHER_API_KEY=unesite_api_kljuc
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=unesite_api_kljuc

5. Kreiranje tabela u bazi
npm run db:migrate

6. Unos početnih podataka
npm run db:seed

7. Pokretanje aplikacije
npm run dev
Aplikacija je nakon pokretanja dostupna na:

http://localhost:3000
Autor
Milica
Broj indeksa: 2001/24
