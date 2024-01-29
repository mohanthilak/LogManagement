const {ErrorModel} = require('../Models/Error')

class ErrorRepo {
    async findErrorByID({ErrorID}){
        try {
            const ErrorData = await ErrorModel.findById(ErrorID).populate('conversation').lean();

            if(ErrorData) return {success:true, data: ErrorData, error:null};
            
            throw "invalid error ID" 
        } catch (error) {
            console.log("Error while find Error by ID in error repo");
            return {success: false, data: null, error}
        }
    }

    async InsertError({log, context}){
        try {
            const ErrorData = new ErrorModel({log, context});
            await ErrorData.save();

            return {success: true, data: ErrorData, error: null};
        } catch (error) {
            console.log("error while inserting error in to mongo:", error);
            return {success: false, data: null, error}
        }
    }
}

module.exports = {ErrorRepo}