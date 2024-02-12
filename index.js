const { Client, LocalAuth }= require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { exec } = require('child_process');

const { bmhdb } = require('./utils/BMHDatabase.js');
const { BotMessageHandler } = require('./utils/BotMessageHandler.js');
const { EnumMessageHandler } = require('./utils/EnumMessageHandler.js');
const { logErrorToFile } = require('./utils/Functions.js');

const config = require('./config.json');

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