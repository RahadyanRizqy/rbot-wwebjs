const aboutCaption = (userName) => `★═══[🤖BOT]═══★
Hai 👋 ${userName}, versi paling sederhana ini masih difokuskan untuk keperluan sticker dan gif. Bila ada permasalahan, error, respon tidak sesuai silahkan bisa lapor ke admin 👨‍💻. (Admin bilek: 😎)

★═══[❓HELP]═══★
r.help

★═══[🦉ADMIN]═══★
WhatsApp: https://wa.me/6288804897436
LinkedIn: https://www.linkedin.com/in/rahadyan-rizqy
GitHub: https://github.com/RahadyanRizqy

★═══[🗒️NOTE]═══★
◆ Untuk konversi video menjadi sticker/gif mungkin agak lama dikit
◆ Cek maintenance/tidak di status profil bot wa
◆ Maintenance dilakukan tiap akhir pekan Sabtu 09.00 (WIB) +7

★═══[🙏MUCH THX]═══★
☞ https://wwebjs.dev/
☞ https://github.com/DrelezTM
☞ https://github.com/zarlicho

★═══[Proxmox VE ⓧ]═══★
SELF-HOSTED CHATBOT
container-id: 108 
hostname: ubct-rbot-wwebjs`;

const helpMsg = `★═══[☝️CMDS]═══★
r.help
-> menampilkan command dan help ini

r.sticker author?.name?
-> ubah media jadi sticker 
-> cth cmd: r.sticker / r.sticker my.sticker / r.sticker lucu_banget.lho_rek
-> untuk spasi masih menggunakan underscore _
-> r.sticker saja maka default ©r-bot • 6288989126165

r.epoch now? (format: DD-MM-YYYY.HH:MM:SS)
-> ubah hari ini/datetime menjadi UNIX timestamp
-> cth cmd: r.epoch / r.epoch 11-11-2002.08:45:00

r.about
-> tentang pembuat`;

module.exports = { aboutCaption, helpMsg }; 