const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const { aboutCaption, helpMsg } = require('./statics/caption');
const config = require('./config.json');
const status = `${config.status}`;

moment.tz.setDefault(config.timezone);

const client = new Client({
    puppeteer: {
        headless: true,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    },
    ffmpeg: './ffmpeg.exe',
    authStrategy: new LocalAuth({ clientId: 'wabot-wwebjs'}),
});

function logErrorToFile(errorMsg) {
    const logDirectory = 'log';
    const timestamp = moment().format('DD-MM-YYYY-HH-mm-ss'); // Format timestamp in local time
    const logFilePath = path.join(logDirectory, `${timestamp}.log`);

    // Create the log directory if it doesn't exist
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    // Write the error message to the log file
    fs.appendFile(logFilePath, errorMsg + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

function fileExists(filePath) {
    try {
        // Check if the file exists
        fs.statSync(filePath);
        return true;
    } catch (error) {
        // File does not exist or other error occurred
        return false;
    }
}

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
                const argument = msgBody[1] ? (
                                    msgBody[1].includes(".") ? // IF THERE IS DOT 
                                        msgBody[1].split(".") : // THEN SPLIT
                                            msgBody[1] // ELSE GET THE ARGUMENT
                                                ) : null; // IF THERE IS NO ARG THEN NULL
                if (command === 'sticker') {
                    if (msg.hasMedia) {
                        const media = await msg.downloadMedia();
                        client.sendMessage(msg.from, 'Loading...');
                        let stickerAuthor = "";
                        let stickerName = "";
                        if (argument !== null) {
                            if (argument.length === 2) {
                                stickerAuthor = argument[0].includes("_") ? argument[0].split("_").join(" ") : argument[0];
                                stickerName = argument[1].includes("_") ? argument[1].split("_").join(" ") : argument[1];
                            } else if (argument.length){
                                stickerAuthor = `${config.author}`;
                                stickerName = argument.includes("_") ? argument.split("_").join(" ") : argument;
                            }                            
                        }
                        else {
                            stickerAuthor = `${config.author}`;
                            stickerName = `${config.name}`;
                        }
                        client.sendMessage(msg.from, media, {
                            sendMediaAsSticker: true,
                            stickerName: stickerName,
                            stickerAuthor: stickerAuthor
                        });
                        msg.delete();
                    }
                    else {
                        client.sendMessage(msg.from, 'Media tidak dicantumkan!');
                    }
                }
                else if (command === 'about') {
                    let adminProfile = null;
                    if (fileExists('./statics/admin.jpg')) {
                        adminProfile = MessageMedia.fromFilePath('./statics/admin.jpg');
                    } else {
                        adminProfile = await MessageMedia.fromUrl('https://fastly.picsum.photos/id/866/300/300.jpg?hmac=9qmLpcaT9TgKd6PD37aZJZ_7QvgrVFMcvI3JQKWVUIQ');
                    }
                    const userName = (await msg.getContact()).pushname;
                    client.sendMessage(msg.from, adminProfile, {
                        caption: `${aboutCaption(userName) ?? 'your about'}`
                    });
                }
                else if (command === 'help') {
                    client.sendMessage(msg.from, `${helpMsg(prefix) ?? 'your help message'}`);
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
                else {
                    client.sendMessage(msg.from, 'Command tidak tersedia. Silahkan *.help*');
                }
            }
            else {
                client.sendMessage(msg.from, 'Tidak jelas, mangsud? 🤨 *.help*');
            }

        } else if (status === 'maintenance') {
            client.sendMessage(msg.from, 'Sedang maintenance mohon bersabar 😗');
        } else {
            client.sendMessage(msg.from, 'Segera offline...');
        }
    }
    catch (error) {
        console.log(error);
        logErrorToFile(error.toString());
        client.sendMessage(msg.from, 'Ada error! 😵‍💫');
        client.setStatus('Terjadi error!');
    }
    // finally {
    //     // console.log(msg);
    //     msg.delete();
    // }
});

client.initialize();