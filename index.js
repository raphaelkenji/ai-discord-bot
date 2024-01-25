const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { connect_to_database } = require ('./utils/queries.js');
const fs = require('node:fs');
require('dotenv').config();

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
bot.commands = new Collection();
const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	bot.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.once(Events.ClientReady, async(c) => {
	console.log(`${c.user.tag} has connected.`);
    await bot.application.commands.set(commands);
    await connect_to_database();
});

bot.on('error', console.error);
bot.login(process.env.BOT_TOKEN);
