// Package classification Students API.
//
// The purpose of this application is to provide an application
// that is using plain go code to define an API
// This should demonstrate all the possible comment annotations
// that are available to turn go code into a fully compliant swagger 2.0 spec
//
// # Documentation for Students API
//
// Schemes: http
// BasePath: /student/
// version: 1.0.0
//
// consumes:
//   - application/json
//
// Produces:
//   - application/json
//
// swagger:meta
package httpserver

import (
	"encoding/json"
	"fmt"
	"net/http"
	"rest-api/internal/domain"

	"go.uber.org/zap"
)

func (A *adapter) initiateStudentRoutes() {
	A.StudentRouter.HandleFunc("/all", A.CreateHandler(A.handleGetAllStudents)).Methods("GET")
	A.StudentRouter.HandleFunc("/{id}", A.CreateHandler(A.handleGetStudent)).Methods("GET")
	A.StudentRouter.HandleFunc("/create", A.CreateHandler(A.handleCreateStudent)).Methods("POST")
}

func (A adapter) handleGetAllStudents(w http.ResponseWriter, r *http.Request) error {
	// swagger:route GET /all GetStudents
	// Lists all the students
	// 	Produces:
	// 		- application/json
	// 	Schemes: http
	// 	responses:
	//   '200':
	//     description: students response
	//     schema:
	//       type: array
	//       items:
	//         "$ref": "#/definitions/Student"
	var students []domain.Student
	ok, err := A.API.GetAllStudents(&students)
	if !ok {
		return fmt.Errorf("server error")
	}
	if err != nil && ok {
		return newClientHTTPError(401, err)
	}
	A.WriteJSONResponse(w, http.StatusAccepted, students, nil)
	zap.L().Info("request proccessed", zap.String("path", r.URL.Path), zap.String("method", r.Method), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", students))
	return nil
}

func (A adapter) handleCreateStudent(w http.ResponseWriter, r *http.Request) error {
	var student domain.Student
	var requestBody map[string]interface{}

	if err := json.NewDecoder((r.Body)).Decode(&requestBody); err != nil {
		return err
	}
	student.Name = requestBody["name"].(string)
	student.RollNumber = requestBody["rollNumber"].(string)
	student.Semester = int16(requestBody["semester"].(float64))

	ok, err := A.API.CreateStudent(&student)
	if !ok {
		return fmt.Errorf("server error")
	}
	if err != nil {
		return newClientHTTPError(401, err)
	}

	A.WriteJSONResponse(w, http.StatusCreated, student, nil)
	zap.L().Info("request proccessed", zap.String("path", r.URL.Path), zap.String("method", r.Method), zap.Any("request.body", requestBody), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", student))
	return nil
}

func (A adapter) handleGetStudent(w http.ResponseWriter, r *http.Request) error {
	var student domain.Student
	id, err := A.getIDFromReq(r)
	if err != nil {
		return newClientHTTPError(401, err)
	}
	ok, err := A.API.GetStudentWithID(id, &student)

	if student == (domain.Student{}) && err == nil {
		return newClientHTTPError(http.StatusNotFound, fmt.Errorf("invalid id"))
	}

	if !ok {
		return newClientHTTPError(http.StatusBadRequest, err)
	}
	if err != nil {
		return fmt.Errorf("server error")
	}

	A.WriteJSONResponse(w, http.StatusAccepted, student, nil)
	zap.L().Info("request proccessed", zap.String("method", r.Method), zap.String("path", r.URL.Path), zap.Any("request.params", id), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", student))
	return nil
}
