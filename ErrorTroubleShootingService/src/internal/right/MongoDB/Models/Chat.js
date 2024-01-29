const {Schema, model} = require("mongoose")

const ChatSchema = new Schema({
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "message",
    }],
    threadID: {
        type: String,
    }
})

const ChatModel = model("chat", ChatSchema);
module.exports = {ChatModel}