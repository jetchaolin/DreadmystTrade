require('dotenv').config();
const { Client, GatewayIntentBits: GatewayIntentBits } = require('discord.js');
const { searchPrice } = require('./dreadmarketApiClient.js');

const client = new Client({
        intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
        ],
});

const INPUT_CHANNEL = process.env.INPUT_CHANNEL.trim();
const OUTPUT_CHANNEL = process.env.OUTPUT_CHANNEL.trim();

let outputChannelCache = null;

process.on('unhandledRejection', (err) => {
        console.error('❌ Erro não tratado:', err);
});

client.once('ready', async () => {
        console.log(`🤖 Bot conectado como ${client.user.tag}`);
        try {
                outputChannelCache = await client.channels.fetch(OUTPUT_CHANNEL);
                console.log('✅ Canal de saída carregado:', outputChannelCache.name);
        } catch (err) {
                console.error('❌ Erro ao carregar canal de saída:', err);
        }
});

client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith('!price')) return;

        if (message.channel.id !== INPUT_CHANNEL) return;

        const items = message.content
                .replace('!price', '')
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean);

        console.log('Searching for', items[0]);
        message.reply(`Searching for ${items[0]}`);

        if (items.length === 0) {
                return message.reply('Informe o nome do item.');
        }

        if (!outputChannelCache) {
                outputChannelCache = await client.channels.fetch(OUTPUT_CHANNEL);
        }

        function formatPrice(value) {
                if (typeof value === 'number' && !Number.isNaN(value)) {
                        return value.toLocaleString();
                }
                return 'not found';
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
                        `💰 Min: ${formatPrice(info.price_min)}\n` +
                        `💰 Max: ${formatPrice(info.price_max)}\n` +
                        `📈 Avg: ${formatPrice(info.price_avg)}\n` +
                        `📊 Median: ${formatPrice(info.price_median)}\n\n`;
        }

        try {
                await outputChannelCache.send(`${reply}`);
        } catch (err) {
                console.error('Failed to send message', err);
        }
});

client.login(process.env.TOKEN);
