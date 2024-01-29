const {Schema, model} = require("mongoose")

const ErrorSchema = new Schema({
    log: {
        type: String,
    },
    context: {
        type: String,
    },
    conversation:{
        type: Schema.Types.ObjectId,
        ref: "chat",
    },
    socketID: {
        type: String,
    }
})

const ErrorModel = model("error", ErrorSchema);
module.exports = {ErrorModel};