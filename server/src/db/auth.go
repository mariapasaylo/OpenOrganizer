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
	"openorganizer/src/utils"
)

func hashPassword(passwordHash []byte, salt int32) []byte {
	saltA := make([]byte, 4)
	binary.LittleEndian.PutUint32(saltA, uint32(salt))
	var input []byte
	input = append(input, passwordHash...)
	input = append(input, saltA...)
	hasher := sha256.New()
	hasher.Write(input)
	return hasher.Sum(nil)
}

func authReturn(userID int64) (response []byte) {
	userIDBuf := make([]byte, 8)
	token := AddToken(userID)
	binary.LittleEndian.PutUint64(userIDBuf, uint64(userID))
	response = append(response, userIDBuf...)
	response = append(response, token...)
	return response
}

// users

// register a new account
func RegisterUser(userLogin models.UserLogin, userData models.UserData) (response []byte, err error) {
	salt := rand.Int31()
	passwordHashHash := hashPassword(userLogin.PasswordHash, salt)
	now := utils.Now()
	row, err := db.Query(usersCreate, userLogin.Username, now, now, passwordHashHash, salt, userData.EncrPrivateKey, userData.EncrPrivateKey2)
	if err != nil {
		return nil, err
	}
	var userID int64
	row.Next()
	err = row.Scan(&userID)
	response = authReturn(userID)
	return response, err
}

// try to verify username + password combo
func Login(userLogin models.UserLogin) (response []byte, err error) {
	row, err := db.Query(usersRead, userLogin.Username)
	if err != nil {
		return nil, err
	}
	defer row.Close()

	var rowUser models.RowUsers
	if !row.Next() {
		return nil, errors.New("no entry found")
	}
	if err = row.Scan(&rowUser.Username, &rowUser.UserID, &rowUser.LastUpdated, &rowUser.LastLogin,
		&rowUser.PasswordHashHash, &rowUser.Salt, &rowUser.EncrPrivateKey, &rowUser.EncrPrivateKey2); err != nil {
		fmt.Print(err)
	}

	passwordHashHash := hashPassword(userLogin.PasswordHash, rowUser.Salt)
	if !reflect.DeepEqual(passwordHashHash, rowUser.PasswordHashHash) {
		return nil, errors.New("incorrect password")
	}
	_, _ = db.Query(usersUpdateLastLogin, userLogin.Username, utils.Now())
	response = authReturn(rowUser.UserID)
	response = append(response, rowUser.EncrPrivateKey...)
	response = append(response, rowUser.EncrPrivateKey2...)
	return response, nil
}

// change user information
func ModifyUser(userLogin models.UserLogin, userLoginNew models.UserLogin, userData models.UserData) (response []byte, err error) {
	response, err = Login(userLogin)
	if err != nil {
		return nil, err
	}

	salt := rand.Int31()
	passwordHashHash := hashPassword(userLogin.PasswordHash, salt)
	now := utils.Now()
	_, err = db.Query(usersUpdate, userLoginNew.Username, now, now, passwordHashHash, salt, userData.EncrPrivateKey, userData.EncrPrivateKey2)
	return response, err
}

// tokens

// create auth token and store
func AddToken(userID int64) (token []byte) {
	token = utils.RandArray(32)
	now := utils.Now()
	// currently hardcoded for 28 days before expiration, will add to .env later
	expirationTime := now + 2419200000
	_, _ = db.Query(tokensCreate, userID, now, expirationTime, token)
	return token
}

// check if token is valid
func CheckTokenAuth(userID int64, token []byte) {

}
