/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-10-19
 *
 * This file declares the struct for storing all .env variables that are fetched at server initialization.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package models

type ENVVars struct {

	// server information fields

	// if this server is accessible outside the local machine
	// defaults to false
	LOCAL_ONLY bool
	// if HTTPS will be launched alongside HTTP and redirected to
	// no default, fails upon error
	HTTPS bool
	// required port for HTTP
	SERVER_PORT_HTTP string
	// required port for HTTPS if HTTPS is being used
	SERVER_PORT_HTTPS string
	// certificate file name, required if using HTTPS
	SERVER_CRT string
	// private key file name, required if using HTTPS
	SERVER_KEY string

	// required database login fields, fails upon any errors

	DB_HOST string
	DB_PORT string
	DB_USER string
	DB_PWD  string

	// misc behavior configs

	// time in seconds for an authentication token to expire
	// defaults to 43200 seconds / 12 hours
	TOKEN_EXPIRE_TIME uint32
	// whether or not tokens should have their expiration time reset upon use
	// defaults to false
	TOKEN_EXPIRE_REFRESH bool
	// max transmitted records in either direction during syncing
	// defaults to 1000 records
	MAX_RECORD_COUNT uint32

	// testing configs

	// clear database tables for authentication upon server launch
	// defaults to false
	CLEAR_DB_AUTH bool
	// clear database tables for user data upon server launch
	// defaults to false
	CLEAR_DB_DATA bool
	// determines if the test suite will run alongside main
	// WARNING: WILL CLEAR THE DATABASE IN ORDER TO RUN IT
	// defaults to false
	TEST_SUITE bool
	// determines length of time in seconds before the test suite initializes
	// defaults to 20 seconds
	TEST_SUITE_DELAY uint16
}
