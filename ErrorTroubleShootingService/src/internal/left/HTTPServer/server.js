const express = require("express")
const app = express();
const {ElasticSearchAPI} = require("./API/elaticSearch")

// const http = require("http");
// const { Server } = require("socket.io");



class HTTPServerApp{
    constructor(port, coreApp){
        this.port = port
        this.coreApp = coreApp
        // this.server = http.createServer(app)
        this.io = null;
    }

    startApp(){
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        // this.startWebSockets()

        ElasticSearchAPI(app, this.coreApp)

        app.listen(this.port, ()=>console.log("litsening at port"+this.port))

    }


    startWebSockets(){
        this.io = new Server(server, {
            cors: {
              origin: "*",
              credentials: true,
              methods: ["GET", "POST"],
            },
        });          
    }

    listenToWebSockets(){
        this.io.on("connection", (socket)=>{
            
            console.log(userConnected)
            
            socket.on('disconnect', (reason)=>{
                console.log("user disconnected:", reason)
            })

            socket.on("load-conversation", async (errorID)=>{

            })
        })
    }
}

module.exports = {HTTPServerApp}