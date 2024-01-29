const {MessageModel} = require("../Models/Message")

class MessageRepo {
    async CreateMessage({text, sentBy}){
        try {
            const message = new MessageModel({text, sentBy});
            await message.save();
            return {success: true, data: message, error: null};
        } catch (error) {
            console.log("error while creating a new message in mongo:", error);
            return {success: false, data: null, error}
        }
    }
}

module.exports = {MessageRepo};