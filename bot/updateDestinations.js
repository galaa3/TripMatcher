import 'dotenv/config';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';

/**
 * Bot to populate DB with destinations general data and prices.
 * Integrates Unsplash for images and Travelpayouts for flights.
 * Hotel prices are algorithmically simulated for realism.
 */

const UNSPLASH_KEY = process.env.UNSPLASH_KEY;
const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const ORIGIN_IATA = 'MIL';

const targetDestinations = [
    { city: "Paris", iata: "CDG", category: "citta", description: "The City of Light, offering world-class art, fashion, and the iconic Eiffel Tower." },
    { city: "London", iata: "LHR", category: "citta", description: "A vibrant metropolis blending historic landmarks like Big Ben with cutting-edge culture." },
    { city: "Bangkok", iata: "BKK", category: "citta", description: "A bustling capital known for ornate shrines, vibrant street life, and floating markets." },
    { city: "Dubai", iata: "DXB", category: "citta", description: "A futuristic oasis of luxury shopping, ultramodern architecture, and a lively nightlife." },
    { city: "New York", iata: "JFK", category: "citta", description: "The city that never sleeps, featuring Times Square, Broadway, and a diverse culinary scene." },
    { city: "Rome", iata: "FCO", category: "citta", description: "The Eternal City, home to ancient ruins like the Colosseum and incredible Italian cuisine." },
    { city: "Tokyo", iata: "HND", category: "citta", description: "A dazzling mix of neon-lit skyscrapers, historic temples, and exquisite gastronomy." },
    { city: "Istanbul", iata: "IST", category: "citta", description: "Where East meets West, famous for the Hagia Sophia and the bustling Grand Bazaar." },
    { city: "Seoul", iata: "ICN", category: "citta", description: "A dynamic tech hub that perfectly preserves its ancient palaces and traditional street food." },
    { city: "Barcelona", iata: "BCN", category: "mare", description: "A vibrant coastal city famed for Gaudí's surreal architecture and sun-drenched beaches." },
    { city: "Bali", iata: "DPS", category: "mare", description: "A tropical paradise of forested volcanic mountains, iconic rice paddies, and coral reefs." },
    { city: "Phuket", iata: "HKT", category: "mare", description: "Thailand's largest island, boasting stunning white sands, clear waters, and vibrant nightlife." },
    { city: "Cancun", iata: "CUN", category: "mare", description: "A Caribbean gem famous for its luxurious resorts, turquoise waters, and nearby Mayan ruins." },
    { city: "Maldives", iata: "MLE", category: "mare", description: "The ultimate luxury escape with overwater bungalows and crystal-clear turquoise lagoons." },
    { city: "Honolulu", iata: "HNL", category: "mare", description: "Hawaii's capital, offering the legendary Waikiki Beach and a rich Polynesian culture." },
    { city: "Miami", iata: "MIA", category: "mare", description: "A glamorous destination known for its Art Deco district, white-sand beaches, and vibrant nightlife." },
    { city: "Sydney", iata: "SYD", category: "mare", description: "A stunning harbor city famous for its iconic Opera House and the golden sands of Bondi Beach." },
    { city: "Rio de Janeiro", iata: "GIG", category: "mare", description: "A spectacular coastal metropolis known for Copacabana, samba, and the Christ the Redeemer statue." },
    { city: "Antalya", iata: "AYT", category: "mare", description: "A Turkish resort city featuring a yacht-filled Old Harbor and beaches flanked by large hotels." },
    { city: "Palma de Mallorca", iata: "PMI", category: "mare", description: "A beautiful Mediterranean island capital boasting a massive Gothic cathedral and pristine coves." },
    { city: "Innsbruck", iata: "INN", category: "montagna", description: "The capital of the Alps, offering world-renowned winter sports and imperial architecture." },
    { city: "Zermatt", iata: "ZRH", category: "montagna", description: "An idyllic, car-free Swiss village nestled right below the iconic, pyramid-shaped Matterhorn peak." },
    { city: "Chamonix", iata: "GVA", category: "montagna", description: "The birthplace of extreme skiing, located at the base of Mont Blanc, the highest summit in the Alps." },
    { city: "Aspen", iata: "ASE", category: "montagna", description: "A premier ski resort town in Colorado, famous for its luxurious chalets and high-end boutiques." },
    { city: "Banff", iata: "YYC", category: "montagna", description: "A resort town in the Canadian Rockies known for its mountainous surroundings and hot springs." },
    { city: "Queenstown", iata: "ZQN", category: "montagna", description: "The adventure capital of New Zealand, set against the dramatic Southern Alps." },
    { city: "Reykjavik", iata: "KEF", category: "montagna", description: "The gateway to Iceland's dramatic landscape of volcanoes, geysers, and thermal baths." },
    { city: "Salzburg", iata: "SZG", category: "montagna", description: "A picturesque Alpine city, famous as the birthplace of Mozart and the setting for The Sound of Music." },
    { city: "Cortina d'Ampezzo", iata: "TSF", category: "montagna", description: "The Queen of the Dolomites, offering breathtaking mountain scenery and chic Italian lifestyle." },
    { city: "Whistler", iata: "YVR", category: "montagna", description: "A world-class ski destination in Canada offering epic winter sports and summer mountain biking." },
    { city: "Singapore", iata: "SIN", category: "citta", description: "A futuristic island city-state featuring the stunning Gardens by the Bay and diverse street food." },
    { city: "Kuala Lumpur", iata: "KUL", category: "citta", description: "A modern Asian skyline dominated by the Petronas Twin Towers, mixing Malay, Chinese, and Indian cultures." },
    { city: "Amsterdam", iata: "AMS", category: "citta", description: "A charming city of historic canals, world-class art museums, and a vibrant cycling culture." },
    { city: "Prague", iata: "PRG", category: "citta", description: "The City of a Hundred Spires, known for its Old Town Square, historic astronomical clock, and Gothic churches." },
    { city: "Vienna", iata: "VIE", category: "citta", description: "An imperial capital famous for its grand palaces, classical music legacy, and elegant coffee houses." },
    { city: "Venice", iata: "VCE", category: "citta", description: "A romantic masterpiece built on water, featuring stunning Renaissance architecture and gliding gondolas." },
    { city: "Florence", iata: "FLR", category: "citta", description: "The cradle of the Renaissance, housing masterpieces like Michelangelo’s David and the stunning Duomo." },
    { city: "Athens", iata: "ATH", category: "citta", description: "The historical heart of Europe, dominated by the majestic Acropolis and ancient ruins." },
    { city: "Berlin", iata: "BER", category: "citta", description: "A city with a turbulent history, now celebrated for its cutting-edge art scene and vibrant nightlife." },
    { city: "Madrid", iata: "MAD", category: "citta", description: "A lively capital offering rich European art collections, expansive parks, and late-night tapas." },
    { city: "Dublin", iata: "DUB", category: "citta", description: "A literary capital with historic castles, lively traditional pubs, and friendly locals." },
    { city: "Lisbon", iata: "LIS", category: "citta", description: "A sunny, pastel-colored coastal capital known for its steep hills, historic trams, and soulful Fado music." },
    { city: "Los Angeles", iata: "LAX", category: "citta", description: "The center of the nation’s film and television industry, offering sunshine and the Hollywood Walk of Fame." },
    { city: "San Francisco", iata: "SFO", category: "citta", description: "Famous for the Golden Gate Bridge, steep streets, and the historic Alcatraz Island." },
    { city: "Las Vegas", iata: "LAS", category: "citta", description: "An oasis of entertainment in the Mojave Desert, famous for vibrant nightlife and 24-hour casinos." },
    { city: "Hong Kong", iata: "HKG", category: "citta", description: "A major financial hub boasting a famous skyline, deep natural harbor, and a dense, vibrant street life." },
    { city: "Taipei", iata: "TPE", category: "citta", description: "A modern metropolis with bustling night markets, ancient temples, and the towering Taipei 101." },
    { city: "Osaka", iata: "KIX", category: "citta", description: "Japan's kitchen, renowned for its modern architecture, vibrant nightlife, and exceptional street food." }
];

