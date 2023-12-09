package domain

type Teacher struct {
	Name     string   `json:"name,omitempty" bson:"name,omitempty"`
	Subjects []string `json:"subjects,omitempty" bson:"subjects,omitempty"`
	College  string   `json:"college,omitempty" bson:"college,omitempty"`
	Reviews  []string `json:"reviews,omitempty" bson:"reviews,omitempty"`
	Rating   int8     `json:"rating,omitempty" bson:"rating,omitempty"`
	ID       string   `json:"_id,omitempty" bson:"_id,omitempty"`
}
