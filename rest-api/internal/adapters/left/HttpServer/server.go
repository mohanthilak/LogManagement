package httpserver

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	api "rest-api/internal/application/API"
	"rest-api/internal/ports/left"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

type apiFunc func(http.ResponseWriter, *http.Request) error

type adapter struct {
	PORT          string
	Router        *mux.Router
	StudentRouter *mux.Router
	TeacherRouter *mux.Router
	ReviewRouter  *mux.Router
	API           api.ApplicationI
	Environment   string
}

func NewAdapter(router *mux.Router, port string, environment string, application api.ApplicationI) left.HttpServerI {
	return &adapter{
		PORT:        port,
		Router:      router,
		API:         application,
		Environment: environment,
	}
}

func (A adapter) initiateDocsRoute() {
	A.Router.Handle("/swagger.yaml", http.FileServer(http.Dir("./")))
	opts := middleware.SwaggerUIOpts{SpecURL: "swagger.yaml"}
	sh := middleware.SwaggerUI(opts, nil)
	A.Router.Handle("/docs", sh)
}

func (A *adapter) initiateRoutes() {
	A.initiateDocsRoute()
	A.StudentRouter = A.Router.PathPrefix("/student").Subrouter()
	A.TeacherRouter = A.Router.PathPrefix("/teacher").Subrouter()
	A.Router.HandleFunc("/", IntroduceAsAbhilash)
	A.initiateTeacherRoutes()
	A.initiateStudentRoutes()
}
func IntroduceAsAbhilash(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}
func (A *adapter) Start() {
	A.initiateRoutes()
	A.Router.Use(A.InsertRequestID)
	var port string
	if A.Environment == "dockerDevelopment" {
		port = "0.0.0.0:" + A.PORT
	} else {
		port = "127.0.0.1:" + A.PORT
	}

	server := http.Server{
		Addr:         port,
		Handler:      handlers.CORS(handlers.AllowCredentials(), handlers.AllowedOrigins([]string{"*"}))(A.Router),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	//Starting the server
	go func() {
		zap.L().Info("Starting the HTTP server on port at port: " + port)
		zap.L().Info("Running the server in : " + A.Environment + " Environment")
		err := server.ListenAndServe()
		if err != nil {

			errMessage := fmt.Sprintf("Error running HTTP server: %s\nGracefully Ending the Server \n ", err)
			zap.L().Error(errMessage)
			os.Exit(1)
		}

	}()

	//for graceful shutdown
	//trap sigterm or interupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	//Block until a signal is received
	sig := <-c
	log.Println("Got Signal", sig)

	//gracefully shutdown the server, waiting max 300 second for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	server.Shutdown(ctx)
}

func (A adapter) InsertRequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		r = r.WithContext(A.generateRequestID(ctx))
		ctx2 := r.Context()
		zap.L().Info("Request Received", zap.String("method", r.Method), zap.String("URI", r.RequestURI), zap.String("remoteAddr", r.RemoteAddr), zap.String("requestID", A.getRequestIDFromContext(ctx2)))
		next.ServeHTTP(w, r)
	})
}

func (A adapter) generateRequestID(ctx context.Context) context.Context {
	reqID := uuid.New()
	return context.WithValue(ctx, "requestID", reqID.String())
}

func (A adapter) getRequestIDFromContext(ctx context.Context) string {
	reqID := ctx.Value("requestID")
	if id, ok := reqID.(string); ok {
		return id
	}
	return ""
}

func (A adapter) getIDFromReq(r *http.Request) (string, error) {
	id := mux.Vars(r)["id"]
	return id, nil
}

func (A adapter) CreateHandler(fn apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := fn(w, r); err != nil {
			clientError, ok := err.(*HttpErrorStruct)

			// ok is false when its a server error. Server errors are sent with a response code of 500 with no body.
			if !ok {
				zap.L().Error("Failed to process request", zap.Error(err), zap.Int16("Status Code", 500))
				A.WriteJSONResponse(w, 500, nil, nil)
				return
			}

			body := clientError.ResponseBody() // Try to get response body of ClientError.

			status, _ := clientError.ResponseHeaders() // Get http status code and headers.
			// for k, v := range headers {
			// 	w.Header().Set(k, v)
			// }
			fmt.Printf("body: %+v", body)
			A.WriteJSONResponse(w, status, body, nil)
		}
	}
}

func (A adapter) WriteJSONResponse(w http.ResponseWriter, status int, v any, headers map[string]string) {

	if headers == nil {
		w.Header().Add("Content-Type", "application/json")
	} else {
		for k, v := range headers {
			w.Header().Set(k, v)
		}
	}

	w.WriteHeader(status)

	if v != nil {
		if err := json.NewEncoder(w).Encode(v); err != nil {
			zap.L().Error("Unable to encode the HTTP response to json", zap.Error(err), zap.String("from", "json-encoder"), zap.Any("data", v))
		}
	}

}
