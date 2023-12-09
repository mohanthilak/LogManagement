package right

import "rest-api/internal/domain"

type MongoDBI interface {
	MakeConnection()
	InsertStudentToDB(student *domain.Student) (bool, error)
	GetStudentWithID(string, *domain.Student) (bool, error)
	GetAllStudents(*[]domain.Student) (bool, error)
	InsertTeacherToDB(*domain.Teacher) (bool, error)
	GetTeacherWithID(string, *domain.Teacher) (bool, error)
	GetAllTeachers(*[]domain.Teacher) (bool, error)
}
