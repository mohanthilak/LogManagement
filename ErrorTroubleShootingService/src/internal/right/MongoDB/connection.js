const mongoose = require('mongoose')
const {MONGO_URL} = require("../../../config/index")

const makeConnection = ()=>{
    console.log({MONGO_URL})
    mongoose.connect(MONGO_URL).then((data)=>console.log("mongo connected")).catch((e)=>console.log("couldn't make the mongo connection:",e))
}

module.exports = {makeConnection}