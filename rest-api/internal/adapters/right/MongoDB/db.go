package mongodb

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

type adapter struct {
	uri    string
	client *mongo.Client
}

func New(uri string) *adapter {
	return &adapter{uri: uri}
}

func (A *adapter) MakeConnection() {
	if A.client == nil {
		client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(A.uri))
		if err != nil {
			zap.L().Error("Unable to connect to MongoDB", zap.String("DB_URL", A.uri), zap.Any("Error", err), zap.String("from", "mongo"))
			panic(err)
		}

		err = client.Ping(context.Background(), nil)
		if err != nil {
			zap.L().Error("Unable to connect to MongoDB - Ping failed", zap.String("DB_URL", A.uri), zap.Any("Error", err), zap.String("from", "mongo"))
			panic(err)
		}

		zap.L().Info("MongoDB Connected", zap.String("DB_URL", A.uri), zap.String("from", "mongo"))

		A.client = client
	}
}
