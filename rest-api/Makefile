.DEFAULT_GOAL := run-dev

run-dev:
	@ENVIRONMENT=dev go run main.go

swagger: swagger-install
	GO111MODULE=off swagger generate spec -o ./swagger.yaml --scan-models

swagger-install:
	which swagger || GO111MODULE=off go get -u github.com/go-swagger/go-swagger/cmd/swagger