const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { aboutCaption, helpMsg } = require('./statics/caption');
const client = new Client({
    puppeteer: {
        headless: true,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    },
    ffmpeg: './ffmpeg.exe',
    authStrategy: new LocalAuth({ clientId: 'wabot-wwebjs'}),
});
const config = require('./config.json');
const status = `${config.status}`;
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    if (status === 'online') {
        client.setStatus('Online 24/7');
        console.log('Client is ready!');

    } else if (status === 'maintenance') {
        client.setStatus('Mohon maaf sedang maintenance 🙏');
        console.log('Client is in maintenance');

    } else {
        client.setStatus('Offline 😴');
        console.log('Unavailable');
    }
});

client.on('message', async (msg) => {
    try {
        const isGroupMsg = msg.from.endsWith('@g.us') ? true : false;
        
        const prefix = `${config.prefix}`;
        if (status === 'online') {
            if (msg.body.startsWith(prefix)) {
                const msgBody = msg.body.split(" ");
                const command = msgBody[0].split(".")[1];
                const argument = msgBody[1] ? msgBody[1].split(".") : null;
                if (command === 'sticker') {
                    if (msg.hasMedia) {
                        const media = await msg.downloadMedia();
                        client.sendMessage(msg.from, 'Loading...');
                        client.sendMessage(msg.from, media, {
                            sendMediaAsSticker: true,
                            stickerName: argument ? argument[0].split("_").join(" ") : `${config.name}`,
                            stickerAuthor: argument ? argument[1].split("_").join(" ") : `${config.author}`
                        });
                    }
                    else {
                        client.sendMessage(msg.from, 'Media tidak dicantumkan!');
                    }
                }
                else if (command === 'about') {
                    const admin_profile = MessageMedia.fromFilePath('./statics/admin.jpg');
                    const userName = (await msg.getContact()).pushname;
                    client.sendMessage(msg.from, admin_profile, {
                        caption: aboutCaption(userName)
                    });
                }
                else if (command === 'help') {
                    client.sendMessage(msg.from, helpMsg);
                }
                else if (command === 'greet') {
                    // client.sendMessage(msg.from, `@${contact.id.user}`, { mentions: [contact]}); TAG A USER
                    client.sendMessage(msg.from, `Halo 👋 ${(await msg.getContact()).pushname}`);
                }
                else if (command === 'epoch') {
                    const currentTime = Date.now();
                    if (argument) {
                        const [day, month, year] = argument[0] ? argument[0].split('-').map(Number) : null;
                        const [hours, minutes, seconds] = argument[1] ? argument[1].split(':').map(Number) : '00:00:00'.split(':').map(Number);
                        const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
                        if (dateObject.getTime().toString().includes('-')) {
                            client.sendMessage(msg.from, "Tanggal tidak valid (format: DD-MM-YYYY.HH:MM:SS)");
                        } else {
                            client.sendMessage(msg.from, `${dateObject.getTime()}`);
                        }
                    }
                    else {
                        client.sendMessage(msg.from, `${currentTime}`);
                    }
                }
            }
            else {
                client.sendMessage(msg.from, 'Tidak jelas, mangsud? 🤨');
            }

        } else if (status === 'maintenance') {
            client.sendMessage(msg.from, 'Sedang maintenance mohon bersabar 😗');
        } else {
            client.sendMessage(msg.from, 'Segera offline...');
        }
    }
    catch (error) {
        console.log(error);
        client.sendMessage(msg.from, 'Ada error! 😵‍💫');
    }
    finally {
        console.log(msg);
        msg.delete();
    }
});

client.initialize();