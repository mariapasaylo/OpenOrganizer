<!--
 * Authors: Rachel Patella, Maria Pasaylo
 * Created: 2025-09-22
 * Updated: 2025-10-28
 *
 * This file is the main home page that includes the calendar view, notes/reminders list, 
 * and a file explorer as a 3 column grid layout.
 *
 * References:
 * https://quasar.dev/vue-components/card/
 * https://quasar.dev/vue-components/tabs/
 * https://vuejs.org/guide/essentials/list to render reminder cards in a list
 * https://qcalendar.netlify.app/developing/qcalendar-month-mini-mode#mini-mode-theme for qcalendar code
 * https://vuejs.org/guide/essentials/watchers and https://codepen.io/mamyraoby/pen/zYaKwzZ for how to implement select all with checkboxes
 * https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript for building a nested folder data structure
 * https://qcalendar.netlify.app/developing/qcalendar-month for qcalendar month components and rendering slots of reminders
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and 
 * license terms outlined in the LICENSE file located in the top-level directory of 
 * this distribution. No part of OpenOrganizer, including this file, may be reproduced, 
 * modified, distributed, or otherwise used except in accordance with the terms 
 * specified in the LICENSE file.
-->

<template>
  <div class="calendar-container">
    <q-dialog v-model="showSettings">
      <q-card style="width: 500px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Settings</div>
          <div class="settings-container">
            <div class="settings-sidebar">
              <q-tabs v-model="tab" vertical>
                <q-tab style="color: #474747" name="cloud" label="Cloud" icon="cloud" />
                <q-tab style="color: #474747" name="local" label="Local" icon="storage" />
              </q-tabs>
            </div>
            <div v-if="tab === 'cloud'">
              <q-toggle style="size:2px; font-size:18px" v-model="isCloudOn" label="Cloud Sync" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
      <q-dialog v-model="showAddFolderName">
      <q-card style="width: 500px" class="q-px-sm q-pb-md">
        <q-card-section>
        <!-- Error state will change to true if folderNameErrorMessage is set to true (in addFolder function)-->
        <q-input
          v-model="newFolderName"
          :error="folderNameErrorMessage != ''"
          :error-message="folderNameErrorMessage"
          placeholder ="Enter name of new folder here..."
        />
        <q-btn class="login-register-button" style="font-size: 15px; margin-right: 10px" flat label="Add" @click="addFolder"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Left column - File Explorer top row-->
    <div style="grid-area: file-explorer-search; padding: 20px" data-area="file-explorer-search">
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="Search notes here..."
        class="search-input"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
     <!-- Left column - File Explorer middle row-->
      <div style="grid-area: file-explorer-folders; padding: 0px 10px; display: flex; flex-direction: column; height: 100%" data-area="file-explorer-folders">
        <!-- Breadcrumb path component itself -->
        <q-breadcrumbs>
          <q-breadcrumbs-el label="" />
        </q-breadcrumbs>
        <q-breadcrumbs>
          <!-- Each selectable item in breadcrumb path -->
            <q-breadcrumbs-el
            v-for="crumb in breadcrumbs"
            :key="String(crumb.id)"
            :label="crumb.label"
            @click="selectBreadcrumbItem(crumb.id)"
          /> 
        </q-breadcrumbs>
        <q-tree 
          :nodes="qNestedTree"
          node-key="id"
          no-connectors
          default-expand-all
          v-model:selected="selectedFolderID"
        />
        <div style="display: flex; align-items: center; margin-top: auto; gap: 4px;">
          <!-- Clear folder error message when dialog first pops up -->
          <q-btn style="font-size: 1rem; color: #474747;" flat  icon="add"  label="Add Folder" @click="showAddFolderName = true; folderNameErrorMessage = ''" />
        </div>
      </div>
      
      <!-- Left column - File Explorer bottom row-->
      <div style="grid-area: file-explorer-cloud; padding: 20px 30px; display: flex; border-top: 1px solid #adadadcc; align-items: center; gap: 8px;" data-area="file-explorer-cloud">
        <div style="color: #474747; font-size: 1.15rem;">Cloud Not Synced</div>
        <q-icon name="cloud_off" size="20px" style="color: #474747" />
      </div>
      
    <!-- Middle column - List View of Notes/Reminders -->
    <div class="grid-seperator" style="background-color: #efefef; grid-area: reminder-notes;">
      <q-tabs v-model="tab" class="calendar-tabs dense">
        <q-tab name="reminders" icon="alarm" label="Reminders" />
        <q-tab name="notes" icon="note" label="Notes" />
      </q-tabs>
      <div class="row justify-between items-center">
        <div class="row items-center">
          <q-btn style="font-size: 15px" flat icon="add" @click="addArrayItem" class="q-mr-sm" />
          <q-checkbox v-model="selectAll" color="primary" label="Select All" />
        </div>
        <q-btn style="font-size: 15px" flat icon="delete" @click="deleteArrayItem"></q-btn>
      </div>
      <div class="reminder-note-card-container">
        <div v-if="tab === 'reminders'">
          <!-- Reminder Cards -->
          <q-card class="reminder-note-cards" v-for="item in filteredReminders" :key="String(item.itemID)">
            <q-expansion-item v-model="item.expanded" expand-icon="keyboard_arrow_down">
              <template v-slot:header>
                  <div class="reminder-header-container">
                    <q-checkbox :color="getEventTypeColor(eventTypes, item.eventType)" v-model="item.isSelected" class="q-mr-sm" />
                    <q-input
                      v-model="item.temporaryTitle"
                      :error="item.titleMessageError != ''"
                      :error-message="item.titleMessageError"
                      placeholder="Enter reminder title..."
                      borderless
                      dense
                      style="max-width: 300px; padding-top: 20px"
                      @click.stop
                      @focus.stop
                      />
                    </div>
              </template>
              <q-card-section>
                 <q-select
                v-model="item.eventType"
                :options="eventTypeOptions"
                label="Event Type"
                emit-value
                map-options
                dense
                outlined
                style="background-color: #f2f2f2; margin-bottom: 10px"
              />
                <q-select
                v-model="item.temporaryFolderID"
                :options="folderDropdownOptions"
                label="Save in folder"
                emit-value 
                map-options
                dense
                outlined
                style="background-color: #f2f2f2; margin-bottom: 10px"
              />
              <q-select
                v-model="item.temporaryNotificationTime"
                :options="notificationOptions"
                label="Remind me:"
                emit-value 
                map-options
                dense
                outlined
                style="background-color: #f2f2f2; margin-bottom: 10px"
              />
              <q-input
                  v-model="item.temporaryEventStartTime"
                  :label="getEventStartLabel(item.eventType)"
                  type="time"
                  outlined
                  dense
                  style="background-color: #f2f2f2; margin-bottom: 10px"
                />
                <q-input
                  v-model="item.temporaryEventEndTime"
                  :label="getEventEndLabel(item.eventType)"
                  type="time"
                  outlined
                  dense
                  style="background-color: #f2f2f2; margin-bottom: 10px"
                />
              <!-- Render fields for selected event type - each input corresponds to its type -->
              <div v-for="field in getEventTypeFields(eventTypes, item.eventType)" :key="field.id" style="margin-bottom: 10px">
                <q-input
                 v-if="field.type === 'text'"
                  v-model="item.extension[field.id]"
                  :type="field.type"
                  :label="field.name"
                  outlined
                  dense
                  style="background-color: #f2f2f2"
                />
                <q-input
                v-else-if="field.type === 'number'"
                v-model.number="item.extension[field.id]"
                :label="field.name"
                type="number"
                dense
                outlined
                style="background-color: #f2f2f2"
              />
              <q-input
                v-else-if="field.type === 'time'"
                v-model="item.extension[field.id]"
                :label="field.name"
                type="time"
                dense
                outlined
                style="background-color: #f2f2f2"
              />
              </div>
              <!-- Use seperate v-if for error instead of :error prop because it's validating two inputs (arrival & departure) instead of 1 -->
              <div v-if="item.timeMessageError" style="color: #f44336; font-size: 13px; margin-bottom: 8px;">
                {{ item.timeMessageError }}
              </div>
                <div class="row">
                  <q-btn class="login-register-button" style="font-size: 15px; margin-right: 10px" flat label="Save"
                    @click="saveReminder(item)"></q-btn>
                  <q-btn class="login-register-button" style="background-color: grey; font-size: 15px" flat
                    label="Cancel"></q-btn>
                </div>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
        <div v-if="tab === 'notes'">
          <!-- Note Cards -->
          <q-card class="reminder-note-cards" v-for="(item, index) in filteredNotes" :key="index">
            <q-expansion-item v-model="item.expanded" expand-icon="keyboard_arrow_down">
              <template v-slot:header>
                <div class="reminder-header-container">
                  <q-checkbox v-model="item.isSelected" class="q-mr-sm" />
                  <q-input
                      v-model="item.temporaryTitle"
                      :error="item.titleMessageError != ''"
                      :error-message="item.titleMessageError"
                      placeholder="Enter note title..."
                      borderless
                      dense
                      style="max-width: 300px; padding-top: 20px"
                      @click.stop
                      @focus.stop
                    />
                </div>
              </template>
              <!-- Emit-value makes it so the dropdown option only saves the value (ex. folder id = 1 rather than the whole object {folder: name, id, etc.}) -->
              <q-card-section>
                <q-select
                v-model="item.temporaryFolderID"
                :options="folderDropdownOptions"
                label="Save in folder"
                emit-value 
                map-options
                dense
                outlined
                style="background-color: #f2f2f2; margin-bottom: 10px"
              />
                <q-input class="note-box" outlined v-model="item.temporaryText" type="textarea"
                  placeholder="Write your note here..." />
                <div class="row">
                  <!-- Pass in current note item from v-for to save that specific note -->
                  <q-btn class="login-register-button" style="font-size: 15px; margin-right: 10px" flat label="Save"
                    @click="saveNote(item)"></q-btn>
                  <q-btn class="login-register-button" style="background-color: grey; font-size: 15px" flat
                    label="Cancel"></q-btn>
                </div>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Right column - Calendar (top row) -->
    <div style="grid-area: calendar; padding: 20px" data-area="calendar">
      <div style="display: flex; justify-content: center">
        <div style="
            max-width: 400px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
          ">
          <div style="width: 100%; display: flex; justify-content: space-evenly">
            <div style="width: 50%; display: flex; justify-content: space-between">
              <span class="q-button" style="cursor: pointer; user-select: none;" @click="onToday">Today</span>
              <span class="q-button" style="cursor: pointer; user-select: none" @click="onPrev">&lt;</span>
              {{ formattedMonth }}
              <span class="q-button" style="cursor: pointer; user-select: none" @click="onNext">&gt;</span>
            </div>
            <div style="width: 30%; display: flex; justify-content: space-between">
              <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(-1)">&lt;</span>
              {{ selectedYear }}
              <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(1)">&gt;</span>
            </div>
          </div>
          <div style="display: flex; justify-content: center; align-items: center;">
            <div style="display: flex; max-width: 500px; width: 100%; flex-direction: column;"> 
              <q-calendar-month ref="calendar" v-model="selectedDate" mini-mode hoverable focusable
                :focus-type="['date', 'weekday']" :min-weeks="6" animated @change="onChange" @moved="onMoved"
                @click-date="onClickDate" @click-day="onClickDay" @click-workweek="onClickWorkweek"
                @click-head-workweek="onClickHeadWorkweek" @click-head-day="onClickHeadDay" style="height: 400px;" >
                <template #day="{ scope: { timestamp } }">
              <template v-for="event in eventsMap[timestamp.date]" :key="String(event.id)">
                <div
                  :class="['text-white', `bg-${event.color}`, 'row', 'justify-start', 'items-center', 'no-wrap', 'event-card']"
                  style="width: 100%; margin: 1px 0 0 0; padding: 0 2px; font-size: 12px; cursor: pointer;"
                >
                  <div class="event-title" style="width: 100%; max-width: 100%;">
                  {{ event.title }}
                  </div>
                </div>
              </template>
            </template>
              </q-calendar-month>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column - Spacer (middle row, can be empty) -->
    <div style="grid-area: calendar-spacer;" data-area="calendar-spacer"></div>

    <!-- Right column - Settings/Account Buttons (bottom row) -->
    <div style="grid-area: account-settings; padding: 20px 30px; border-top: 1px solid #adadadcc; align-items: center; gap: 8px;"  data-area="account-settings">
      <div class="row justify-between items-center">
        <q-btn class="account-and-settings-button" flat icon="account_circle" @click="$router.push('/register')" />
        <q-btn class="account-and-settings-button" flat icon="settings" @click="showSettings = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {QCalendarMonth, addToDate, parseTimestamp, today, type Timestamp} from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/index.css';
