const { fileExists, checkFileFromUrl, formatDateTimeNow } = require('./Functions.js');
const { MessageMedia } = require('whatsapp-web.js');

// MULTILINE / LONG MESSAGES
const helpMsg = (botPrefix) => `★═══[☝️CMDS]═══★
${botPrefix}about
-> tentang pembuat

${botPrefix}help
-> menampilkan command dan help ini

${botPrefix}sticker name author
-> ubah media jadi sticker 
-> cth cmd: ${botPrefix}sticker / ${botPrefix}sticker sticker saya / ${botPrefix}sticker lucu_banget lho_rek
-> untuk spasi masih pakai underscore _
-> ${botPrefix}sticker saja maka default made by • r-bot@rdnrzq

${botPrefix}epoch now (format: DD-MM-YYYY.HH:MM:SS)
-> ubah hari ini/datetime menjadi UNIX timestamp
-> cth cmd: ${botPrefix}epoch / ${botPrefix}epoch 11-11-2002.08:45:00

${botPrefix}feature
-> daftar fitur bot ini`;

const aboutMsg = (userName, botPrefix) => `★═══[🤖R-BOT]═══★
Hai 👋 ${userName}, versi *v1.31-stable* paling sederhana ini masih difokuskan untuk keperluan sticker dan gif. Bila ada saran, permasalahan, error, respon tidak sesuai silahkan bisa lapor ke admin 👨‍💻. (Admin bilek: 😎)

★═══[❓HELP]═══★
${botPrefix}help

★═══[🦉ADMIN]═══★
WhatsApp: https://wa.me/6288804897436
IG: https://instagram.com/rdn_rzq
GitHub: https://github.com/RahadyanRizqy

★═══[🗒️NOTE]═══★
◆ Untuk konversi video menjadi sticker/gif mungkin agak lama dikit
◆ Untuk konversi gambar transparan (.PNG) menggunakan document
◆ Cek maintenance/tidak di status profil bot wa
◆ Maintenance dilakukan tiap akhir pekan Sabtu 09.00 (WIB) +7
◆ Atau kalau ada error dan perubahan yang urgent

★═══[🙏MUCH THX]═══★
☞ https://wwebjs.dev/
☞ https://github.com/DrelezTM
☞ https://github.com/zarlicho

★═══[Proxmox VE ⓧ]═══★
SELF-HOSTED CHATBOT
container-id: 108 
hostname: ubct-rbot-wwebjs`;

const featureMsg = `★═══[🧐FEATURES]═══★
① ubah gambar/video jadi sticker
② ubah hari ini jadi epoch/UNIX timestamp
③ koleksi sticker hari ini*
④ shorter link (random)* s.id/bit.ly/sh.rdnet.id

(*)TBA`;

async function elseHandler(z) {
    const botPrefix = z.config.botPrefix === null ? '' : z.config.botPrefix;
    await z.client.sendMessage(z.message.from, `Tidak jelas, mangsud? 🤨 *${botPrefix}help*`);
}

async function onHandler(z) {
    await z.client.sendMessage(z.message.from, "*[Admin]* Bot online!");
    await z.client.setStatus("Online");
}

async function offHandler(z) {
    await z.client.sendMessage(z.message.from, "*[Admin]* Bot akan offline!");
    await z.client.setStatus("Offline");
}

async function haltHandler(z) {
    await z.client.sendMessage(z.message.from, "*[Admin]* Bot maintenance!");
    await z.client.setStatus("Maintenance");
}

async function aboutHandler(z) {
    const localProfilePath = `${z.config.storageDirectoryLocal}/admin.jpg`;
    adminProfile = MessageMedia.fromFilePath(localProfilePath);
    const userName = (await z.message.getContact()).pushname;
    const botPrefix = z.config.botPrefix === null ? '' : z.config.botPrefix;
    await z.client.sendMessage(z.message.from, adminProfile, 
        {
            caption: aboutMsg(userName, botPrefix) ?? 'Belum ditambahkan'
        }
    );
}

async function epochHandler(z) {
    const nowDateTime = formatDateTimeNow(z.config.timezone, 'dd-MM-yyyy HH:mm:ss');
    const nowEpoch = Date.now();
    if (z.arguments.length > 0) {
        const [day, month, year] = z.arguments[0] ? z.arguments[0].split('-').map(Number) : null;
        const [hours, minutes, seconds] = z.arguments[1] ? z.arguments[1].split(':').map(Number) : '00:00:00'.split(':').map(Number);
        const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
        if (dateObject.getTime().toString().includes('-')) {
            await z.client.sendMessage(z.message.from, "Tanggal tidak valid (format: DD-MM-YYYY HH:MM:SS) cth: 11-11-2002 08:45:00");
        } else {
            await z.client.sendMessage(z.message.from, `${dateObject.getTime()}`);
        }
    }
    else {
        const epochMsg = (a, b) => `Tanggal saat ini *${a}*\n\nEpoch saat ini *${b}*`;
        await z.client.sendMessage(z.message.from, epochMsg(nowDateTime, nowEpoch));
    }
    // const currentTime = Date.now();
    // await z.client.sendMessage(z.message.from, `${currentTime}`);
}

async function greetHandler(z) {
    await z.client.sendMessage(z.message.from, `Halo 👋 ${(await z.message.getContact()).pushname}`);
}

async function helpHandler(z) {
    const botPrefix = z.config.botPrefix === null ? '' : z.config.botPrefix;
    await z.client.sendMessage(z.message.from, helpMsg(botPrefix) ?? 'Belum ditambahkan');
}

async function featureHandler(z) {
    await z.client.sendMessage(z.message.from, featureMsg ?? 'Belum ditambahkan');
}

async function stickerHandler(z) {
    if (z.message.hasMedia) {
        const media = await z.message.downloadMedia();
        await z.client.sendMessage(z.message.from, 'Loading...');
        let stickerAuthor = "";
        let stickerName = "";
        if (z.arguments.length > 0) {
            if (z.arguments.length === 2) {
                stickerAuthor = `${(z.arguments[1].includes("_") ? z.arguments[1].split("_").join(" ") : z.arguments[1])} • ${z.config.author}`;
                stickerName = z.arguments[0].includes("_") ? z.arguments[0].split("_").join(" ") : z.arguments[0];
            } else {
                stickerAuthor = `${z.config.author}`;
                stickerName = z.arguments[0].includes("_") ? z.arguments[0].split("_").join(" ") : z.arguments[0];
            }                            
        }
        else {
            stickerAuthor = `${z.config.author}`;
            stickerName = `${z.config.name}`;
        }
        await z.client.sendMessage(z.message.from, media, {
            sendMediaAsSticker: true,
            stickerName: stickerName,
            stickerAuthor: stickerAuthor
        });
        await z.message.delete();
    }
    else {
        await z.client.sendMessage(z.message.from, 'Media tidak dicantumkan!');
    }
    // await z.client.sendMessage(z.message.from, 'Belum ditambahkan');
}

const EnumMessageHandler = {
    elseHandler,
    // elseHandler: elseHandler,
    
    onHandler,
    offHandler,
    haltHandler,

    aboutHandler,
    epochHandler,
    featureHandler,
    greetHandler,
    helpHandler,
    stickerHandler,
}

module.exports = { EnumMessageHandler };