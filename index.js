const { Client, LocalAuth, MessageMedia }= require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');
const { nanoid } = require('nanoid');
const fs = require('fs');
const filePath = './statics/db.json';
const os = require('os');

// convo db

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('./statics/db.json');
// const db = low(adapter);

// db.defaults({ convoDb: { convos: [] } }).write();

const { bmhdb } = require('./utils/BMHDatabase.js');
const { BotMessageHandler } = require('./utils/BotMessageHandler.js');
const { EnumMessageHandler } = require('./utils/EnumMessageHandler.js');
const { logErrorToFile } = require('./utils/Functions.js');

const config = require('./config.json');

let client;

if (os.platform() === 'linux') {
    client = new Client({
        puppeteer: {
            headless: true,
            executablePath: '/usr/bin/google-chrome-stable',
            args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
        },
        ffmpeg: './ffmpeg.exe',
        authStrategy: new LocalAuth({ clientId: `${config.clientId}`}),
    });
} else {
    client = new Client({
        puppeteer: {
            headless: true,
            // executablePath: '/usr/bin/google-chrome-stable',
            args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
        },
        ffmpeg: './ffmpeg.exe',
        authStrategy: new LocalAuth({ clientId: `${config.clientId}`}),
    });
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    client.setStatus(bmhdb.about[config.about].info);
    console.log(`Client is ${bmhdb.about[config.about].info}!`);
    // console.log(client);
});

// let convoDb = {};
class ConvoHandler {
    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.userId = message.from;
    }

    async listenConvo() {
        if (this.message.body === 'start') {
            if (sendCount !== messsagesToSend.length) {
                await this.client.sendMessage(this.message.from, 'Mari kita mulai...');
                convoDb[this.userId] = {
                    command: 'start',
                    sent: [messsagesToSend[sendCount]]
                }
                await this.client.sendMessage(this.message.from, `${messsagesToSend[sendCount]}`);
                sendCount += 1;
            }
        }
        else {
            if (Object.keys(convoDb).includes(this.message.from)) {
                if (convoDb[this.message.from].command === 'start' & sendCount !== messsagesToSend.length) {
                    convoDb[this.userId].received.push(this.message.body);
                    convoDb[this.userId].sent.push(messsagesToSend[sendCount]);
                    sendCount += 1;
                }
            }
        }
        console.log(convoDb); 
    }
}

let messsagesToSend = ['Nama kamu siapa?', 'Rumah kamu dimana?', 'Sebutkan fakta menarik tentangmu!'];
let messagesToReceive = [];

client.on('message', async (message) => {
    try {
        const _bmh = new BotMessageHandler(client, message, EnumMessageHandler, bmhdb, config);
        _bmh.listenPrivate();
        // console.log(_bmh._bmhData);
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