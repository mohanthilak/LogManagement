const {ElasticSearch} = require("./src/internal/right/index")
const {Kafka} = require('./src/internal/left/kafka/Kafka');
const {HTTPServerApp} = require("./src/internal/left/HTTPServer/server")
const {App} = require('./src/internal/core/app')
const {makeConnection} = require("./src/internal/right/MongoDB/connection")
makeConnection()

const ElasticSearchObj = new ElasticSearch('http://elasticsearch:9200')

const {ChatRepo} = require("./src/internal/right/MongoDB/Repository/Chat")
const chatRepo = new ChatRepo();

const {ErrorRepo} = require("./src/internal/right/MongoDB/Repository/Error")
const errorRepo = new ErrorRepo()

const {MessageRepo} = require("./src/internal/right/MongoDB/Repository/Message")
const messageRepo = new MessageRepo();

const CoreApp = new App(ElasticSearchObj)



const ServerObj = new HTTPServerApp(8110, CoreApp)
ServerObj.startApp();

const kafka = new Kafka("kafka:9092",["logs"], CoreApp)
kafka.InitConsuming();