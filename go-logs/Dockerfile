FROM golang:latest as build

WORKDIR /app

COPY go.mod go.sum ./

RUN --mount=type=cache,target=go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download

COPY . .

RUN go build \
    -ldflags="-linkmode external -extldflags -static" \
    -tags netgo \
    -o go-log-trial

FROM scratch

COPY --from=build /app/go-log-trial go-log-trial

CMD [ "/go-log-trial" ]