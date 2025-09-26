# OpenOrganizer
A cross-platform desktop reminder and note-taking calendar application built with user control, complete data ownership, and 
security as core principles.

## Features:
* Cross-platform support (Windows & Linux)
* Opt-in cloud-sync for remote backup and use between multiple devices
* Data is encrypted on the server database and during transmission
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

Server: Golang, GCC / `make` (`Mingw32-make`), PostgreSQL 17.4+ (or other SQL database)

## Client Setup Instructions

1. `git clone LINK`
2. `cd OpenOrganizer/client`
3. `npm install`
4. Create a file named `serveraddress.txt` in `client/public/` following this format:
```
SERVER_ADDRESS
```
Example:
```
http://localhost:3001/
```
5. `npm run rebuild`
6. `quasar dev -m electron` to run in electron **(necessary for sqlite)**

Extra Options:<br>
`quasar dev` to run in the browser<br>
`quasar build -m electron` to build executable

## Server Setup Instructions

An external SQL Database application is required for the server. 
Our team uses PostgreSQL 17.4.

1. `git clone LINK`
2. `cd OpenOrganizer/server`
3. Create a file named `.env` in `server/` and fill in your data following this format:
```
SERVER_PORT="port"
DB_HOST="address"
DB_PORT="port"
DB_USER="username"
DB_PWD="password"
```
Example:
```
SERVER_PORT="3001"
DB_HOST="localhost"
DB_PORT="3002"
DB_USER="postgres"
DB_PWD="password"
```
4. `make` (or `mingw32-make` for Windows) to run, `make build` to build in `server/bin/`
