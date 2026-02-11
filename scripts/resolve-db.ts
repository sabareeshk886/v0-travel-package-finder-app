
import dns from "dns";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
}

const match = dbUrl.match(/@([^:]+):(\d+)/);
if (!match) {
    console.error("Could not parse hostname from URL");
    process.exit(1);
}

const hostname = match[1];
const port = match[2];

console.log(`Resolving: ${hostname} (Port: ${port})...`);

dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error("Error resolving IPv4:", err);
        return;
    }
    console.log("IPv4 Address:", addresses[0]);
    // Write to file for easier access by agent
    const fs = require('fs');
    fs.writeFileSync('ip.txt', addresses[0]);
    console.log("IP written to ip.txt");
});
