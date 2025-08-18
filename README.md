# OpenOrganizer

Team Members: 
* Kevin Sirantoine
* Rachel Patella
* Michael Jagiello
* Maria Pasaylo

# Installation

## Prerequisites

Client: Node.js / ``npm``

Server: Golang, GCC / ``make`` (``Mingw32-make``)

Database: PostgreSQL 17.4+

## Client Setup Instructions

1. ``git clone LINK``
2. ``cd OpenOrganizer/client``
3. ``npm install``
4. Create a ``serveraddress.txt`` file in ./public/ following this format:
```
SERVER_ADDRESS
```
Example:
```
https://localhost:3001/
```
5. ``quasar dev`` to run in the browser
6. ``quasar build -m electron`` for executable

## Server Setup Instructions

1. ``git clone LINK``
2. ``cd OpenOrganizer/server``
3. Create a .env file and fill in your data following this format:
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
DB_USER="username"
DB_PWD="password"
```
4. ``make`` to run, ``make build`` to build in ./bin/
