/*
 * Authors: Michael Jagiello
 * Created: 2025-10-11
 * Updated: 2025-10-12
 *
 * This file declares structs for all database tables.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
 */

package models

type RowUsers struct {
	Username         []byte // size 32
	UserID           int64
	LastUpdated      int64
	LastLogin        int64
	PasswordHashHash []byte // size 32
	Salt             int32
	EncrPrivateKey   []byte // size 32
	EncrPrivateKey2  []byte // size 32
}

type RowTokens struct {
	UserID         int64
	CreationTime   int64
	ExpirationTime int64
	AuthToken      []byte // size 32
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
	EncryptedData []byte // size depends on table
}

type RowExtensions struct {
	UserID        int64
	ItemID        int64
	LastModified  int64
	LastUpdated   int64
	SequenceNum   int32
	EncryptedData []byte // size 64
}

type RowOverrides struct {
	UserID        int64
	ItemID        int64
	LastModified  int64
	LastUpdated   int64
	LinkedItemID  int64
	EncryptedData []byte // size 64
}

type RowFolders struct {
	UserID        int64
	FolderID      int64
	LastModified  int64
	LastUpdated   int64
	EncryptedData []byte // size 64
}

type RowDeleted struct {
	UserID       int64
	ItemID       int64
	LastModified int64
	LastUpdated  int64
	ItemTable    int16
}
