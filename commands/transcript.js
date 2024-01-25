const { SlashCommandBuilder } = require('discord.js');
const { fetch_thread, fetch_messages } = require('../utils/queries.js');
const fs = require('fs');

module.exports = {
    whitelist: true,
	data: new SlashCommandBuilder()
		.setName('transcript')
		.setDescription('Fetch transcript from an AI thread.')
        .setDMPermission(false),
	async execute(interaction) {
        const thread = await fetch_thread(interaction.channelId);
        if (!thread) return await interaction.reply({content: "This channel is not an AI thread."});
        
        const messages = await fetch_messages(interaction.channelId);
        if (!messages) return await interaction.reply({content: "This thread has no messages."});
        
        let message_formatting = messages.map(msg => { return [`[${(msg.created_at).toLocaleString()}] ${msg.role} : ${msg.content}`] })
        let message_string = message_formatting.join('\n');
        fs.writeFile(`./transcripts/${interaction.channelId}-transcript.txt`, message_string, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
        
        return await interaction.reply({ files: [`./transcripts/${interaction.channelId}-transcript.txt`]})
    }
};
