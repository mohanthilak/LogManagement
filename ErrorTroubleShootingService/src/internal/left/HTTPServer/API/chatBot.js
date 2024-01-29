const ChatBotAPI = (app, CoreApp) => {
    app.get("/conversation/:thredID", async (req, res) =>{
        try {
            const {threadID} = req.params;

            const data = await CoreApp.GetConversationByThreadID({threadID});
            
            return res.status(data?.success ? 200 : 500).json(data);
        } catch (error) {
            console.log("error while handling get conversation by threadID", error);
            return res.status(500).json({success: false, data:null, error})
        }
    })
}