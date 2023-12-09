const ElasticSearchAPI = (app, CoreApp) =>{
    app.get("/indices", async (req, res)=>{
        const data = await CoreApp.GetIndices();
        return res.status(201).json({success: true, data, error: null})
    })

    app.get("/errors", async (req, res)=>{
        const data = await CoreApp.GetPreviouslySolvedError("hi");
        return res.status(200).json({success: true, data, error: null})
    })

    app.get("/solution", async(req, res)=>{
        const log = '{"@timestamp":"2023-12-08T17:00:37.224Z","@metadata":{"beat":"filebeat","type":"_doc","version":"8.10.4"},"ecs":{"version":"1.6.0"},"container":{"name":"go-rest-api","image":{"name":"elasticseach-go-rest-api"},"id":"d40aa65f18bb2671439097b13cda68ca96a98740532a7230195d53e8c17a9a36","labels":{"com_docker_compose_container-number":"1","com_docker_compose_project_working_dir":"C:\\\\Users\\\\Mohan\\\\Desktop\\\\Mohan\\\\Grind\\\\Projects\\\\LogManagement\\\\ElasticSeach","com_docker_compose_image":"sha256:30ee60e9400d0c6d014f7d9691caca79e24b9f8c88891c1c76a1a2ba5ecb8002","co_elastic_logs/json_overwrite_keys":"true","com_docker_compose_oneoff":"False","co_elastic_logs/enabled":"true","co_elastic_logs/json_expand_keys":"true","com_docker_compose_depends_on":"db:service_started:false","com_docker_compose_project_config_files":"C:\\\\Users\\\\Mohan\\\\Desktop\\\\Mohan\\\\Grind\\\\Projects\\\\LogManagement\\\\ElasticSeach\\\\docker-compose.yml","co_elastic_logs/json_keys_under_root":"true","com_docker_compose_project":"elasticseach","co_elastic_logs/json_add_error_key":"true","com_docker_compose_service":"go-rest-api","com_docker_compose_version":"2.23.0","com_docker_compose_config-hash":"0d28f4693da0ded6c9e22a8b6cafac031d333455790240f6214e6760c1f407d8"}},"log":{"level":"error","offset":48198,"file":{"path":"/var/lib/docker/containers/d40aa65f18bb2671439097b13cda68ca96a98740532a7230195d53e8c17a9a36/d40aa65f18bb2671439097b13cda68ca96a98740532a7230195d53e8c17a9a36-json.log"},"origin":{"file":{"name":"MongoDB/studentRepo.go","line":43},"function":"rest-api/internal/adapters/right/MongoDB.(*adapter).GetStudentWithID"}},"message":"Unable to find by _id for the mongoDB document","app":"restapi","stream":"stdout","from":"mongo","error":{"message":"mongo: no documents in result"},"input":{"type":"container"},"docker":{"container":{"labels":{"co_elastic_logs/json_overwrite_keys":"true","com_docker_compose_config-hash":"0d28f4693da0ded6c9e22a8b6cafac031d333455790240f6214e6760c1f407d8","com_docker_compose_depends_on":"db:service_started:false","com_docker_compose_image":"sha256:30ee60e9400d0c6d014f7d9691caca79e24b9f8c88891c1c76a1a2ba5ecb8002","com_docker_compose_container-number":"1","com_docker_compose_oneoff":"False","com_docker_compose_service":"go-rest-api","com_docker_compose_project_config_files":"C:\\\\Users\\\\Mohan\\\\Desktop\\\\Mohan\\\\Grind\\\\Projects\\\\LogManagement\\\\ElasticSeach\\\\docker-compose.yml","com_docker_compose_project_working_dir":"C:\\\\Users\\\\Mohan\\\\Desktop\\\\Mohan\\\\Grind\\\\Projects\\\\LogManagement\\\\ElasticSeach","com_docker_compose_version":"2.23.0","co_elastic_logs/json_add_error_key":"true","co_elastic_logs/json_keys_under_root":"true","com_docker_compose_project":"elasticseach","co_elastic_logs/enabled":"true","co_elastic_logs/json_expand_keys":"true"}}},"environment":"dockerDevelopment","agent":{"id":"2ad2e9d8-725b-4766-bf32-27427a7292e7","name":"c53d848c1d4e","type":"filebeat","version":"8.10.4","ephemeral_id":"14f8dce1-beab-4388-be0e-b319d290c2da"},"host":{"hostname":"c53d848c1d4e","architecture":"x86_64","os":{"version":"20.04.6 LTS (Focal Fossa)","family":"debian","name":"Ubuntu","kernel":"5.15.133.1-microsoft-standard-WSL2","codename":"focal","type":"linux","platform":"ubuntu"},"containerized":true,"ip":["172.19.0.10"],"mac":["02-42-AC-13-00-0A"],"name":"c53d848c1d4e"}}';
        try {
            let a = JSON.parse(log);
            const data = await CoreApp.appendErrorLogWithSolution(a);
            return res.status(200).json(data);
        } catch (error) {
            console.log("error while parsing json:",error);
            return res.status(500).json({success: false, data: null, error})
        }
    })
}

module.exports = {ElasticSearchAPI}