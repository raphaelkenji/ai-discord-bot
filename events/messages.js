const { Events } = require('discord.js');
const { OpenAI } = require('openai');
const { fetch_thread, fetch_messages, insert_message } = require('../utils/queries.js');
require('dotenv').config();

module.exports = {
    name: Events.MessageCreate,
    async execute (message) {
        // Ignore messages from bots.
        if (message.author.bot) return;

        // Ignore messages from users that aren't in the whitelist.
        const whitelist = process.env.BOT_WHITELIST.split("/");
        if (!whitelist.includes(message.author.id)) return;

        // Ignore messages that aren't in a tracked thread.
        const thread = await fetch_thread(message.channelId);
        if (!thread) return;

        // Ignore messages that aren't mentioning the bot.
        if (!message.mentions.has(message.client.user)) return;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_TOKEN,
        });

        const messages = await fetch_messages(message.channelId);
        if (messages) {
            let previous_messages = messages.map(msg => { return { "role": msg.role, "content": msg.content }; })
            previous_messages.push({ "role": "user", "content": message.content });

            console.log(previous_messages);

            let response = await openai.chat.completions.create({
                model: thread.model,
                messages: previous_messages
            });

            insert_message(message.id, message.channelId, message.author.id, message.content, "user", response.usage.total_tokens, message.createdAt);
            const bot_message = await message.reply(response.choices[0].message);
            insert_message(bot_message.id, bot_message.channelId, bot_message.client.user.id, response.choices[0].message.content, "assistant", response.usage.total_tokens, bot_message.createdAt);
        } else {
            let response = await openai.chat.completions.create({
                model: thread.model,
                messages: [{ "role": "user", "content": message.content}]
            });

            insert_message(message.id, message.channelId, message.author.id, message.content, "user", response.usage.total_tokens, message.createdAt);
            const bot_message = await message.reply(response.choices[0].message);
            insert_message(bot_message.id, bot_message.channelId, bot_message.client.user.id, response.choices[0].message.content, "assistant", response.usage.total_tokens, bot_message.createdAt);
        }
    }
}