import {buildCalendarEvents, groupEventsByDate, getEventTypeColor, getEventTypeFields, getEventStartLabel, getEventEndLabel, type EventType} from '../frontend-utils/events';
import {nest, buildBreadcrumbs, convertFolderTreetoQTree,} from '../frontend-utils/tree';
import { convertTimeAndDateToTimestamp, convertNotificationTimestamp, timeStamptoEpoch, timestampToTimeString, minutesToHHMM } from '../frontend-utils/time';
import { ref, computed, watch } from 'vue';
import type { UINote, UIReminder, UIFolder } from '../types/ui-types';
import type { Note, Reminder, Folder } from '../../src-electron/types/shared-types';
import {createNote, createReminder, createFolder, createRootFolder, readNote, readReminder, readAllFolders, updateNote, updateReminder, updateFolder, deleteItem, readRemindersInRange, readNotesInRange} from '../utils/local-db'
import { onMounted } from 'vue';

// Initialize active tab to reminder by default
const tab = ref('reminders');
// Array of reminders. 
const reminders = ref<UIReminder[]>([])
// List of notification options for when to be notified for reminder
// Value is minutes before the event start time
const notificationOptions = [
  { label: 'Never', value: null },
  { label: 'At time of event', value: 0 },
  { label: '5 minutes before', value: 5 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '2 hours before', value: 120 }
  ];

  
