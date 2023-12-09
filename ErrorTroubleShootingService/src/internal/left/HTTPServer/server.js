const express = require("express")
const app = express();
const {ElasticSearchAPI} = require("./API/elaticSearch")


class HTTPServerApp{
    constructor(port, coreApp){
        this.port = port
        this.coreApp = coreApp
    }

    startApp(){
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        
        ElasticSearchAPI(app, this.coreApp)

        app.listen(this.port, ()=>console.log("litsening at port"+this.port))

    }
}

module.exports = {HTTPServerApp}