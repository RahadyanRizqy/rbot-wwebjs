const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { bmhdb } = require('./utils/BMHDatabase');
const { BotMessageHandler } = require('./utils/BotMessageHandler');
const { EnumMessageHandler } = require('./utils/EnumMessageHandler');
const { logErrorToFile } = require('./utils/Functions');

const config  = require('./config.json');

const client = new Client({
    puppeteer: {
        headless: true,
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

client.on('message', async (message) => {
    try {
        const _bmh = new BotMessageHandler(client, message, EnumMessageHandler, bmhdb, config);
        _bmh.listenPrivate();
        console.log(_bmh._bmhData);
    } catch (error) {
        logErrorToFile(error.toString(), config);
    }
});

client.initialize();