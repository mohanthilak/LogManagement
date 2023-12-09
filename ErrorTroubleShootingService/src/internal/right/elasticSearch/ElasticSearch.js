const { Client } = require('@elastic/elasticsearch')

class ElasticSearch{
    constructor(ElasticSearchURL){
        this.ESURL = ElasticSearchURL;
        this.index = ".ds-filebeat-8.10.4-2023.12.07-000001";
        this.dataStream = "filebeat-8.10.4";
        this.Connect(ElasticSearchURL)
    }

    async Connect(){
        this.client = new Client({
            node: this.ESURL, 
          })        
    }

    async GetIndices(){
        try {
            const response = await this.client.cat.indices({format: "json"});
            return response;
        } catch (error) {
            console.log("error while getting the list of indices from elastic search:", error);
            return null;       
        }
    }
    
    async SearchIndex(index, query){
        try {
            const response = await this.client.search({index, body: query})
            
            return response;
        } catch (error) {
            console.log("error while doing a search query on elastic search:", error)
            return null;
        }
    }

    async GetPreviouslySolvedError(errorMessage, errorDetails){
        try {
            const query = {size: 1,query:{bool: {must: [{match:{"log.level": "error"}},{match:{"message": errorMessage}},{match:{"error.message": errorDetails}}], filter: {exists: {field: "solution"}}}}}
            const data = await this.SearchIndex(this.dataStream, query)
            return data.hits.hits[0]?._source.solution || null;
        } catch (error) {
            console.log("error while finding solution from previous logs using elastic search:", error);
            return null;
        }
    }

    async IndexLog(log){
        try{
            const resopnse = await this.client.index({index: this.dataStream, body: log});
            console.log("\n\nresponse:", resopnse)
            return {success: true, data: resopnse, error: null}
        }catch(error){
            console.log("error while indexing a log into elastic search:", error);
            return {success: false, data: null, error}
        }
    }
    
}

module.exports = {ElasticSearch}