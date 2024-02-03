const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');

const { aboutCaption, helpMsg, featureMsg } = require('./statics/caption');
const { bmhdb } = require('./utils/BMHDatabase');
const { BotMessageHandler } = require('./utils/BotMessageHandler');
const { EnumMessageHandler } = require('./utils/EnumMessageHandler');
const { logErrorToFile } = require('./utils/Functions');

const config  = require('./config.json');

moment.tz.setDefault(config.timezone);

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
        logErrorToFile(error.toString());
    }
});

client.initialize();