// Array of notes
const notes = ref<UINote[]>([])
/*
// Object of event types
const eventTypes: EventType[] = [
   {
       // Generic event type (no extra type fields)
        id: 0,
        name: 'General',
        color: 'blue',
        fields: [
           { id: 'eventStartTime', name: 'Start Time', type: 'time' },
           { id: 'eventEndTime', name: 'End Time', type: 'time' },
        ]
    },
    {
       // In backend each event type is assigned an integer - ex. flight - 1, hotel = 2, etc.
        id: 1,
        // Event type name 
        name: 'Flight',
        // Color-coded for display in reminder list
        color: 'red',
        // Fields for each event type
        fields: [
            {
               // Essentially the unique ID/key of the field
                id: 'flightNumber',
               // Name of the field displayed to the user
                name: "Flight Number",
                // Type is helpful for rendering the frontend field inputs to match and input validation. 
                type: 'number'
            },
            {
                id: 'arrivalTime',
                name: "Arrival Time",
                type: 'time'
            },
            {
                id: 'departureTime',
                name: "Departure Time",
                type: 'time'
            },
            {
                id: 'airportLocation',
                name: "Airport Location",
                type: 'text'
            },
        ]
    },
    {
        id: 2,
        name: 'Hotel',
        color: 'green',
        fields: [
            {
                id: 'roomNumber',
                name: "Room Number",
                type: 'number'
            },
            {
                id: 'checkInTime',
                name: "Check-in Time",
                type: 'time'
            },
            {
                id: 'checkOutTime',
                name: "Check-out Time",
                type: 'time'
            },
            {
                id: 'hotelLocationn',
                name: "Hotel Location",
                type: 'text'
            },
        ]
    }
    // can add any more event types here
  ];
*/

// Object of event types
// Every reminder has event start time, event end time fields so these are not extensions
// These are just named differently depending on event type (ex. flight has arrival - start and departure - end times. 
// Hotel has check-in - start and check out - end times)
const eventTypes: EventType[] = [
   {
       // Generic event type (no extra type fields)
        id: 0,
        name: 'General',
        color: 'blue',
        fields: []
    },
    {
       // In backend each event type is assigned an integer - ex. flight - 1, hotel = 2, etc.
        id: 1,
        // Event type name 
        name: 'Flight',
        // Color-coded for display in reminder list
        color: 'red',
        // Fields for each event type
        fields: [
            {
               // Essentially the unique ID/key of the field
                id: 'flightNumber',
               // Name of the field displayed to the user
                name: "Flight Number",
                // Type is helpful for rendering the frontend field inputs to match and input validation. 
                type: 'number'
            },
            {
                id: 'airportLocation',
                name: "Airport Location",
                type: 'text'
            },
        ]
    },
    {
        id: 2,
        name: 'Hotel',
        color: 'green',
        fields: [
            {
                id: 'roomNumber',
                name: "Room Number",
                type: 'number'
            },
            {
                id: 'hotelLocation',
                name: "Hotel Location",
                type: 'text'
            },
        ]
    }
    // can add any more event types here
  ];


