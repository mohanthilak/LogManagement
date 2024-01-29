const dotenv = require("dotenv")
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === "dockerdev") dotenv.config({path: "./docker.env"})
else dotenv.config()

const OPEN_AI_SECRET_KEY= process.env.OPEN_AI_SECRET_KEY;
const OPEN_AI_ASSISTANT_ID= process.env.OPEN_AI_ASSISTANT_ID;
const MONGO_URL = process.env.MONGO_URL;


module.exports = {OPEN_AI_SECRET_KEY, OPEN_AI_ASSISTANT_ID, MONGO_URL};
