const { Events } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: Events.InteractionCreate,
    async execute (interaction) {
        if (!interaction.isChatInputCommand()) return; // Will only handle slash commands.
        
        const command = interaction.client.commands.get(interaction.commandName);

        if (command.whitelist) {
            const whitelist = process.env.BOT_WHITELIST.split("/");
            if (!whitelist.includes(interaction.user.id)) {
                console.error(`${interaction.user.tag} (${interaction.user.id}) attempted to use ${interaction.commandName} but is not whitelisted.`);
                return await interaction.reply({content: "You are not allowed to use this command.", ephemeral: true});
            }
        }

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return await interaction.reply({content: `No command matching ${interaction.commandName} was found.`, ephemeral: true});
        }
        
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};