// Map event types to format for q-select dropdown menu
const eventTypeOptions = computed(() => {
  return eventTypes.map(eventType => ({
    label: eventType.name,
    value: eventType.id
  }));
});

const showSettings = ref(false);
const showAddFolderName = ref(false);
const newFolderName = ref('');
const folderNameErrorMessage = ref('');
const isCloudOn = ref(false);
const selectAll = ref(false)
const searchQuery = ref('');
// Specific folder currently selected in the file explorer tree, tracked for adding folder in that specific spot
// null is if there is no folder selected on the tree, this by default
const selectedFolderID = ref<bigint | null>(null);
const folders = ref<UIFolder[]>([]);

// Map folders to format for q-select dropdown menu
// Each option has a label (name of the option/folder in the dropdown) and a value (actual folder to save note into)
// Computed so it automatically updates whenever folders array updates (if new folder is added it shows up in the options)
const folderDropdownOptions = computed(() => {
  return folders.value.map(folder => ({
    label: folder.folderName,
    value: folder.folderID
  }));
});

// Create nested folder tree structure from flat folders array
const nestedFolderTree = computed(() => nest(folders.value, -1n));
console.log('nestedFolderTree:', JSON.stringify(nestedFolderTree.value, (_k, v) => typeof v === 'bigint' ? v.toString() : v, 2));

// Convert nested folder tree to Q-Tree format
// Computed since it relies on nestedFolderTree, so it automatically updates whenever the nested folder tree updates
const qNestedTree = computed(() => convertFolderTreetoQTree(nestedFolderTree.value, notes.value, reminders.value));
// Convert bigint to string for console display since bigint isnt JSON serializable by default
console.log('qNestedTree:', JSON.stringify(qNestedTree.value, (_k, v) => typeof v === 'bigint' ? v.toString() : v, 2));

// Computed breadcrumbs array that walks from the selected folder up to the root to build the path
const breadcrumbs = computed(() => buildBreadcrumbs(selectedFolderID.value, folders.value, notes.value, reminders.value))

// Click a breadcrumb name to select that folder in the tree
// Reactive so whenever selected folder ID changes, breadcrumb path will be ran and recomputed automatically
function selectBreadcrumbItem(folderID : bigint) {
  selectedFolderID.value = folderID;
}

// temp id generator for UI-only drafts (negative IDs)
let tempIDCounter = -1n;
// Function to add a reminder to the list on the specified calendar date
function addReminder() {
  // create a UI-only draft reminder with a temporary negative bigint ID
  const tempID = tempIDCounter--;
  // Folder to save reminder in is either root by default if nothing is selected, otherwise selected folder in tree
  const folderID = selectedFolderID.value ?? 0n;

  const draft: UIReminder = {
    itemID: tempID,
    folderID: folderID,
    eventType: 0,
    extension: {},
    title: '',
    // Draft has no notification
    temporaryNotificationTime: null,
    temporaryEventStartTime: '',
    temporaryEventEndTime: '',
    temporaryTitle: '',
    temporaryFolderID: folderID,
    date: selectedDate.value,
    titleMessageError: '',
    folderMessageError: '',
    timeMessageError: '',
    isSaved: false, // Draft - first time hitting add creates a draft reminder not yet saved
    expanded: true,
    isSelected: false
  } as UIReminder;

  // Add draft reminder to reminders array for UI rendering
  reminders.value.push(draft);
  // Close other reminders when a new one is added
  reminders.value.forEach((reminder, index) => {
    if (index < reminders.value.length - 1) {
      reminder.expanded = false
    }
  })
}

// Function to display reminders for selected calendar date
async function loadRemindersForCalendarDate(dateString: string) {
  // Compute timestamp for start and end of selected date/day, '' is treated as 00:00 in helper
  const startOfDay = convertTimeAndDateToTimestamp(dateString, '');
  const endOfDay = convertTimeAndDateToTimestamp(dateString, '23:59');

  try {
    // Read reminders for currently selected date from local DB
    const rows = await readRemindersInRange(startOfDay, endOfDay);
    // Convert each reminder in range from response to UI reminder format 
    for (const reminder of rows) {
      await mapDBToUIReminder(reminder.itemID);
    }
    // console.log('Reminders for date loaded successfully:');
  } catch (error) {
    console.error('Error loading reminders for date:', error);
  }
}

// Function to add a note to the list
function addNote() {
  // create a UI-only draft note with a temporary negative bigint ID
  const tempID = tempIDCounter--;
   // Folder to save note in is either root by default if nothing is selected, otherwise selected folder in tree
  const folderID = selectedFolderID.value ?? 0n;

   const draft: UINote = {
    itemID: tempID,
    folderID: folderID,
    title: '',
    temporaryTitle: '',
    temporaryFolderID: folderID,
    text: '',
    temporaryText: '',
    date: selectedDate.value,
    titleMessageError: '',
    folderMessageError: '',
    isSaved: false, 
    expanded: true,
    isSelected: false
  } as UINote;

  // Add draft note to notes array for UI rendering
  notes.value.push(draft);
  // Close other notes when a new one is added
  notes.value.forEach((note, index) => {
    if (index < notes.value.length - 1) {
      note.expanded = false
    }
  })
}

