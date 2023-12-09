const {ElasticSearch} = require("./src/internal/right/index")
const {Kafka} = require('./src/internal/left/kafka/Kafka');
const {HTTPServerApp} = require("./src/internal/left/HTTPServer/server")
const {App} = require('./src/internal/core/app')

const ElasticSearchObj = new ElasticSearch('http://elasticsearch:9200')
const CoreApp = new App(ElasticSearchObj)


const ServerObj = new HTTPServerApp(8110, CoreApp)
ServerObj.startApp();

const kafka = new Kafka("kafka:9092",["logs"], CoreApp)
kafka.InitConsuming();