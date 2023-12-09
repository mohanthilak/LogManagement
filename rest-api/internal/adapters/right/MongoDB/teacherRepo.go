package mongodb

import (
	"context"
	"errors"
	"log"
	"rest-api/internal/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
)

func (A *adapter) InsertTeacherToDB(teacher *domain.Teacher) (bool, error) {

	collection := A.client.Database("CollegeSimulation").Collection("teachers")

	result, err := collection.InsertOne(context.TODO(), teacher)
	if err != nil {
		zap.L().Error("Unable to insert teacher document", zap.String("from", "mongo"), zap.Any("error", err))
		return true, err
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	teacher.ID = id
	zap.L().Info("New teacher inserted into DB", zap.Any("teacher", teacher), zap.String("from", "mongo"))
	return true, nil
}

func (A *adapter) GetTeacherWithID(id string, teacher *domain.Teacher) (bool, error) {

	collection := A.client.Database("CollegeSimulation").Collection("teacher")

	objID, _ := primitive.ObjectIDFromHex(id)
	log.Println(objID)

	result := collection.FindOne(context.Background(), bson.M{"_id": objID})
	log.Println(result)
	err := result.Decode(&teacher)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			zap.L().Error("Unable to find teacher document", zap.String("from", "mongo"), zap.Any("error", err))
			return false, errors.New("Invalid-ID")
		}
		zap.L().Error("Mongo error while fetching teacher with ID", zap.String("from", "mongo"), zap.Error(err))
		return true, err
	}

	return true, nil
}

func (A adapter) GetAllTeachers(teachers *[]domain.Teacher) (bool, error) {
	collection := A.client.Database("CollegeSimulation").Collection("Teachers")

	result, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		zap.L().Error("unable to run mongo find query for all Teachers", zap.Error(err), zap.String("from", "mongo"))
		return false, nil
	}
	for result.Next(context.TODO()) {
		var teacher domain.Teacher
		err := result.Decode(&teacher)
		if err != nil {
			zap.L().Error("unable to interate over result Cursor for all Teachers from mongo find query", zap.Error(err), zap.String("from", "mongo"))
			return false, nil
		}
		*teachers = append(*teachers, teacher)
	}
	return true, nil
}
