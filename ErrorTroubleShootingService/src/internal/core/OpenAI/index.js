const axios = require("axios");
const {OPEN_AI_SECRET_KEY} = require("../../../config")

class OpenAI{

    constructor(model){
        this.model = model
        this.axios = axios.create({
            baseURL: 'https://api.openai.com',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${OPEN_AI_SECRET_KEY}`
            }
        }) 
    }

    async GenerateSolutionForErrorLog(log){
        const query = "For the following error log object, give a solution to the error:" + JSON.stringify(log);
        
        let returnStatement;
        await this.axios.post("/v1/completions", {model:this.model, prompt: query, max_tokens: 500, temperature: 0}).then((res)=>{
            const solution = res.data.choices[0];
            console.log("solutinooooo:", solution)
            returnStatement= {success: true, data: solution, error: null}
        }).catch(e=>{
            console.log("error while getting solution form openai using completions:", e.response.data)
            returnStatement = {success: false, data: null, error: e}
        })
        return returnStatement;
    }
}

module.exports = {OpenAI}