package main

import (
	"log"
	"os"
	httpserver "rest-api/internal/adapters/left/HttpServer"
	mongodb "rest-api/internal/adapters/right/MongoDB"
	api "rest-api/internal/application/API"

	"go.elastic.co/ecszap"
	"go.uber.org/zap"

	"github.com/gorilla/mux"
	"github.com/spf13/viper"
)

type ENVConfig struct {
	PORT        string `mapstructure:"PORT"`
	DB_URL      string `mapstructure:"DB_URL"`
	ENVIRONMENT string `mapstructure:"ENVIRONMENT"`
}

func main() {
	var configENV ENVConfig
	loadENVs(&configENV)
	setUpLogger(configENV)

	mongoDB := mongodb.New(configENV.DB_URL)
	mongoDB.MakeConnection()

	application := api.New(mongoDB)

	router := mux.NewRouter()
	server := httpserver.NewAdapter(router, configENV.PORT, configENV.ENVIRONMENT, application)
	server.Start()
}

func loadENVs(config *ENVConfig) {
	environment := os.Getenv("ENVIRONMENT")
	log.Println("Environment: ", environment)

	if environment == "dev" {
		viper.SetConfigFile("dev.env")
	} else if environment == "dockerDev" {
		viper.SetConfigFile("dev.docker.env")
	}

	if err := viper.ReadInConfig(); err != nil {
		log.Println("Error while reading the env file", err)
	}
	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal("Error while unmarshalling env file", err)
	}
}

func setUpLogger(configENV ENVConfig) {
	encoderConfig := ecszap.NewDefaultEncoderConfig()
	core := ecszap.NewCore(encoderConfig, os.Stdout, zap.DebugLevel)
	logger := zap.New(core, zap.AddCaller())
	logger = logger.With(zap.String("app", "restapi")).With(zap.String("environment", configENV.ENVIRONMENT))
	zap.ReplaceGlobals(logger)
}
