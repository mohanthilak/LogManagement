const {OpenAI} = require("./OpenAI")
const openAI = new OpenAI()


class App {
    constructor(elasticSearch, repos){
        this.elasticSearch = elasticSearch
        this.repos = repos;
    }

    async GetIndices(){
        return this.elasticSearch.GetIndices();
        
    }
    
    async SearchIndex(index, query){
        return this.elasticSearch.SearchIndex(index, query)
    }

    async GetPreviouslySolvedError(errorMessage){
        return this.GetPreviouslySolvedError(errorMessage)
    }

    async appendErrorLogWithSolution(errorLog){
        if(errorLog.log.level !== "error")return{success: false, data: null, error: "log level is not error"};
        if(errorLog.app === "myapp"){
            const response = await this.elasticSearch.IndexLog(errorLog)
            return response
        }

        const message = errorLog.message;
        const details = errorLog.error.message;

        //solution will be null if its a new type of error
        let solution = await this.elasticSearch.GetPreviouslySolvedError(message, details)
        console.log("\n\nPreviously solved solution:",solution)
        if(!solution){
            // ChatGPT integration
            const solutionData = await openAI.GenerateSolutionForErrorLog(errorLog)
            console.log("\n\n", {solutionData}, "\n\n\n")
            if(solutionData.success) solution = solutionData.data
        }
        console.log("solution created in app layer")
        errorLog.solution= solution;
        // return solution
        const response = await this.elasticSearch.IndexLog(errorLog);
        return response;
    }

    async LoadErrorChatBotConvo(ErrorID){
        return this.repos.mongo.errorRepo.findErrorByID({ErrorID})
    }

    async GetConversationByThreadID({threadID}){
        try {
            const conversationDataFromDB = await this.repos.mongo.findChatByThreadID({threadID})
        } catch (error) {
            console.log("error while handling get conversation by threadID:",error);
            return {success: false, data: null, error}
        }
    }
}

module.exports = {App}