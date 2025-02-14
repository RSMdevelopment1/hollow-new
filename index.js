require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(`./commands/${file}`);
            if (!command.data || !command.data.name) {
                console.error(`❌ Skipping invalid command file: ${file}`);
                continue;
            }
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } catch (error) {
            console.error(`❌ Error loading command file ${file}:`, error);
        }
    }
} else {
    console.error("⚠️ Commands folder not found!");
}

// Load event files
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        try {
            const event = require(`./events/${file}`);
            if (!event.name || typeof event.execute !== "function") {
                console.error(`❌ Skipping invalid event file: ${file}`);
                continue;
            }
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`✅ Loaded event: ${event.name}`);
        } catch (error) {
            console.error(`❌ Error loading event file ${file}:`, error);
        }
    }
} else {
    console.error("⚠️ Events folder not found!");
}

client.login(process.env.TOKEN)
    .then(() => console.log("✅ Bot logged in successfully!"))
    .catch(err => console.error("❌ Failed to login:", err));
