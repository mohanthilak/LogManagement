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
    -o gorestapi

FROM scratch

COPY --from=build /app/gorestapi gorestapi

COPY dev.docker.env dev.docker.env

EXPOSE 8990

CMD [ "/gorestapi" ]