async function runBot() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log("Start insertion and update...");

    for (const dest of targetDestinations) {
        console.log(`\nProcessing: ${dest.city}...`);

        try {
            // 1. Retrieving the image from Unsplash with safety checks
            let imageUrl = null;
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${dest.city} city landscape&orientation=landscape&client_id=${UNSPLASH_KEY}`);

            if (!unsplashRes.ok) {
                const errorText = await unsplashRes.text();
                throw new Error(`Unsplash API blocked or in error: ${errorText}`);
            }

            const unsplashData = await unsplashRes.json();

            if (unsplashData.results && unsplashData.results.length > 0) {
                imageUrl = unsplashData.results[0].urls.regular;
            }

            // 2. Inserting and updating destination data in DB
            const [result] = await db.execute(`
                INSERT INTO destination (city, category, description, image_url, iata_code)
                VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), description = VALUES(description)
            `, [dest.city, dest.category, dest.description, imageUrl, dest.iata]);

            // Retrieving the ID (whether just created or already existing)
            const [[existingDest]] = await db.execute('SELECT id FROM destination WHERE city = ?', [dest.city]);
            const destId = existingDest.id;

            // 3. Retrieving flight prices from Travelpayouts
            const pricesRes = await fetch(`https://api.travelpayouts.com/v1/prices/monthly?currency=EUR&origin=${ORIGIN_IATA}&destination=${dest.iata}&token=${TRAVELPAYOUTS_TOKEN}`);
            const pricesData = await pricesRes.json();

            if (pricesData.success && pricesData.data) {
                // 4. Pure Algorithmic Projection Logic for Hotel Prices
                for (const [yearMonth, flightData] of Object.entries(pricesData.data)) {
                    const month = parseInt(yearMonth.split('-')[1]);
                    const flightPrice = flightData.price;

                    // Set base price according to destination category
                    let baseHotelPrice = 70;
                    if (dest.category === 'montagna') baseHotelPrice += 60;
                    else if (dest.category === 'citta') baseHotelPrice += 50;
                    else if (dest.category === 'mare') baseHotelPrice += 30;

                    // Correlate hotel price partially to flight price to reflect global destination cost
                    const marketVariance = flightPrice * 0.15;
                    let finalHotelPrice = baseHotelPrice + marketVariance;

                    // Seasonality adjustments
                    if ([7, 8, 12].includes(month)) {
                        finalHotelPrice *= 1.5; // Peak season surcharge (50%)
                    } else if ([1, 2, 11].includes(month) && dest.category !== 'montagna') {
                        finalHotelPrice *= 0.75; // Low season discount (25%) - excluding mountains
                    }

                    // Adding 5-10% randomness for organic realism
                    const randomVariance = 1 + (Math.random() * 0.1 - 0.05);
                    finalHotelPrice = Math.round(finalHotelPrice * randomVariance);

                    // Inserting the monthly trends, updating accommodation on duplicate
                    await db.execute(`
                        INSERT INTO price_trends (destination_id, reference_month, avg_flight_per_person, avg_accomodation_per_night)
                        VALUES (?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                                                 avg_flight_per_person = VALUES(avg_flight_per_person),
                                                 avg_accomodation_per_night = VALUES(avg_accomodation_per_night)
                    `, [destId, month, flightPrice, finalHotelPrice]);
                }
                console.log(`Prices and images saved for ${dest.city}`);
            } else {
                console.log(`No flights found for ${dest.city}`);
            }

        } catch (error) {
            console.error(`Error with ${dest.city}:`, error.message);
        }

        // Mandatory pause to comply with API limits (1.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log("\nDatabase populated with success!");
    await db.end();
}

runBot();