const aboutCaption = (userName) => `★═══[🤖BOT]═══★
Hai 👋 ${userName}, versi paling sederhana ini masih difokuskan untuk keperluan sticker dan gif. Bila ada permasalahan, error, respon tidak sesuai silahkan bisa lapor ke admin 👨‍💻. (Admin bilek: 😎)

★═══[❓HELP]═══★
.help

★═══[🦉ADMIN]═══★
WhatsApp: https://wa.me/6288804897436
LinkedIn: https://www.linkedin.com/in/rahadyan-rizqy
GitHub: https://github.com/RahadyanRizqy

★═══[🗒️NOTE]═══★
◆ Untuk konversi video menjadi sticker/gif mungkin agak lama dikit
◆ Cek maintenance/tidak di status profil bot wa
◆ Maintenance dilakukan tiap akhir pekan Sabtu 09.00 (WIB) +7
◆ Atau kalau error wkwkwk

★═══[🙏MUCH THX]═══★
☞ https://wwebjs.dev/
☞ https://github.com/DrelezTM
☞ https://github.com/zarlicho

★═══[Proxmox VE ⓧ]═══★
SELF-HOSTED CHATBOT
container-id: 108 
hostname: ubct-rbot-wwebjs`;

const helpMsg = (prefix) => `★═══[☝️CMDS]═══★
${prefix}help
-> menampilkan command dan help ini

${prefix}sticker author?.name?
-> ubah media jadi sticker 
-> cth cmd: ${prefix}sticker / ${prefix}sticker my.sticker / ${prefix}sticker lucu_banget.lho_rek
-> untuk spasi masih menggunakan underscore _
-> ${prefix}sticker saja maka default ©r-bot • 6288989126165

${prefix}epoch now? (format: DD-MM-YYYY.HH:MM:SS)
-> ubah hari ini/datetime menjadi UNIX timestamp
-> cth cmd: ${prefix}epoch / ${prefix}epoch 11-11-2002.08:45:00

${prefix}about
-> tentang pembuat`;

module.exports = { aboutCaption, helpMsg }; 