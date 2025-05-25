const {OPEN_AI_SECRET_KEY, OPEN_AI_ASSISTANT_ID} = require("../../../config")
const OAI = require("openai");

class OpenAI {
    constructor(){
        console.log(OPEN_AI_SECRET_KEY)
        this.openai = new OAI({
            apiKey: OPEN_AI_SECRET_KEY,
            defaultHeaders: {
            "OpenAI-Beta": "assistants=v2"
        }
        });
    }

    // async GenerateSolutionForErrorLog(log){
    //     const query = "For the following error log object, give a solution to the error:" + JSON.stringify(log);
    //     try {
    //         const completion = await openai.completions.create({model: this.model, prompt: query, max_tokens: 500,temperature: 0});
    //         const solution = completion.choices[0]
    //         return {success: true, data: solution, error: null}
    //     } catch (error) {
    //         console.log("error while getting solution form openai using completions:", e.response.data)
    //         returnStatement = {success: false, data: null, error: e}
    //     }
    // }
    
    async GenerateSolutionForErrorLog(log){
        console.log("Log is being sent to Open AI")
        const query = "For the following error log object, give a solution to the error:" + JSON.stringify(log);
        try {
            const threadID = await this.CreateANewConversation();
            await this.createMessage(threadID, query);
            const runID = await this.RunAssitant(threadID);
            const status = await this.CheckStatus(threadID, runID);
            let solution = null;
            if(status.success){
                solution = await this.GetResponse(threadID);
            }
            // console.log(solution)
            return {success: solution?true:false, data: solution, error: null}
        } catch (error) {
            console.log("error while getting solution form openai using completions:", error)
            return {success: false, data: null, error}
        }
    }


    async CreateANewConversation(){
        try{

            let threadID = null;
            const thread = await this.openai.beta.threads.create();
            threadID = thread.id;
            return threadID;
        }catch (e){
            console.log("Creating thread error: ", e)
            throw e;
        }
    }


    // Adds a message to the given thread 
    async createMessage(threadID, logQuery){
        
        const messageResponse = await this.openai.beta.threads.messages.create(
            threadID,
            {
              role: "user",
              content: logQuery
            }
          );
        return {success:true, data:messageResponse, error:null};
    }


    async RunAssitant(threadID){
        try {
            let runID = null;

            const run = await this.openai.beta.threads.runs.create(
                threadID,
                { 
                assistant_id: OPEN_AI_ASSISTANT_ID,
                instructions: '',
                }
            );
            runID = run.id;
            return runID 
        } catch (error) {
            console.log("error while running the assitant:", error)
        }  
    }

    async CheckStatus(threadID, runID){
        return new Promise((resolve, reject)=>{
            let i = 0;
            let interval = setInterval(async () => {
                try {
                    const run = await this.openai.beta.threads.runs.retrieve(threadID, runID);
                    // console.log("\n\n\n form run status: ", run)
                    if(run?.status === "completed"){
                        // console.log("\n\nResponse Created!")
                        resolve({success: true, data: run, error: null});
                        clearInterval(interval);
                    }else if(run?.status === "failed" || i == 7){
                        if(i==5) reject({success: false, data: null, error: "time-out"})
                        else reject({success: false, data: null, error: "rate-limited, please wait for a little longer..."})
                        clearInterval(interval)
                    }
                    i++;
                } catch (error) {
                    reject({success: false, data: null, error})
                }
            }, 7000);
        })
    }

    async GetResponse(threadID){
        const messages = await this.openai.beta.threads.messages.list(threadID);
        if(messages) return messages.data[0].content[0].text.value
        else return null
    }

}

module.exports = {OpenAI}