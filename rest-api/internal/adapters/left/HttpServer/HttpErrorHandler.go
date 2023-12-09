package httpserver

// swagger:model
type HttpErrorStruct struct {
	Status  int
	Cause   error
	Details string
}

func newClientHTTPError(statusCode int, err error) error {
	return &HttpErrorStruct{
		Status: statusCode,
		Cause:  err,
	}
}

func (e HttpErrorStruct) Error() string {
	if e.Cause == nil {
		return e.Details
	}
	return e.Details + " : " + e.Cause.Error()
}

func (e *HttpErrorStruct) ResponseBody() map[string]interface{} {
	return map[string]interface{}{"error": e.Error()}
}

func (e *HttpErrorStruct) ResponseHeaders() (int, map[string]string) {
	return e.Status, map[string]string{
		"Content-Type": "application/json; charset=utf-8",
	}
}

type HttpServerErrorStruct struct {
	HttpErrorStruct
	data any
	from string
}

func newServerHTTPError(statusCode int, data any, from, details string, cause error) error {
	return &HttpServerErrorStruct{
		HttpErrorStruct: HttpErrorStruct{
			Cause:   cause,
			Status:  statusCode,
			Details: details,
		},
		data: data,
		from: from,
	}
}
