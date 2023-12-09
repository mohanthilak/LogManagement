package api

import "rest-api/internal/domain"

type ApplicationI interface {
	CreateStudent(*domain.Student) (bool, error)
	GetAllStudents(*[]domain.Student) (bool, error)
	GetStudentWithID(string, *domain.Student) (bool, error)
	CreateTeacher(*domain.Teacher) (bool, error)
	GetAllTeachers(*[]domain.Teacher) (bool, error)
	GetTeacherWithID(string, *domain.Teacher) (bool, error)
}
