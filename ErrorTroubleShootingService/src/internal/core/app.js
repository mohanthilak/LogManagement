const {OpenAI} = require("./OpenAI")
const openAI = new OpenAI("gpt-3.5-turbo-instruct")


class App {
    constructor(elasticSearch){
        this.elasticSearch = elasticSearch
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

        let solution = await this.elasticSearch.GetPreviouslySolvedError(message, details)
        if(!solution){
            // ChatGPT integration
            const solutionData = await openAI.GenerateSolutionForErrorLog(errorLog)
            if(solutionData.success) solution = solutionData.data.text
        }
        errorLog.solution= solution;
        // return solution
        const response = await this.elasticSearch.IndexLog(errorLog);
        return response;
    }
}

module.exports = {App}