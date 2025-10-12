/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-12
 *
 * This file provides authentication functionality that interfaces with the database.
 * This includes CRUD operations on user accounts and tokens.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package db

import (
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"math/rand"
	"reflect"

	"openorganizer/src/models"
)

func hashPassword(passwordHash []byte, salt int32) []byte {
	var saltA = make([]byte, 4)
	binary.LittleEndian.PutUint32(saltA, uint32(salt))
	var input []byte
	input = append(input, passwordHash...)
	input = append(input, saltA...)
	hasher := sha256.New()
	hasher.Write(input)
	return hasher.Sum(nil)
}

// users

// register a new account
func RegisterUser(userLogin models.UserLogin, userData models.UserData) error {
	salt := rand.Int31()
	var passwordHashHash []byte = hashPassword(userLogin.PasswordHash, salt)
	_, err := db.Query(usersCreate, userLogin.Username, 1, 1, passwordHashHash, salt, userData.EncrPrivateKey, userData.EncrPrivateKey2)
	return err
}

// try to verify username + password combo
func Login(userLogin models.UserLogin) error {
	row, err := db.Query(usersRead, userLogin.Username)
	if err != nil {
		return err
	}
	defer row.Close()

	var rowUser models.RowUsers
	if !row.Next() {
		return errors.New("no entry found")
	}
	if err = row.Scan(&rowUser.Username, &rowUser.UserID, &rowUser.LastUpdated, &rowUser.LastLogin,
		&rowUser.PasswordHashHash, &rowUser.Salt, &rowUser.EncrPrivateKey, &rowUser.EncrPrivateKey2); err != nil {
		fmt.Print(err)
	}

	var passwordHashHash []byte = hashPassword(userLogin.PasswordHash, rowUser.Salt)
	if reflect.DeepEqual(passwordHashHash, rowUser.PasswordHashHash) {
		return nil
	}
	return errors.New("incorrect password")
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
