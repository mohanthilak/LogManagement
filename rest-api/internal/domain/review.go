package domain

type Review struct {
	Review string `json:"review" bson:"review,omitempty"`
	Author string `json:"author" bson:"author,omitempty"`
}
