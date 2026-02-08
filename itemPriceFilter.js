import 'dotenv/config';
import writeUserFile from './utils/writeUserFile.js';
import readUserFile from './utils/readUserFile.js';
import listUserDiseredItems from './services/listUserDiseredItems.js';
import processUserInput from './services/processUserInput.js';
import { filterItemsListWithUserInput } from './utils/filterItemsListWithUserInput.js';
import { filterResultListWithUserPreviousResponse } from './utils/filterResultListWithUserPreviousResponse.js';
import { writeReply } from './utils/writeReply.js';

import { Client, GatewayIntentBits } from 'discord.js';

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
        console.error('Untreated error:', err);
});

client.once('ready', async () => {
        console.log(`Bot connected as ${client.user.tag}`);
        try {
                outputChannelCache = await client.channels.fetch(OUTPUT_CHANNEL);
                console.log('Output channel ready', outputChannelCache.name);
        } catch (err) {
                console.error('Failed loading output channel', err);
        }
});

client.on('messageCreate', async (message) => {
        const MAIN_FILE = './python/wts.json';
        let reply = '';
        let user = '';
        let userData = '';
        let userFilePath = '';
        let userFile = '';
        let userRequestFilterFile = '';
        let userResponseFilterFile = '';
        let userResultList = [];
        let firstFilter = [];
        let dataToWriteInTheUserListFile = '';
        let wholeListOfItems = [];
        let itemsListJSON = '';

        if (message.author.bot) return;
        if (!message.content.startsWith('!list') && !message.content.startsWith('!mylist')) return;
        if (message.channel.id !== INPUT_CHANNEL) return;

        if (message.content.startsWith('!mylist')) {
                userFile = await readUserFile(`./userLists/${message.author.username}.json`);

                setTimeout(() => {
                        userRequestFilterFile = processUserInput(userFile, 'request');
                        reply = listUserDiseredItems(userRequestFilterFile);
                        try {
                                outputChannelCache.send(`${reply}`);
                        } catch (err) {
                                console.error('Failed to send message', err);
                        }
                }, 1000);
        } else {
                let items = message.content
                        .replace('!list', '')
                        .split(',')
                        .map((i) => i.trim())
                        .filter(Boolean);

                console.log('Now filtering', items);
                message.reply(`Filtering ${items}`);

                if (items.length === 0) {
                        return message.reply('Insert a list of items');
                }

                if (!outputChannelCache) {
                        outputChannelCache = await client.channels.fetch(OUTPUT_CHANNEL);
                }

                wholeListOfItems = await readUserFile(MAIN_FILE);
                itemsListJSON = JSON.parse(wholeListOfItems);

                user = `${message.author.username}`;
                userData = { request: items.toString(), response: '' };
                userFilePath = `./userLists/${user}.json`;

                userFile = await readUserFile(userFilePath, userData);
                if (!userData || (userData.request && userData.request.length < 1)) {
                        writeUserFile(userData, userFilePath);
                        userFile = JSON.stringify(userData);
                }

                setTimeout(() => {
                        let responseArray = [];
                        userRequestFilterFile = processUserInput(userFile, 'request');
                        let parsedFile = JSON.parse(userFile);
                        console.log('parsed_file: ', parsedFile, parsedFile.reseponse);
                        console.log('userFile: ', userFile);

                        firstFilter = filterItemsListWithUserInput(
                                userRequestFilterFile,
                                itemsListJSON,
                                firstFilter,
                        );

                        if (parsedFile && parsedFile.response.length > 0) {
                                console.log('response_filter: ', userResponseFilterFile);
                                userResultList = filterResultListWithUserPreviousResponse(
                                        userResponseFilterFile,
                                        firstFilter,
                                        userResultList,
                                        parsedFile,
                                );
                        } else {
                                userResultList = firstFilter;
                        }

                        if (!userResultList || userResultList.length < 1) return;

                        reply = writeReply(reply);

                        for (let index of userResultList) {
                                responseArray.push(index);
                        }
                        console.log('response_array: ', responseArray);

                        dataToWriteInTheUserListFile = {
                                request: userRequestFilterFile,
                                response: responseArray,
                        };
                        writeUserFile(dataToWriteInTheUserListFile, userFilePath);

                        try {
                                outputChannelCache.send(`${reply}`);
                        } catch (err) {
                                console.error('Failed to send message', err);
                        }
                }, 100);
                //TODO: regex to convert srting type item value to number
                //TODO: validations for filtering whole list and for user lists iterations
                //TODO: command for retrieving user list of items and for diferentiation between add items and overriting
        }
});

client.login(process.env.TOKEN);