// Function to display notes for selected calendar date
async function loadNotesForCalendarDate(dateString: string) {
  // Compute timestamp for start and end of selected date/day, '' is treated as 00:00 in helper
  const startOfDay = convertTimeAndDateToTimestamp(dateString, '');
  const endOfDay = convertTimeAndDateToTimestamp(dateString, '23:59');

  try {
    // Read notes for currently selected date from local DB
    const rows = await readNotesInRange(startOfDay, endOfDay);
    // Convert each note in range from response to UI note format
    for (const note of rows) {
      await mapDBToUINote(note.itemID);
    }
    // console.log('Notes for date loaded successfully:');
  } catch (error) {
    console.error('Error loading notes for date:', error);
  }
}

// Root folder should always exist
async function addRootFolder() {
  try {
    // Try to load existing folders from local db
    const folders = mapDBToUIFolder(await readAllFolders());
    // If no root folder exists (no folders with parentFolderID === -1), create one
    const hasRootFolder = folders.some(folder => folder.parentFolderID === -1n || folder.folderID === 0n);
    if (!hasRootFolder) {
      await createRootFolder(-1);
      console.log('Root folder created.', folders);
      // Refresh folder list after creating root folder
      await readAllFolders();
    }
    else {
      // Root folder already exists
      console.log('Root folder already exists.');
    }
  }
  catch (error) {
    console.error('Error adding root folder:', error);
  }
}
  

// Map a DB reminder row into the UI reminder shape needed for card display
async function mapDBToUIReminder(itemID: number | bigint): Promise<UIReminder | null> {
  // Convert incoming item ID to bigint 
  const bigintID: bigint = (typeof itemID === 'bigint') ? itemID : BigInt(itemID);

  // Read newly created reminder from local DB
  const row = await readReminder(bigintID);
  if (!row) {
    console.error('Reminder not found in DB for itemID:', itemID);
    return null;
  }

  // Derive a yyyy-mm-dd date string from DB row for UI so card appears under correct original event/calendar date
  // Testing with selected date on calendar, replace later
  const date = selectedDate.value;

  // Add extension onto reminder row type at compile time
  const typedRow = row as Reminder & { extension?: Record<string, string | number | null> };

  // Build extension row time fields from database stored dayOfMin value (to properly format and display)
  const ext: Record<string, string | number | null> = { ...(typedRow.extension ?? {}) };

  // Derive HH:MM time strings for display from database stored minutes of day value
  // Convert event start and end min into HH:MM string
  const startStr = (typeof row.eventStartMin === 'number') ? minutesToHHMM(row.eventStartMin) : '';
  const endStr = (typeof row.eventEndMin === 'number') ? minutesToHHMM(row.eventEndMin) : '';

  const eventStartMin = typeof row.eventStartMin === 'number' ? row.eventStartMin : null;
  const notifMin = typeof row.notifMin === 'number' ? row.notifMin : null;
  // Compute dropdown remind me option (ex. 5 mins before event time)
  const minutesBeforeStartTime = (row.hasNotif === 1 && eventStartMin != null && notifMin != null) ? eventStartMin - notifMin : null;

 // Need to add fields to the DB reminder row specific to the UI card
 // Sets temporary fields to saved values from DB
  const UIReminder = {
    // Copy all fields from DB shared type 
    ...row,
    // normalize itemID and folder IDs to bigint so they match folder IDs used by the tree
    itemID: (typeof row.itemID === 'bigint') ? row.itemID : BigInt(row.itemID),
    folderID: (typeof row.folderID === 'bigint') ? row.folderID : BigInt(row.folderID ),
    temporaryFolderID: row.folderID == null ? null : ((typeof row.folderID === 'bigint') ? row.folderID : BigInt(row.folderID)),
    // Add on UI specific fields
    temporaryTitle: row.title ?? '',
    // Replace this with actual extension fields later when support is added 
    extension: ext,
    temporaryEventStartTime: startStr,
    temporaryEventEndTime: endStr,
    // If theres a notification, temporary notification time is reminder notification minute of day 
    temporaryNotificationTime: minutesBeforeStartTime,
    date,
    titleMessageError: '',
    folderMessageError: '',
    timeMessageError: '',
    isSaved: true,
    expanded: true,
    isSelected: false
  } as UIReminder;

  // Compute index for a reminder for card display, use itemID as unique index
  // Look for existing reminder in reminders array that matches the itemID of the newly created reminder
  const index = reminders.value.findIndex(reminder => String(reminder.itemID) === String(UIReminder.itemID));
  if (index >= 0) {
    // If found, replace preexisting reminder in array with new UI object
    reminders.value[index] = UIReminder;
  } else {
    // If not found, add new UI object reminder to the array
    reminders.value.push(UIReminder);
  }

  return UIReminder;
}

// Map a DB folder row into the UI folder shape
function mapDBToUIFolder(rows: Folder[]): UIFolder[] {
 return (rows ?? []).map(row => ({
    // Copy all fields for a folder from DB row
    ...row,
    // If folderID is already a bigint, return it. Otherwise, cast value to a bigint
    folderID: (typeof row.folderID === 'bigint') ? row.folderID : BigInt(row.folderID),
    parentFolderID: (typeof row.parentFolderID === 'bigint') ? row.parentFolderID : BigInt(row.parentFolderID),
    lastModified: (typeof row.lastModified === 'bigint') ? row.lastModified : BigInt(row.lastModified),
  })) as UIFolder[];
}

