package domain

// swagger:model
type Student struct {
	// The name of the student.
	// required: true
	// min length: 3
	Name string `json:"name" bson:"name,omitempty"`
	// The rollNumber of the student.
	// required: true
	// min length: 3
	RollNumber string `json:"rollNumber" bson:"rollNumber,omitempty"`
	// The semester the student is in.
	// required: true
	// min length: 1
	Semester int16 `json:"semester" bson:"semester,omitempty"`
	// The ID of the student.
	// required: true
	ID string `json:"_id" bson:"_id,omitempty"`
	// The college student is related to.
	// required: true
	College string `json:"college" bson:"college,omitempty"`
	// The password of the student.
	// required: true
	Password string `json:"password" bson:"password,omitempty"`
}
