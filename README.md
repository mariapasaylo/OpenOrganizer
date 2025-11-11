# OpenOrganizer
A cross-platform desktop reminder and note-taking calendar application built with user control, complete data ownership, and 
security as core principles.

## Features:
* Cross-platform support (Windows & Linux)
* Store data with opt-in cloud syncing for easy remote backup and use between multiple devices
* Keep data secure by encrypting it for transmission and cloud storage to where not even the server can read it
* Create daily, weekly, bi-weekly, monthly, and yearly recurring reminders
* Sort reminders and notes into color-coded folders for easy organization
* Use existing reminders as a template for new ones
* ... and more!

## Team Members:
* Kevin Sirantoine
* Rachel Patella
* Michael Jagiello
* Maria Pasaylo

# Installation

## Prerequisites

Client: Node.js / `npm`

Server: Golang, GCC / `make` (`mingw32-make`), PostgreSQL (17.4+ tested)

## Client Setup Instructions

1. `git clone LINK`
2. `cd OpenOrganizer/client`
3. `npm install`
4. Create a file named `serveraddress.txt` in `/client/public/` following this format:
```
SERVER_ADDRESS
```
Example:
```
http://localhost:3001/
```
Note: If running the testing suite, make a file named `testing.txt` containing `TRUE` in the same directory.
5. `npm run rebuild`
6. To build / run the application:
* `quasar dev -m electron` to run in electron **(necessary for sqlite)**
* `quasar dev` to run in the browser **(UI testing only)**
* `quasar build -m electron` to build executable

## Server Setup Instructions

An external SQL Database application is required for the server. 
Our team has tested and uses PostgreSQL 17.4.
It is required to set up PostgreSQL and get database access information to be able to pass to the `.env` file.

1. `git clone LINK`
2. `cd OpenOrganizer/server`
3. Create a file named `.env` here in `/server/` and fill in your data following this format:
```
LOCAL_ONLY="BOOLEAN"
HTTPS="BOOLEAN"
SERVER_PORT_HTTP="PORT"
SERVER_PORT_HTTPS="PORT"
SERVER_CRT="FILE_NAME"
SERVER_KEY="FILE_NAME"
DB_HOST="ADDRESS"
DB_PORT="PORT"
DB_USER="USERNAME"
DB_PWD="PASSWORD"
TOKEN_EXPIRE_REFRESH="BOOLEAN"
TOKEN_EXPIRE_TIME="INTEGER"
TOKEN_PURGE_INTERVAL="INTEGER"
MAX_RECORD_COUNT="INTEGER"
CLEAR_DB_AUTH="BOOLEAN"
CLEAR_DB_DATA="BOOLEAN"
TEST_SUITE="BOOLEAN"
TEST_SUITE_DELAY="INTEGER"
```
Example:
```
LOCAL_ONLY="FALSE"
HTTPS="FALSE"
SERVER_PORT_HTTP="3001"
SERVER_PORT_HTTPS="3003"
SERVER_CRT="server.crt"
SERVER_KEY="server.key"
DB_HOST="localhost"
DB_PORT="3002"
DB_USER="postgres"
DB_PWD="password"
TOKEN_EXPIRE_REFRESH="TRUE"
TOKEN_EXPIRE_TIME="3600"
TOKEN_PURGE_INTERVAL="3600"
MAX_RECORD_COUNT="1000"
CLEAR_DB_AUTH="FALSE"
CLEAR_DB_DATA="FALSE"
TEST_SUITE="FALSE"
TEST_SUITE_DELAY="20"
```
4. To build / run the application:
* `make` (or `mingw32-make` for Windows) will fully build and run the application
* `make build` to only build in `/server/bin/`
* `make run` to only run the executable in `/server/bin/`