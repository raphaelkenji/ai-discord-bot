const { SlashCommandBuilder } = require('discord.js');
const { insert_thread } = require('../utils/queries.js');
const { price_for_model } = require('../utils/rates.js');

module.exports = {
    whitelist: true,
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Creates an AI thread.')
        // .addStringOption(option =>
		// 	option.setName('model')
		// 		.setDescription('Select a model to use for the thread.')
		// 		.setRequired(true)
		// 		.addChoices(
        //             { name: 'GPT-4 Turbo', value: 'gpt-4-turbo'},
		// 			{ name: 'GPT-4', value: 'gpt-4' },
		// 			{ name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
		// 		))
        .setDMPermission(false),
	async execute(interaction) {
        // const model = interaction.options.getString('model');
        const model = "gpt-3.5-turbo";
        const message = await interaction.reply({content: `Creating an AI thread!\n**Model**: ${model}\n**Rate**: $${price_for_model(model)}/1000 tokens`, fetchReply: true});
        const thread = await message.startThread({
            name: `${interaction.user.globalName}'s Thread`,
            autoArchiveDuration: 1440,
        });
        await insert_thread(thread.id, interaction.user.id, model);
    }
};
