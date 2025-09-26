#
# Authors: Michael Jagiello
# Created: 2025-04-13
# Updated: 2025-09-20
#
# This is the makefile used to efficiently build and run the server.
#
# This file is a part of OpenOrganizer.
# This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
# No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
#

ifeq ($(OS),Windows_NT)
EXE := .exe
endif

default:
	go run ./src/main.go
build:
	go build -o ./bin/openorganizer$(EXE) ./src/main.go
run:
	./bin/openorganizer$(EXE)