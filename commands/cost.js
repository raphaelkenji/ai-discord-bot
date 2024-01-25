const { SlashCommandBuilder } = require('discord.js');
const { fetch_consumption, fetch_thread } = require('../utils/queries.js');
const { tokens_to_dollars } = require('../utils/rates.js');

module.exports = {
    whitelist: true,
	data: new SlashCommandBuilder()
		.setName('cost')
		.setDescription('Displays cost from an AI thread.')
        .setDMPermission(false),
	async execute(interaction) {
        const thread = await fetch_thread(interaction.channelId);
        const consumption = await fetch_consumption(interaction.channelId);
        if (!thread) return await interaction.reply({content: "This channel is not an AI thread."});
        const value = tokens_to_dollars(thread.model, consumption.sum);
        return await interaction.reply({content: `This thread has used \`${consumption.sum / 2}\` tokens, or \`$${value}\`.`});
    }
};
