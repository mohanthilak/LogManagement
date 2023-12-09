package httpserver

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"reflect"
	"rest-api/internal/domain"

	"go.uber.org/zap"
)

func (A *adapter) initiateTeacherRoutes() {
	A.TeacherRouter.HandleFunc("/all", A.CreateHandler(A.handleGetAllTeachers)).Methods("GET")
	A.TeacherRouter.HandleFunc("/{id}", A.CreateHandler(A.handleGetTeacher)).Methods("GET")
	A.TeacherRouter.HandleFunc("/create", A.CreateHandler(A.handleCreateTeacher)).Methods("POST")
}

func (A adapter) handleGetAllTeachers(w http.ResponseWriter, r *http.Request) error {
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
	var teachers []domain.Teacher
	ok, err := A.API.GetAllTeachers(&teachers)
	if !ok {
		return fmt.Errorf("server error")
	}
	if err != nil && ok {
		return newClientHTTPError(401, err)
	}
	A.WriteJSONResponse(w, http.StatusAccepted, teachers, nil)
	zap.L().Info("request proccessed", zap.String("path", r.URL.Path), zap.String("method", r.Method), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", teachers))
	return nil
}

func (A adapter) handleCreateTeacher(w http.ResponseWriter, r *http.Request) error {
	var requestBody map[string]interface{}
	if err := json.NewDecoder((r.Body)).Decode(&requestBody); err != nil {
		log.Println("error while parsing body")
		return err
	}

	if requestBody["subjects"] == nil || requestBody["name"] == nil || requestBody["name"] == "" || requestBody["college"] == nil || requestBody["college"] == "" {
		return newClientHTTPError(400, errors.New("insufficient data"))
	}

	fmt.Printf("requestBody: %+v", requestBody)
	fmt.Printf("requestBody: %+v", requestBody["subjects"])

	// var subjects []string
	// for _, subject := range requestBody["subjects"].([]interface{}) {
	// 	subjects = append(subjects, subject.(string))
	// }

	// teacher := domain.Teacher{Name: requestBody["name"].(string), Subjects: subjects, College: requestBody["college"].(string)}

	// fmt.Printf("%+v\n", teacher)

	// ok, err := A.API.CreateTeacher(&teacher)
	// if !ok {
	// 	return fmt.Errorf("server error")
	// }
	// if err != nil {
	// 	return newClientHTTPError(401, err)
	// }

	// A.WriteJSONResponse(w, http.StatusCreated, teacher, nil)
	// zap.L().Info("request proccessed", zap.String("path", r.URL.Path), zap.String("method", r.Method), zap.Any("request.body", requestBody), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", teacher))
	return nil
}

func (A adapter) handleGetTeacher(w http.ResponseWriter, r *http.Request) error {
	var teacher domain.Teacher
	id, err := A.getIDFromReq(r)
	if err != nil {
		return newClientHTTPError(401, err)
	}
	ok, err := A.API.GetTeacherWithID(id, &teacher)

	if reflect.DeepEqual(teacher, domain.Teacher{}) && err == nil {
		return newClientHTTPError(http.StatusNotFound, fmt.Errorf("invalid id"))
	}

	if !ok {
		return newClientHTTPError(http.StatusBadRequest, err)
	}
	if err != nil {
		return fmt.Errorf("server error")
	}

	A.WriteJSONResponse(w, http.StatusAccepted, teacher, nil)
	zap.L().Info("request proccessed", zap.String("method", r.Method), zap.String("path", r.URL.Path), zap.Any("request.params", id), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(r.Context())), zap.Any("response", teacher))
	return nil
}
