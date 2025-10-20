/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-18
 *
 * This file declares general utilities that are useful helper functions across many areas.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package utils

import (
	"crypto/rand"
	"encoding/binary"
	"time"
)

// add non-nil error to chan of errors
func AddError(err error, errs chan error) {
	if err != nil {
		errs <- err
	}
}

func Now() int64 {
	return time.Now().UnixMilli()
}

func RandArray(length int32) []byte {
	array := make([]byte, length)
	rand.Read(array)
	return array
}

// byte array to integer

func BytesToBigint(eight []byte) int64 {
	return int64(binary.LittleEndian.Uint64(eight))
}

func BytesToInt(four []byte) int32 {
	return int32(binary.LittleEndian.Uint32(four))
}

func BytesToSmallint(two []byte) int16 {
	return int16(binary.LittleEndian.Uint16(two))
}

// integer to byte array

func BigintToBytes(value int64) (eight []byte) {
	eight = make([]byte, 8)
	binary.LittleEndian.PutUint64(eight, uint64(value))
	return eight
}

func IntToBytes(value int32) (four []byte) {
	four = make([]byte, 4)
	binary.LittleEndian.PutUint32(four, uint32(value))
	return four
}

func SmallintToBytes(value int16) (two []byte) {
	two = make([]byte, 2)
	binary.LittleEndian.PutUint16(two, uint16(value))
	return two
}