async function mapDBToUINote(itemID: number | bigint): Promise<UINote | null> {
  // Convert incoming id to bigint for DB API which expects bigint
  const bigintID: bigint = (typeof itemID === 'bigint') ? itemID : BigInt(itemID);

  // Read newly created note from local DB
  const row = await readNote(bigintID);
  if (!row) {
    console.error('Note not found in DB for itemID:', itemID);
    return null;
  }

  const date = selectedDate.value;

  // Need to add fields to the DB note row specific to the UI card
  // Sets temporary fields to saved values from DB
  const UINote = {
    // Copy all fields from DB shared type 
    ...row,
    itemID: (typeof row.itemID === 'bigint') ? row.itemID : BigInt(row.itemID),
    folderID: (typeof row.folderID === 'bigint') ? row.folderID : BigInt(row.folderID),
    temporaryFolderID: row.folderID == null ? null : ((typeof row.folderID === 'bigint') ? row.folderID : BigInt(row.folderID)),
    temporaryTitle: row.title ?? '',
    temporaryText: row.text ?? '',
    date,
    titleMessageError: '',
    folderMessageError: '',
    isSaved: true,
    expanded: true,
    isSelected: false
  } as UINote;

  // Compute index for a note for card display, use itemID as unique index
  // Look for existing note in notes array that matches the itemID of the newly created note
  const index = notes.value.findIndex(note => String(note.itemID) === String(UINote.itemID));
  if (index >= 0) {
    // If found, replace preexisting note in array with new UI object
    notes.value[index] = UINote;
  } else {
    // If not found, add new UI object note to the array
    notes.value.push(UINote);
  }

  return UINote;
}

onMounted(async () => {
  // Add root folder if no folders exist on page load
  await addRootFolder();
  // Ensure folders array is populated from local DB on page load
  folders.value = mapDBToUIFolder(await readAllFolders());
  // Load reminders for selected calendar date on startup
  await loadRemindersForCalendarDate(selectedDate.value);
  // Load notes for selected calendar date on startup
  await loadNotesForCalendarDate(selectedDate.value);
});


// Function to add and name a new folder
async function addFolder() {
  // Trim removes whitespace from beginning and end of string so if user enters nothing but spaces it is an empty string still
  // If folder name (with whitespace removed) is empty, show error message and disable add folder button 
    if (!newFolderName.value.trim()) {
    folderNameErrorMessage.value = 'Folder name cannot be empty.';
    return;
  }
  // Otherwise, folder name is good and add folder to tree
  // Sets parentFolderID of new folder to currently selected folder in file explorer tree. If no folder is selected, add new folder to root (parentFolderID = -1)
  const newFolderParentID: bigint = selectedFolderID.value ?? -1n;
  try {
    // Create new folder in local DB with folder name and parent folder ID
    await createFolder(newFolderParentID, -1, newFolderName.value);
    console.log('Folder created successfully.', folders);
    // Refresh the folders list after creating the new folder to show it
    folders.value = mapDBToUIFolder(await readAllFolders());
    console.log('Folders loaded successfully:', folders.value);
  }
catch (error) {
    console.error('Error adding folder:', error);
  }
  // After adding new folder, reset new folder name input, error message, and close popup
  newFolderName.value = '';
  folderNameErrorMessage.value = '';
  showAddFolderName.value = false;
}

// Function to save note text when save button is clicked
async function saveNote(note: UINote){
  // If note title (with whitespace removed) is empty, show error message and disable save button
    if (!note.temporaryTitle.trim()) {
    note.titleMessageError = 'Note title cannot be empty.';
    return;
  }
   // Title field can be no greater than 48 characters
  if (note.temporaryTitle.length > 48) {
    note.titleMessageError = 'Note title cannot exceed 48 characters.';
    return;
  }
   // Folder must exist 
   // Checks if folder id (temporary folder) matches any existing folder ids in folders array
  if (note.temporaryFolderID == null || !folders.value.some(folder => String(folder.folderID) === String(note.temporaryFolderID))) {
    note.folderMessageError = 'Note must be in a existing folder';
    return;
  }

 try {
  if (!note.isSaved) {
    const itemID = await createNote(note.temporaryFolderID, note.temporaryTitle, note.temporaryText);
    console.log('Note successfully created:', itemID);

    // Give this new note the actual itemID assigned by the DB and mark it saved so future saves go to update
    note.itemID = itemID;
    note.isSaved = true

    // Map DB row into UI and update notes.value array
    await mapDBToUINote(note.itemID);
    // Refresh folders to show newly added note in file explorer tree
    folders.value = mapDBToUIFolder(await readAllFolders());
    // Reload notes for selected calendar date to include newly added note
    await loadNotesForCalendarDate(selectedDate.value);
  }
  else {
      await updateNote(note.itemID, note.temporaryFolderID, note.temporaryTitle, note.temporaryText);
      console.log('Note successfully updated:', note.itemID);

      // Map DB row into UI and update notes.value array
      await mapDBToUINote(note.itemID);
      // Reload folders to see updated note in file tree
      folders.value = mapDBToUIFolder(await readAllFolders());
      // Reload notes for selected date to see updated note card
      await loadNotesForCalendarDate(selectedDate.value);
  }
 } catch (error) {
    console.error('Error saving note:', error);
  }
}

