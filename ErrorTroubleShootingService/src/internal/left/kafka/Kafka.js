const kafka = require('kafka-node')

class Kafka{
    constructor(host, topics, coreApp){
        this.host = host;
        this.topics = topics;
        this.coreApp = coreApp;
    }

    async InitConsuming(){
        this.Connect();
        this.CreateTopics();
        this.InitConsumer();
        this.StartConsuming();
        this.count=0;
    }

    Connect(){
        console.log("Connecting to Kafka");
        this.client = new kafka.KafkaClient({kafkaHost:this.host})
    }

    CreateTopics(){
        console.log("Creating kafka topics:", this.topics);
        const topicArray = this.topics.map(el=>{
            return {
                topic: el,
                partitions: 1,
                replicationFactor: 1    
            }
        })
        
        this.client.createTopics(topicArray, (err, result)=>{
            if(err)console.log("error while creating topics: ", result)
            else console.log("Topics created")
        })
    }

    InitConsumer(){
        console.log("Creating a consumer");
        this.consumer = new kafka.Consumer(this.client, [{topic: "logs"}], {autoCommit:true})
    }

    StartConsuming(){
        console.log("Consuming messages from kafka");
        this.consumer.on("error", (err)=>console.log("\nerror while consuming:", err))

        this.consumer.on("message", async (message)=>{
            this.count++;
            const a = JSON.parse(message.value);
            console.log("\n\ncount:", this.count, "\napp:",a.app, "\n")
            this.coreApp.appendErrorLogWithSolution(a)
        })
    }
}

module.exports = {Kafka}