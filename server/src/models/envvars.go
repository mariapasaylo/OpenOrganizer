/*
 * Authors: Michael Jagiello
 * Created: 2025-09-20
 * Updated: 2025-09-27
 *
 * This file declares the struct for storing all .env variables that are fetched at server initialization.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package models

type ENVVars struct {
	LOCAL_ONLY  bool
	HTTPS       bool
	SERVER_PORT string
	SERVER_CRT  string
	SERVER_KEY  string
	DB_HOST     string
	DB_PORT     string
	DB_USER     string
	DB_PWD      string
}
