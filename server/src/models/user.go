/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-11
 *
 * This file defines a few helper structs for passing user information as a single function parameter.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package models

type UserLogin struct {
	Username     [32]byte
	PasswordHash [32]byte
}

type UserData struct {
	EncrPrivateKey  [32]byte
	EncrPrivateKey2 [32]byte
}
