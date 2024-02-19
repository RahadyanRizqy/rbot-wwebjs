const { Client, LocalAuth }= require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const { nanoid } = require('nanoid');

const { bmhdb } = require('./utils/BMHDatabase.js');
const { BotMessageHandler } = require('./utils/BotMessageHandler.js');
const { EnumMessageHandler } = require('./utils/EnumMessageHandler.js');
const { logErrorToFile } = require('./utils/Functions.js');

const config = require('./config.json');

const client = new Client({
    puppeteer: {
        headless: true,
        // executablePath: '/usr/bin/google-chrome-stable',
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    },
    ffmpeg: './ffmpeg.exe',
    authStrategy: new LocalAuth({ clientId: `${config.clientId}`}),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    client.setStatus(bmhdb.about[config.about].info);
    console.log(`Client is ${bmhdb.about[config.about].info}!`);
    // console.log(client);
});

class ConvoHandler {
    constructor(client, message) {

    }
}

const convo = {};
let currentSessionId = '';
client.on('message', async (message) => {
    try {
        const _bmh = new BotMessageHandler(client, message, EnumMessageHandler, bmhdb, config);
        _bmh.listenPrivate();
        console.log(_bmh._bmhData);
        // if (message.body === 'start') {
        //     const uniqueId = nanoid();
        //     currentSessionId = `convoId-${uniqueId}`;
        //     convo[currentSessionId] = {
        //         command: 'start',
        //         sent: ['Mari kita mulai...', 'Nama kamu siapa?'],
        //         received: []
        //     }
        //     client.sendMessage(message.from, 'Mari kita mulai...');
        //     client.sendMessage(message.from, 'Nama kamu siapa?');
        // }
        // else {
        //     if (Object.keys(convo).includes(currentSessionId)) {
        //         if (convo[currentSessionId].command === 'start') {
        //             let questionCount = 1;
        //             if (questionCount > 0) {
        //                 convo[currentSessionId].received.push(message.body);
        //                 client.sendMessage(message.from, 'Sebutkan fakta menarik tentangmu!');
        //                 convo[currentSessionId].sent.push('Sebutkan fakta menarik tentangmu!');
        //                 // convo[currentSessionId].received.push(message.body);
        //                 questionCount -= 1;
        //             }
        //             console.log(questionCount);
        //             client.sendMessage(message.from, `Nama kamu ${convo[currentSessionId].received[0]}\n Fakta menarik: ${convo[currentSessionId].received[1]}`);
        //         }
        //     }
        // }
        // console.log(convo);
    } catch (error) {
        // logErrorToFile(error.toString(), config);
        // console.error(error.message);
        if (error.message.includes('ERR_NETWORK_CHANGED')) {
            exec('./restart.sh');
        }
        else {
            logErrorToFile(error.toString(), config);
            exec('./restart.sh');
        }
    }
});

client.initialize();