// Function to save reminder fields when save button is clicked
async function saveReminder(reminder: UIReminder){
  // If reminder title (with whitespace removed) is empty, show error message and disable save button
  if (!reminder.temporaryTitle.trim()) {
    reminder.titleMessageError = 'Reminder title cannot be empty.';
    return;
  }
  // Title field can be no greater than 48 characters
  if (reminder.temporaryTitle.length > 48) {
    reminder.titleMessageError = 'Reminder title cannot exceed 48 characters.';
    return;
  }
  // eventType must be integer value 
  if (typeof reminder.eventType !== 'number' || !Number.isInteger(reminder.eventType)) {
    reminder.titleMessageError = 'Invalid event type selected.';
    return;
  }

  // Folder must exist
  // Checks if folder id (temporary folder) matches any existing folder ids in folders array
  if (reminder.temporaryFolderID == null || !folders.value.some(folder => String(folder.folderID) === String(reminder.temporaryFolderID))) {
    reminder.folderMessageError = 'Reminder must be in a existing folder';
    return;
  }

  // Check that event start time is before event end time and vice versa for all event types
    const startTime = reminder.temporaryEventStartTime;
    const endTime = reminder.temporaryEventEndTime;
    // If start & end time are valid and start time is after end time, show error message and disable save button
    if (startTime && endTime && startTime >= endTime) {
      reminder.timeMessageError = 'Start time must be before end time.';
      return;
    }
  
  // Cast times into strings (since extension fields can be multiple types)
  const startTimeStr = String(reminder.temporaryEventStartTime ?? '');
  const endTimeStr = String(reminder.temporaryEventEndTime ?? '');

  const eventStartTime = convertTimeAndDateToTimestamp(reminder.date, startTimeStr);
  const eventEndTime = convertTimeAndDateToTimestamp(reminder.date, endTimeStr);
  // If no notification time selected (never), return null. Otherwise, convert time into timestamp
  const notifTime = reminder.temporaryNotificationTime == null ? null : convertNotificationTimestamp(reminder.date, startTimeStr, reminder.temporaryNotificationTime);
  // Toggle hasNotif based on whether notification time is selected or not. If notifTime is null, hasNotif is false since theres no notification
  const hasNotification = notifTime != null;
  // Send placeholder timestamp (event start time) to backend if never notification/null for safety since backend expects a timestamp
  // Backend should ignore notifTime if hasNotif is false (theres no notification)
  const notificationTimestampToSend = notifTime ?? eventStartTime;
  const notifToDisplay = timestampToTimeString(notificationTimestampToSend);

try {
  // Reminder is not yet saved (first time saving after clicking add), create reminder in DB
  if (!reminder.isSaved) {
  // Create base reminder in local DB and retrieve the itemID assigned to it
  const itemID = await createReminder(reminder.temporaryFolderID, reminder.eventType, eventStartTime, eventEndTime, notificationTimestampToSend, hasNotification, reminder.temporaryTitle);
  console.log('Reminder successfully created:', itemID);

  // Give this new reminder the actual itemID assigned by the DB and mark it saved so future saves go to update
  reminder.itemID = itemID;
  reminder.isSaved = true;

  // Map DB row into UI and update reminders.value array
  await mapDBToUIReminder(reminder.itemID);

  folders.value = mapDBToUIFolder(await readAllFolders());
  await loadRemindersForCalendarDate(selectedDate.value);

  if (hasNotification) {
    // Convert notification to epoch for scheduling
    const unixNotifTime = timeStamptoEpoch(notificationTimestampToSend);
    // Schedule notification
    await window.reminderNotificationAPI.scheduleReminderNotification({itemID: itemID, date: reminder.date, title: reminder.temporaryTitle, time: notifToDisplay, unixMilliseconds: unixNotifTime,
    });
  }
}
  // Reminder is saved, just updating a preexisting reminder
  else {
      await updateReminder(reminder.itemID, reminder.temporaryFolderID, reminder.eventType, eventStartTime, eventEndTime, notificationTimestampToSend, hasNotification, reminder.temporaryTitle);
      console.log('Reminder updated successfully in DB.');

      // Map DB row into UI and update reminders.value array
      await mapDBToUIReminder(reminder.itemID);
      // Refresh folders to show newly added reminder in file explorer tree
      folders.value = mapDBToUIFolder(await readAllFolders());
      // Reload reminders for selected calendar date to include newly added reminder
      await loadRemindersForCalendarDate(selectedDate.value);

      if (hasNotification) {
        // Convert notification to epoch for scheduling
        const unixNotifTime = timeStamptoEpoch(notificationTimestampToSend);
        // Schedule notification
        await window.reminderNotificationAPI.scheduleReminderNotification({itemID: reminder.itemID, date: reminder.date, title: reminder.temporaryTitle, time: notifToDisplay, unixMilliseconds: unixNotifTime,
        });
      }
  }
  } catch (error) {
    console.error('Error adding reminder:', error);
  }
}

// Function to delete selected individual checkbox reminders
async function deleteReminder(reminder: UIReminder) {
  try {
    // Delete specific reminder from local DB
    await deleteItem(reminder.itemID, 12);
    // Update reminders array to filter out deleted reminder
    // Array only contains reminders where the itemID does not match the deleted reminder's itemID
    reminders.value = reminders.value.filter(r => r.itemID !== reminder.itemID);
    console.log('Reminder deleted successfully from DB.');
    // Refresh folders for tree to remove deleted reminder
    folders.value = mapDBToUIFolder(await readAllFolders());
    // Re-load reminders for calendar date after deleted reminder
    await loadRemindersForCalendarDate(selectedDate.value);

  } catch (error) {
    console.error('Error deleting reminder from DB:', error);
  }
  // Remove reminders that have checkbox selected from reminders array
  // Creates new filtered array to render that only includes reminders that are not selected
  //reminders.value = reminders.value.filter(reminder => !reminder.isSelected);
}

