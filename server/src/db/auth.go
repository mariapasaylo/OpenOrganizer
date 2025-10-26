/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-26
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
	"errors"
	"math/rand"
	"reflect"

	"openorganizer/src/models"
	"openorganizer/src/utils"
)

func ValidateUsername(username []byte) bool {
	for i := range username {
		if username[i] == '\x00' {
			return false
		}
	}
	return true
}

func hashPassword(passwordHash []byte, salt int32) []byte {
	var input []byte
	input = append(input, passwordHash...)
	input = append(input, utils.IntToBytes(salt)...)
	hasher := sha256.New()
	hasher.Write(input)
	return hasher.Sum(nil)
}

// users

// register a new account
func RegisterUser(userLogin models.UserLogin, userData models.UserData) (response []byte, err error) {
	salt := rand.Int31()
	passwordHashHash := hashPassword(userLogin.PasswordHash, salt)
	now := utils.Now()
	row, err := db.Query(userCreate, userLogin.Username, now, now, passwordHashHash, salt, userData.EncrPrivateKey, userData.EncrPrivateKey2)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	var userID int64
	row.Next()
	err = row.Scan(&userID)

	token, err := addToken(userID)
	userAuth := models.UserAuth{
		UserID:    userID,
		AuthToken: token,
	}
	response = utils.PackAuth(userAuth)
	_, _ = db.Query(lastupCreate, userID, now)
	return response, err
}

// try to verify username + password combo
func Login(userLogin models.UserLogin) (response []byte, err error) {
	row, err := db.Query(userRead, userLogin.Username)
	if err != nil {
		return nil, err
	}
	defer row.Close()

	var rowUser models.RowUsers
	if !row.Next() {
		return nil, errors.New("no entry found")
	}
	err = row.Scan(&rowUser.Username, &rowUser.UserID, &rowUser.LastUpdated, &rowUser.LastLogin,
		&rowUser.PasswordHashHash, &rowUser.Salt, &rowUser.EncrPrivateKey, &rowUser.EncrPrivateKey2)
	if err != nil {
		return nil, err
	}

	passwordHashHash := hashPassword(userLogin.PasswordHash, rowUser.Salt)
	if !reflect.DeepEqual(passwordHashHash, rowUser.PasswordHashHash) {
		return nil, errors.New("incorrect password")
	}
	_, _ = db.Query(userUpdateLastLogin, userLogin.Username, utils.Now())

	token, err := addToken(rowUser.UserID)
	userAuth := models.UserAuth{
		UserID:    rowUser.UserID,
		AuthToken: token,
	}
	response = utils.PackAuth(userAuth)
	response = append(response, rowUser.EncrPrivateKey...)
	response = append(response, rowUser.EncrPrivateKey2...)
	return response, nil
}

// change user information
func ModifyUser(userLogin models.UserLogin, userLoginNew models.UserLogin, userData models.UserData) (response []byte, err error) {
	salt := rand.Int31()
	passwordHashHash := hashPassword(userLoginNew.PasswordHash, salt)
	now := utils.Now()
	row, err := db.Query(userUpdate, userLogin.Username, userLoginNew.Username, now, now, passwordHashHash, salt, userData.EncrPrivateKey, userData.EncrPrivateKey2)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	if !row.Next() {
		return nil, errors.New("no entry found")
	}

	var userAuth models.UserAuth
	err = row.Scan(&userAuth.UserID)
	if err != nil {
		return nil, err
	}
	ClearTokensFromUser(userAuth.UserID)
	userAuth.AuthToken, err = addToken(userAuth.UserID)
	return utils.PackAuth(userAuth), err
}

// tokens

// create auth token and store
func addToken(userID int64) (token []byte, err error) {
	token = utils.RandArray(32)
	now := utils.Now()
	expirationTime := now + (int64(tokenExpireTime) * 1000)
	_, err = db.Query(tokensCreate, userID, now, expirationTime, token)
	return token, err
}

// check if token is valid, and update the expiration time if setting is active
func CheckTokenAuth(userAuth models.UserAuth) bool {
	row, err := db.Query(tokenReadTimes, userAuth.UserID, userAuth.AuthToken)
	if err != nil {
		return false
	}
	defer row.Close()
	if !row.Next() {
		return false
	}
	var creationTime, expirationTime int64
	_ = row.Scan(&creationTime, &expirationTime)
	expired := expirationTime < utils.Now()
	if tokenExpireRefresh && !expired {
		refreshTokenExpiration(userAuth.UserID, creationTime)
		return true
	}
	return expired
}

func refreshTokenExpiration(userID int64, creationTime int64) {
	newExpirationTime := utils.Now() + (int64(tokenExpireTime) * 1000)
	_, _ = db.Query(tokenUpdateExpiration, userID, creationTime, newExpirationTime)
}

func ClearTokensFromUser(userID int64) {
	_, _ = db.Query(tokensDeleteAllFromUser, userID)
}

func ClearExpiredTokens(expirationTime int64) {
	_, _ = db.Query(tokensDeleteExpiredByTime, expirationTime)
}

func DeleteUser(username string) {
	row, err := db.Query(userDelete, username)
	if err != nil {
		return
	}
	defer row.Close()
	if !row.Next() {
		return
	}
	var userID int64
	_ = row.Scan(&userID)
	_, _ = db.Query(tokensDeleteAllFromUser, userID)
	_, _ = db.Query(lastupDelete, userID)
	_, _ = db.Query(userDeleteAllDataTables, userID)
}
