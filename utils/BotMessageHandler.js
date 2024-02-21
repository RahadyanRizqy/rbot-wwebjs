const { logErrorToFile } = require('./Functions');

class SessionHandler {
    constructor(something) {
        // Dah bingung mo ngoding apa...
    }
}

class BotMessageHandler {
    constructor(client, message, enumMessageHandler, database, config) {

        // --- BOT SCOPE VARIABLE --- //
        this.client = client;
        this.message = message;
        this.enumMessageHandler = enumMessageHandler;
        this.database = database;
        this.config = config;
        //----------------------------//

        // --- INPUT SCOPE VARIABLE --- //
        this.isBlank = false; // False due to all messages are expected to be is not blank
        //------------------------------//

        // --- CHAT SCOPE VARIABLE --- //
        this.isGroupChat = false; // true if msg.from has @g.us
        this.isPrivateChat = false; // true if msg.from has @c.us
        //-----------------------------//

        // --- USER SCOPE VARIABLE --- //
        this.isFromOwner = false; // False due to all messages are
        this.clientAbout = client.selfAbout;
        //-----------------------------//

        // -- MESSAGE BODY SCOPE VARIABLE --- //
        this.isMentioned = false;
        this.isCommand = false;
        this.isConvo = false;
        this.sessionId = "";
        this.prefix = config.botPrefix;
        this.argparser = config.botArgparser;
        this.command = "";
        this.arguments = [];
        this.classType = -1; // 1 admin, 2 normal
        this.validInput = true; // validating if it has prefix or argparser
        //------------------------------------//

        // --- INPUT SCOPE CONDITION --- //
        let mBody = this.message.body.split(" ");
        let command = mBody.shift();
        let args = mBody;
        if (command.includes('\u200E') || /^\s*$/.test(command) || /\s/.test(command)) { this.isBlank = true; }
        //-------------------------------//

        // --- CHAT SCOPE CONDITION --- //
        if (this.message.from.includes('@g.us')) { this.isGroupChat = true; }
        if (this.message.from.includes('@c.us')) { this.isPrivateChat = true; }
        //------------------------------//

        // --- USER SCOPE CONDITION --- //
        if (this.message.from.includes(this.config.ownerPhone)) { this.isFromOwner = true; }
        //------------------------------//

        // --- MESSAGE BODY SCOPE CONDITION --- //
        if (this.message.mentionedIds.includes(this.client.info.wid._serialized)) { this.isMentioned = true; }
        if (Object.keys(this.database.convo).includes(command)) { this.isConvo = true; }
        if (this.prefix !== null && !(command.startsWith(this.prefix))) { this.validInput = false; }
        if (command.startsWith(this.prefix)) { command = command.split(this.prefix)[1]; }
        if (Object.keys(this.database.command).includes(command)) { this.isCommand = true; }
        if (this.argparser !== null && args.length === 1 && args[0].includes(this.argparser)) { args = args[0].split(this.argparser); }
        if (this.isCommand) { this.classType = this.database.command[command].classType; }
        //--------------------------------------//

        this.command = command;
        this.arguments = args;

        // --- BOT MESSAGE HANDLER DATA --- //
        this._bmhData = {
            isBlank: this.isBlank,
            isGroupChat: this.isGroupChat,
            isMentioned: this.isMentioned,
            isConvo: this.isConvo,
            isCommand: this.isCommand,
            isPrivateChat: this.isPrivateChat,
            isFromOwner: this.isFromOwner,
            command: this.command,
            arguments: this.arguments,
            classType: this.classType,
            validInput: this.validInput
        }
        //----------------------------------//
    }

    async listenPrivate() { // LISTENING AND ANSWERING PRIVATE MESSAGES
        try {
            if (!this.isBlank) {
                if (this.isPrivateChat) {
                    const _dbcmd = this.database.command;
                    const _dbabout = this.database.about;
                    const _clientAbout = await (await this.client.getContactById(this.client.info.wid._serialized)).getAbout();
                    switch (_clientAbout) {
                        case 'Online': // IF ONLINE
                            if (this.isCommand && this.validInput) {
                                if (this.isFromOwner || this.classType === 2) {
                                    if (_dbcmd[this.command].hasOwnProperty('handler')) { await this.enumMessageHandler[_dbcmd[this.command].handler](this); }
                                }
                                else { await this.enumMessageHandler[_dbcmd.else.handler](this); }
                            }
                            // else if (this.isSession && this.validInput) {
                                
                            // }
                            else { await this.enumMessageHandler[_dbcmd.else.handler](this); }
                            break;
                        case 'Maintenance': // IF MAINTENANCE
                            if (!this.isFromOwner) { await this.client.sendMessage(this.message.from, _dbabout[1].answer); }
                            else {
                                if (this.isCommand && this.validInput) {
                                    if (_dbcmd[this.command].hasOwnProperty('handler')) { await this.enumMessageHandler[_dbcmd[this.command].handler](this); }
                                }
                                else { await this.enumMessageHandler[_dbcmd.else.handler](this); }
                            }
                            break;
                        case 'Offline': // IF (GOING) OFFLINE
                            await this.client.sendMessage(this.message.from, _dbabout[0].answer);
                            break;
                        default:
                            await this.client.sendMessage(this.message.from, "*NO STATUS*");
                            break;
                    }
                }
            }
        }
        catch (error) { 
            logErrorToFile(error.toString(), this.config);
            await this.client.sendMessage(this.message.from, "Bisa dicoba lagi?");
        }
    }

    async listenGroup(roleMention="@") {
        try { }
        catch (error) { console.error(error); }
    }
}

module.exports = { BotMessageHandler };