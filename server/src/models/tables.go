/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-11
 *
 * This file declares structs for all database tables.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package models

type RowUsers struct {
	Username         [32]byte
	UserID           int64
	LastUpdated      int64
	LastLogin        int64
	PasswordHashHash [32]byte
	Salt             int32
	EncrPrivateKey   [32]byte
	EncrPrivateKey2  [32]byte
}

type RowTokens struct {
	UserID         int64
	CreationTime   int64
	ExpirationTime int64
	AuthToken      [32]byte
}

type RowLastUpdated struct {
	UserID           int64
	LastUpNotes      int64
	LastUpReminders  int64
	LastUpDaily      int64
	LastUpWeekly     int64
	LastUpMonthly    int64
	LastUpYearly     int64
	LastUpExtensions int64
	LastUpOverrides  int64
	LastUpFolders    int64
	LastUpDeleted    int64
}

// any item, so notes and all reminder types
type RowItems struct {
	UserID        int64
	ItemID        int64
	LastModified  int64
	LastUpdated   int64
	EncryptedData [32]byte
}

type RowExtensions struct {
	UserID        int64
	ItemID        int64
	LastModified  int64
	LastUpdated   int64
	SequenceNum   int32
	EncryptedData [32]byte
}

type RowOverrides struct {
	UserID        int64
	ItemID        int64
	LastModified  int64
	LastUpdated   int64
	LinkedItemID  int64
	EncryptedData [32]byte
}

type RowFolders struct {
	UserID        int64
	FolderID      int64
	LastModified  int64
	LastUpdated   int64
	EncryptedData [32]byte
}

type RowDeleted struct {
	UserID       int64
	ItemID       int64
	LastModified int64
	LastUpdated  int64
	ItemTable    int16
}
