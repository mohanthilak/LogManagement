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

func (A *adapter) InsertStudentToDB(student *domain.Student) (bool, error) {

	collection := A.client.Database("CollegeSimulation").Collection("students")

	result, err := collection.InsertOne(context.TODO(), student)
	if err != nil {
		zap.L().Error("Unable to insert student document", zap.String("from", "mongo"), zap.Any("error", err))
		return true, err
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	student.ID = id
	zap.L().Info("New student inserted into DB", zap.Any("student", student), zap.String("from", "mongo"))
	return true, nil
}

func (A *adapter) GetStudentWithID(id string, student *domain.Student) (bool, error) {

	collection := A.client.Database("CollegeSimulation").Collection("students")

	objID, _ := primitive.ObjectIDFromHex(id)
	log.Println(objID)

	result := collection.FindOne(context.Background(), bson.M{"_id": objID})
	log.Println(result)
	err := result.Decode(&student)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			zap.L().Error("Unable to find student document", zap.String("from", "mongo"), zap.Any("error", err))
			return false, errors.New("Invalid-ID")
		}
		zap.L().Error("Mongo error while fetching student with ID", zap.String("from", "mongo"), zap.Error(err))
		return true, err
	}

	return true, nil
}

func (A adapter) GetAllStudents(students *[]domain.Student) (bool, error) {
	collection := A.client.Database("CollegeSimulation").Collection("students")

	result, err := collection.Find(context.TODO(), bson.D{})
	if err != nil {
		zap.L().Error("unable to run mongo find query for all students", zap.Error(err), zap.String("from", "mongo"))
		return false, nil
	}
	for result.Next(context.TODO()) {
		//Create a value into which the single document can be decoded
		var student domain.Student
		err := result.Decode(&student)
		if err != nil {
			zap.L().Error("unable to interate over result Cursor for all students from mongo find query", zap.Error(err), zap.String("from", "mongo"))
			return false, nil
		}
		*students = append(*students, student)
	}
	return true, nil
}
