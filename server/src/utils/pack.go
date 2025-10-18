/*
 * Authors: Michael Jagiello
 * Created: 2025-10-12
 * Updated: 2025-10-18
 *
 * This file defines functions for turning byte arrays into structs and vice versa to handle receiving/transmitting HTTP response bodies.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package utils

import (
	"encoding/binary"
	"errors"

	"openorganizer/src/models"
)

// unpack turns received buffer into memory struct(s)

func UnpackRegister(requestBody []byte) (userLogin models.UserLogin, userData models.UserData) {
	userLogin = models.UserLogin{
		Username:     requestBody[0:32],
		PasswordHash: requestBody[32:64],
	}
	userData = models.UserData{
		EncrPrivateKey:  requestBody[64:96],
		EncrPrivateKey2: requestBody[96:128],
	}
	return userLogin, userData
}

func UnpackLogin(requestBody []byte) (userLogin models.UserLogin) {
	userLogin = models.UserLogin{
		Username:     requestBody[0:32],
		PasswordHash: requestBody[32:64],
	}
	return userLogin
}

func UnpackChangeLogin(requestBody []byte) (userLogin models.UserLogin, userLoginNew models.UserLogin, userData models.UserData) {
	userLogin = models.UserLogin{
		Username:     requestBody[0:32],
		PasswordHash: requestBody[32:64],
	}
	userLoginNew = models.UserLogin{
		Username:     requestBody[64:96],
		PasswordHash: requestBody[96:128],
	}
	userData = models.UserData{
		EncrPrivateKey:  requestBody[128:160],
		EncrPrivateKey2: requestBody[160:192],
	}
	return userLogin, userLoginNew, userData
}

func UnpackUserAuth(requestBody []byte) (userAuth models.UserAuth) {
	userAuth = models.UserAuth{
		UserID:    int64(binary.LittleEndian.Uint64(requestBody[0:8])),
		AuthToken: requestBody[8:40],
	}
	return userAuth
}

func UnpackSyncupHeader(requestBody []byte) (userAuth models.UserAuth, recordCount uint32) {
	userAuth = UnpackUserAuth(requestBody)
	recordCount = binary.LittleEndian.Uint32(requestBody[40:44])
	return userAuth, recordCount
}

func UnpackSyncdownHeader(requestBody []byte) (userAuth models.UserAuth, startTime int64, endTime int64) {
	userAuth = UnpackUserAuth(requestBody)
	startTime = int64(binary.LittleEndian.Uint64(requestBody[40:48]))
	endTime = int64(binary.LittleEndian.Uint64(requestBody[48:56]))
	return userAuth, startTime, endTime
}

// pack turns memory struct(s) into buffer to send

func PackAuth(userAuth models.UserAuth) (responseBody []byte) {
	responseBody = append(responseBody, BigintToBytes(userAuth.UserID)...)
	responseBody = append(responseBody, userAuth.AuthToken...)
	return responseBody
}

func PackLastUpdated(row models.RowLastUpdated) (responseBody []byte) {
	responseBody = append(responseBody, BigintToBytes(row.LastUpNotes)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpReminders)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpDaily)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpWeekly)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpMonthly)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpYearly)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpExtensions)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpOverrides)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpFolders)...)
	responseBody = append(responseBody, BigintToBytes(row.LastUpDeleted)...)
	return responseBody
}

func PackItems(rows []models.RowItems, encrDataLength int) (responseBody []byte, err error) {
	var recordCount uint32 = 0
	responseBody = append(responseBody, []byte("\x00\x00\x00\x00")...)
	for _, row := range rows {
		recordCount++
		responseBody = append(responseBody, BigintToBytes(row.ItemID)...)
		responseBody = append(responseBody, BigintToBytes(row.LastModified)...)
		if len(row.EncryptedData) != encrDataLength {
			return nil, errors.New("data is not of expected length")
		}
		responseBody = append(responseBody, row.EncryptedData...)
	}
	copy(IntToBytes(int32(recordCount)), responseBody)
	return responseBody, nil
}

func PackExtensions(rows []models.RowExtensions, encrDataLength int) (responseBody []byte, err error) {
	var recordCount uint32 = 0
	responseBody = append(responseBody, []byte("\x00\x00\x00\x00")...)
	for _, row := range rows {
		recordCount++
		responseBody = append(responseBody, BigintToBytes(row.ItemID)...)
		responseBody = append(responseBody, BigintToBytes(row.LastModified)...)
		responseBody = append(responseBody, IntToBytes(row.SequenceNum)...)
		if len(row.EncryptedData) != encrDataLength {
			return nil, errors.New("data is not of expected length")
		}
		responseBody = append(responseBody, row.EncryptedData...)
	}
	copy(IntToBytes(int32(recordCount)), responseBody)
	return responseBody, nil
}

func PackOverrides(rows []models.RowOverrides, encrDataLength int) (responseBody []byte, err error) {
	var recordCount uint32 = 0
	responseBody = append(responseBody, []byte("\x00\x00\x00\x00")...)
	for _, row := range rows {
		recordCount++
		responseBody = append(responseBody, BigintToBytes(row.ItemID)...)
		responseBody = append(responseBody, BigintToBytes(row.LastModified)...)
		responseBody = append(responseBody, BigintToBytes(row.LinkedItemID)...)
		if len(row.EncryptedData) != encrDataLength {
			return nil, errors.New("data is not of expected length")
		}
		responseBody = append(responseBody, row.EncryptedData...)
	}
	copy(IntToBytes(int32(recordCount)), responseBody)
	return responseBody, nil
}

func PackFolders(rows []models.RowFolders, encrDataLength int) (responseBody []byte, err error) {
	var recordCount uint32 = 0
	responseBody = append(responseBody, []byte("\x00\x00\x00\x00")...)
	for _, row := range rows {
		recordCount++
		responseBody = append(responseBody, BigintToBytes(row.FolderID)...)
		responseBody = append(responseBody, BigintToBytes(row.LastModified)...)
		if len(row.EncryptedData) != encrDataLength {
			return nil, errors.New("data is not of expected length")
		}
		responseBody = append(responseBody, row.EncryptedData...)
	}
	copy(IntToBytes(int32(recordCount)), responseBody)
	return responseBody, nil
}

func PackDeleted(rows []models.RowDeleted) (responseBody []byte) {
	var recordCount uint32 = 0
	responseBody = append(responseBody, []byte("\x00\x00\x00\x00")...)
	for _, row := range rows {
		recordCount++
		responseBody = append(responseBody, BigintToBytes(row.ItemID)...)
		responseBody = append(responseBody, BigintToBytes(row.LastModified)...)
		responseBody = append(responseBody, SmallintToBytes(row.ItemTable)...)
	}
	copy(IntToBytes(int32(recordCount)), responseBody)
	return responseBody
}
