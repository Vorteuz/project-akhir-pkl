require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Simple seed script to run with node
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
    // Extract connection string logic if needed, but for script just use direct connection
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log("Connected to DB");

        const db = client.db();
        const users = db.collection('users');
        const tickets = db.collection('tickets');

        // Clear existing
        await users.deleteMany({});
        await tickets.deleteMany({});

        const adminPass = await bcrypt.hash("admin123", 10);
        const userPass = await bcrypt.hash("user123", 10);

        const usersData = [
            {
                name: "Admin ISP",
                email: "admin@isp.test",
                password: adminPass,
                role: "admin",
                daerah: "Headquarter",
                paket: "-",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Pelanggan 1",
                email: "user@isp.test",
                password: userPass,
                role: "user",
                daerah: "Jakarta Selatan",
                paket: "Home Basic 20Mbps",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Pelanggan 2",
                email: "user2@isp.test",
                password: userPass,
                role: "user",
                daerah: "Bandung",
                paket: "Gamer Pro 100Mbps",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await users.insertMany(usersData);
        console.log("Users seeded:", result.insertedCount);

        // Seed tickets
        const dummyTickets = [
            {
                ticketId: "T-001",
                userId: result.insertedIds[1], // user 1
                daerah: "Jakarta Selatan",
                jenisGangguan: "Internet Mati Total",
                status: "OPEN",
                pesan: "Lampu modem merah kedip-kedip.",
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                updatedAt: new Date()
            },
            {
                ticketId: "T-002",
                userId: result.insertedIds[1],
                daerah: "Jakarta Selatan",
                jenisGangguan: "Lambat",
                status: "RESOLVED",
                pesan: "Speedtest cuma 2Mbps",
                createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
                updatedAt: new Date()
            },
            {
                ticketId: "T-003",
                userId: result.insertedIds[2], // user 2
                daerah: "Bandung",
                jenisGangguan: "Putus-putus",
                status: "ON_PROGRESS",
                pesan: "RTO saat main game.",
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                updatedAt: new Date()
            }
        ];

        await tickets.insertMany(dummyTickets);
        console.log("Tickets seeded");

    } catch (error) {
        console.error("Error seeding:", error);
    } finally {
        await client.close();
    }
}

seed();