// Function to delete selected individual checkbox notes
async function deleteNote(note: UINote) {
  try {
    // Delete specific note from local DB
    await deleteItem(note.itemID, 11);
    // Update notes array to filter out deleted note
    // Array only contains notes where the itemID does not match the deleted note's itemID
    notes.value = notes.value.filter(n => n.itemID !== note.itemID);
    console.log('Note deleted successfully from DB.');
    // Refresh folders for tree to remove deleted note
    folders.value = mapDBToUIFolder(await readAllFolders());
    // Re-load notes for calendar date after deleted note
    await loadNotesForCalendarDate(selectedDate.value);
  } catch (error) {
    console.error('Error deleting note from DB:', error);
  }
  // Remove notes that have checkbox selected from notes array
  // Creates new filtered array to render that only includes notes that are not selected
  // notes.value = notes.value.filter(note => !note.isSelected);
}

// Toggles behavior of add button. If on reminder tab, add a reminder to array. If on notes tab, add a note to array.
async function addArrayItem() {
  if (tab.value === 'reminders') {
    addReminder();
  } else if (tab.value === 'notes') {
    addNote();
  }
}

// Toggles behavior of delete button. If on reminder tab, delete selected reminders from array. If on notes tab, delete selected notes from array.
async function deleteArrayItem() {
  if (tab.value === 'reminders') {
    // Delete all selected reminders by calling deleteReminder for each selected item
    const selectedReminders = reminders.value.filter(reminder => reminder.isSelected);
    for (const reminder of selectedReminders) {
      await deleteReminder(reminder);
    }
  } else if (tab.value === 'notes') {
    // Delete all selected notes by calling deleteNote for each selected item
    const selectedNotes = notes.value.filter(note => note.isSelected);
    for (const note of selectedNotes) {
      await deleteNote(note);
    }
  }
}

// Watcher on the checkbox to select and deselect all reminders or notes when select all checkbox is toggled
watch(selectAll, (selectionVal) => {
  if (tab.value === 'reminders') {
    filteredReminders.value.forEach(reminder => {
      reminder.isSelected = selectionVal;
    });
  } else if (tab.value === 'notes') {
    notes.value.forEach(note => {
      note.isSelected = selectionVal;
    });
  }
});

// Watch event type of each reminder
reminders.value.forEach(reminder => {
  // Clear error message when switching event types to not confuse users with old fields
  watch(() => reminder.eventType, () => {
    reminder.timeMessageError = '';
  });
});


// template and script source code from slot - day month example
// https://qcalendar.netlify.app/developing/qcalendar-month
const calendar = ref<QCalendarMonth>(),
  selectedDate = ref(today()),
  selectedYear = ref(new Date().getFullYear()),
  locale = ref('en-US')

const formattedMonth = computed(() => {
  const date = new Date(selectedDate.value)
  const formatter = monthFormatter()
  return formatter ? formatter.format(date) : ''
})

// Filtered reminder array for specific date
const filteredReminders = computed(() => {
  return reminders.value.filter(reminder => reminder.date === selectedDate.value)
});

// Reload list of reminders whenever the selected calendar date changes
watch(selectedDate, async (newDate) => {
  // Load reminders for newly selected calendar date
  await loadRemindersForCalendarDate(newDate);
  // Load notes for newly selected calendar date
  await loadNotesForCalendarDate(newDate);
});

// Create events on calendar from reminders
const events = computed(() => buildCalendarEvents(reminders.value, eventTypes))
// Group events by date
const eventsMap = computed(() => groupEventsByDate(events.value))

// Filtered note array for specific date
const filteredNotes = computed(() => {
  return notes.value.filter(note => note.date === selectedDate.value)
});

// Watcher to unselect the select all checkbox if there are no reminders or notes in the array (ex. none made or after deletion)
watch([filteredReminders, notes, tab], () => {
  if (tab.value == 'reminders' && filteredReminders.value.length === 0) {
    selectAll.value = false;
  }
  if (tab.value === 'notes' && notes.value.length === 0) {
    selectAll.value = false;
  }
});

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: 'long',
      timeZone: 'UTC',
    })
  } catch {
    //
  }
}

function addToYear(amount: number) {
  // parse current date to timestamp
  let ts = parseTimestamp(selectedDate.value)
  if (ts) {
    // add specified amount of days
    ts = addToDate(ts, { year: amount })
    // re-assign values
    selectedDate.value = ts.date
    selectedYear.value = ts.year
  }
}

function onToday() {
  if (calendar.value) {
    calendar.value.moveToToday()
  }
}

function onPrev() {
  if (calendar.value) {
    calendar.value.prev()
  }
}
function onNext() {
  if (calendar.value) {
    calendar.value.next()
  }
}
function onMoved(data: Timestamp) {
  console.info('onMoved', data)
}
function onChange(data: { start: Timestamp; end: Timestamp; days: Timestamp[] }) {
  console.info('onChange', data)
}

function onClickDate(data: Timestamp) {
  console.info('onClickDate', data)
}
function onClickDay(data: Timestamp) {
  console.info('onClickDay', data)
}
function onClickWorkweek(data: Timestamp) {
  console.info('onClickWorkweek', data)
}
function onClickHeadDay(data: Timestamp) {
  console.info('onClickHeadDay', data)
}
function onClickHeadWorkweek(data: Timestamp) {
  console.info('onClickHeadWorkweek', data)
}

</script>