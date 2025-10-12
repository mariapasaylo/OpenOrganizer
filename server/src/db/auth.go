/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-11
 *
 *
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package db

import (
	"fmt"
	"openorganizer/src/models"
)

// users

// register a new account
func RegisterUser(userLogin models.UserLogin, userData models.UserData) {
	fmt.Printf("%s & %s", userLogin.Username, userLogin.PasswordHash)
}

// try to verify username + password combo
func Login(userLogin models.UserLogin) {

}

// change user information
func ModifyUser(userLogin models.UserLogin, userLoginNew models.UserLogin, userData models.UserData) {

}

// tokens

// create auth token and store
func AddToken(userID int64) {

}

// check if token is valid
func CheckTokenAuth(userID int64, token []byte) {

}
