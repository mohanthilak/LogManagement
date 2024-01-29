const {ChatModel} = require("../Models/Chat");

class ChatRepo {
    async CreateChat({messageID, threadID}){
        try {
            const chat = new ChatModel({});
            chat.messages = [messageID];
            chat.threadID = threadID;
            await chat.save();
            return {success: true, data: chat, error: false}
        } catch (error) {
            console.log("error while creating a chat:", error);
            return {success: false, data: null, error}
        }
    }
}

module.exports = {ChatRepo};