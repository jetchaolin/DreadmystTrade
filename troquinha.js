require('dotenv').config();
const { Client, GatewayIntentBits: GatewayIntentBits } = require('discord.js');
const { searchPrice } = require('./scraper.js');

const client = new Client({
        intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
        ],
});

client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith('!price')) return;

        const items = message.content
                .replace('!price', '')
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean);

        if (items.length === 0) {
                return message.reply('Informe o nome do item.');
        }

        let reply = '';

        for (const item of items) {
                const data = await searchPrice(item);

                if (!data.items || data.items.length === 0) {
                        reply += `❌ **${item}**: não encontrado\n\n`;
                        continue;
                }

                const info = data.items[0];

                reply +=
                        `🧾 **${info.item_name}**\n` +
                        `📊 Listings: ${info.listings_count}\n` +
                        `💰 Min: ${info.price_min.toLocaleString()}\n` +
                        `💰 Max: ${info.price_max.toLocaleString()}\n` +
                        `📈 Avg: ${info.price_avg.toLocaleString()}\n` +
                        `📊 Median: ${info.price_median.toLocaleString()}\n\n`;
        }

        message.reply(result);
});

client.login(process.env.TOKEN);
