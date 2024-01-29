#### Requirements
- [x] Create simple applications that generates logs (specifically error logs).
- [x] Create a filebeat instance for taking error logs, and another instance for taking info logs.
- [x] Forward the info logs to Elastic Search.
- [x] Create a NodeJS service that handles error troubleshooting.
- [x] Create a kafka cluster that forward data to the NodeJS service.
- [x] Forward the Error logs from FileBeat to kafka cluster.
- [x] Once a log is received to the NodeJS service, query elastic search for solution for the error.
- [x] If Elastic search doesn't have the solution yet, then utilize ChatGPT's API to get the solution.
- [x] Once you get the solution from ChatGPT, append the solution to the Error log.
- [x] Check if there is any similar(I mean same) error logs that do not have the solution, if you find any then append the solution to those logs as well.
- [] Bot Creation Phase: append the link to the ChatGPT assistent to the Log.
- [] The log will be submitted to the the assistant as context to the interaction, automatically.

