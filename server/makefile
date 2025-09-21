ifeq ($(OS),Windows_NT)
EXE := .exe
endif

default:
	go run ./src/main.go
build:
	go build -o ./bin/openorganizer$(EXE) ./src/main.go
run:
	./bin/openorganizer$(EXE)