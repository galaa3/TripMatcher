import 'dotenv/config';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';

const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const ORIGIN_IATA = 'MIL'; // Partenza di default (es. Milano)

// Il tuo catalogo iniziale (puoi aggiungere centinaia di righe qui)
const targetDestinations = [
    { city: 'Barcellona', iata: 'BCN', category: 'mare', description: 'Gaudì, tapas e spiagge infinite.' },
    { city: 'Parigi', iata: 'PAR', category: 'citta', description: 'La ville lumière, romantica e iconica.' },
    { city: 'Innsbruck', iata: 'INN', category: 'montagna', description: 'Il fascino del Tirolo tra le Alpi.' }
];

async function runBot() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log("Avvio inserimento e aggiornamento massivo...");

    for (const dest of targetDestinations) {
        console.log(`\nElaborazione: ${dest.city}...`);

        try {
            // 1. Recupero l'immagine da Unsplash
            let imageUrl = null;
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${dest.city} city landscape&orientation=landscape&client_id=${UNSPLASH_KEY}`);
            const unsplashData = await unsplashRes.json();

            if (unsplashData.results && unsplashData.results.length > 0) {
                // Prendiamo il link "regular" dell'immagine fornita da Unsplash
                imageUrl = unsplashData.results[0].urls.regular;
            }

            // 2. Inserisco o aggiorno la destinazione nel DB
            const [result] = await db.execute(`
                INSERT INTO destination (city, category, description, image_url, iata_code)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), description = VALUES(description)
            `, [dest.city, dest.category, dest.description, imageUrl, dest.iata]);

            // Recupero l'ID (se appena creata o già esistente)
            const [[existingDest]] = await db.execute('SELECT id FROM destination WHERE city = ?', [dest.city]);
            const destId = existingDest.id;

            // 3. Recupero i prezzi da Travelpayouts
            const pricesRes = await fetch(`https://api.travelpayouts.com/v1/prices/monthly?currency=EUR&origin=${ORIGIN_IATA}&destination=${dest.iata}&token=${TRAVELPAYOUTS_TOKEN}`);
            const pricesData = await pricesRes.json();

            if (pricesData.success && pricesData.data) {
                for (const [yearMonth, flightData] of Object.entries(pricesData.data)) {
                    const month = parseInt(yearMonth.split('-')[1]);
                    const flightPrice = flightData.price;
                    const estimatedHotel = 100.00; // Valore fisso per ora

                    // 4. Inserisco i trend mensili
                    await db.execute(`
                        INSERT INTO price_trends (destination_id, reference_month, avg_flight_per_person, avg_accomodation_per_night)
                        VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE avg_flight_per_person = VALUES(avg_flight_per_person)
                    `, [destId, month, flightPrice, estimatedHotel]);
                }
                console.log(`Prezzi e immagini salvati per ${dest.city}`);
            } else {
                console.log(`Nessun volo trovato per ${dest.city}`);
            }

        } catch (error) {
            console.error(`Errore con ${dest.city}:`, error.message);
        }

        // Pausa obbligatoria per rispettare i limiti delle API (1.5 secondi)
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log("\nDatabase popolato con successo!");
    await db.end();
}

runBot();