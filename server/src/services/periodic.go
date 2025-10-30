/*
 * Authors: Michael Jagiello
 * Created: 2025-10-30
 * Updated: 2025-10-30
 *
 * This file declares the function for periodic actions the server does.
 * For example, it currently purges expired authTokens from the database.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package services

import (
	"time"

	"openorganizer/src/db"
	"openorganizer/src/models"
)

func LaunchPeriodics(env models.ENVVars) {
	go func() {
		purgeExpiredTokens(env)
	}()
}

func purgeExpiredTokens(env models.ENVVars) {
	var sleepTime time.Duration = time.Duration(env.TOKEN_PURGE_INTERVAL)
	for {
		time.Sleep(sleepTime * time.Second)
		db.ClearExpiredTokens()
	}
}
