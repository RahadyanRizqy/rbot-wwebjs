const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const client = new Client({
    puppeteer: {
        headless: false,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    },
    ffmpeg: './ffmpeg.exe',
    authStrategy: new LocalAuth({ clientId: 'wabot-wwebjs-arcueid'}),
});
const config = require('./config.json');
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    try {
        const isGroupMsg = msg.from.endsWith('@g.us') ? true : false;
        const prefix = `${config.prefix}`;
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
                const aboutCaption = `★═══[🤖BOT]═══★
    Hai 👋, versi paling sederhana ini masih difokuskan untuk keperluan sticker dan gif. Bila ada permasalahan, error, respon tidak sesuai silahkan bisa lapor ke admin 👨‍💻. (Admin bilek: 😎)
    
    ★═══[❓HELP]═══★
    r.help
    
    ★═══[🦉ADMIN]═══★
    WhatsApp: https://wa.me/6288804897436
    LinkedIn: https://www.linkedin.com/in/rahadyan-rizqy
    GitHub: https://github.com/RahadyanRizqy
    
    ★═══[🗒️NOTE]═══★
    ◆ Untuk konversi video menjadi sticker/gif mungkin agak lama dikit`
                client.sendMessage(msg.from, admin_profile, {
                    caption: aboutCaption
                });
            }
            else if (command === 'help') {
                const helpBody = `★═══[🗣️‼️CMDS]═══★
r.help
-> menampilkan command dan help ini

r.sticker author?.name?
-> ubah media jadi sticker cth cmd: r.sticker / r.sticker my.sticker / r.sticker lucu_banget.lho_rek

r.about
-> tentang pembuat`
                client.sendMessage(msg.from, helpBody);
            }
            else if (command === 'confess') {
                const parts = msg.body.match(/^(\S+)\s+(\d+)\.\[(.*?)\]$/);

                // const confessMsg = argument ? argument[1] : null;
                // if (!phoneNumber || !confessMsg) {
                //     client.sendMessage(msg.from, 'Salah satu/dua argumen kosong!');
                // }
                // const regex = /\[(.*?)\]/;
                // const match = regex.exec(confessMsg);
                // if (match) {
                //     client.sendMessage(`${phoneNumber}@c.us`, match[1]);
                // } else {
                //     throw new Error();
                // }
                // client.sendMessage(msg.from, `Command: ${parts[1]} Tujuan: ${parts[2]} Pesan: ${parts[3]}`);
                client.sendMessage(msg.from, "To be continued...");
            }
        }
        else {
            client.sendMessage(msg.from, 'Tidak jelas, mangsud? 🤨');
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