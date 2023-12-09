package api

import (
	"rest-api/internal/domain"
	"rest-api/internal/ports/right"
)

type adapter struct {
	db right.MongoDBI
}

func New(db right.MongoDBI) *adapter {
	return &adapter{
		db: db,
	}
}

/*
	Returns bool is true when there was no error. Right now, both the return statements return nil for error field.

This is because currently the DB layer is not catching any specific error, so I assume that its a server error
and sever error need not be shared with the client so its kept as nil.
*/
func (A adapter) CreateStudent(student *domain.Student) (bool, error) {
	return A.db.InsertStudentToDB(student)

}

func (A adapter) GetAllStudents(students *[]domain.Student) (bool, error) {
	return A.db.GetAllStudents(students)
}

func (A adapter) GetStudentWithID(id string, student *domain.Student) (bool, error) {
	return A.db.GetStudentWithID(id, student)
}

func (A adapter) CreateTeacher(teacher *domain.Teacher) (bool, error) {
	return A.db.InsertTeacherToDB(teacher)

}

func (A adapter) GetAllTeachers(teachers *[]domain.Teacher) (bool, error) {
	return A.db.GetAllTeachers(teachers)
}

func (A adapter) GetTeacherWithID(id string, teacher *domain.Teacher) (bool, error) {
	return A.db.GetTeacherWithID(id, teacher)
}
