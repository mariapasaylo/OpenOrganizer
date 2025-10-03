<!--
 * Authors: Rachel Patella, Maria Pasaylo
 * Created: 2025-09-22
 * Updated: 2025-10-02
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
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Hotels" />
          <q-breadcrumbs-el label="Check-in" />
          <q-breadcrumbs-el label="Check-out" />
        </q-breadcrumbs>
        <q-tree 
          :nodes="qNestedTree"
          node-key="id"
          no-connectors
          default-expand-all
        />
        <div style="display: flex; align-items: center; margin-top: auto; gap: 4px;">
          <q-btn style="font-size: 1rem; color: #474747;" flat  icon="add"  label="Add Folder" />
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
          <q-checkbox v-model="selectAll" label="Select All" />
        </div>
        <q-btn style="font-size: 15px" flat icon="delete" @click="deleteArrayItem"></q-btn>
      </div>
      <div class="reminder-note-card-container">
        <div v-if="tab === 'reminders'">
          <q-card class="reminder-note-cards" v-for="(item, index) in filteredReminders" :key="index">
            <q-expansion-item v-model="item.expanded" expand-icon="keyboard_arrow_down">
              <template v-slot:header>
                <div class="reminder-header-container">
                  <q-checkbox v-model="item.isSelected" class="q-mr-sm" />
                  <div>{{ item.eventType }}</div>
                </div>
              </template>
              <q-card-section>
                <h3>Title: {{ item.eventType }}</h3>
                <p>Description: {{ item.description }} <br>Index: {{ index }} <br>Date: {{ item.date }}</p>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
        <div v-if="tab === 'notes'">
          <q-card class="reminder-note-cards" v-for="(item, index) in filteredNotes" :key="index">
            <q-expansion-item v-model="item.expanded" expand-icon="keyboard_arrow_down">
              <template v-slot:header>
                <div class="reminder-header-container">
                  <q-checkbox v-model="item.isSelected" class="q-mr-sm" />
                  <div>{{ item.title }}</div>
                </div>
              </template>
              <p>Created on: {{ item.date }}</p>
              <q-card-section>
                <q-btn-dropdown style="margin-bottom: 10px;" color="grey" label="Save in folder">
                  <q-list>
                    <q-item clickable v-close-popup>
                      <q-item-section>
                        <q-item-label>Folder 1</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-input class="note-box" outlined v-model="noteText" type="textarea"
                  placeholder="Write your note here..." />
                <div class="row">
                  <q-btn class="login-register-button" style="font-size: 15px; margin-right: 10px" flat label="Save"
                    @click="saveNote"></q-btn>
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
                @click-head-workweek="onClickHeadWorkweek" @click-head-day="onClickHeadDay" style="height: 400px;" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column - Spacer (middle row, can be empty) -->
    <div style="grid-area: calendar-spacer;" data-area="calendar-spacer"></div>

    <!-- Right column - Settings/Account Buttons (bottom row) -->
    <div style="grid-area: account-settings;" data-area="account-settings">
      <div class="row justify-between items-center">
        <q-btn class="account-and-settings-button" flat icon="account_circle" @click="$router.push('/register')" />
        <q-btn class="account-and-settings-button" flat icon="settings" @click="showSettings = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  QCalendarMonth,
  addToDate,
  parseTimestamp,
  today,
  type Timestamp,
} from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/index.css';

//import NavigationBar from 'components/NavigationBar.vue';
import { ref, computed, watch } from 'vue';
// To display the folder tree list on the frontend
import RecursiveFolderTree from 'src/components/RecursiveFolderTree.vue';


// Initialize active tab to reminder by default
const tab = ref('reminders');
// Array of reminders. Default reminder adds to the current day's date
const reminders = ref([{ eventType: 'New Reminder', description: 'reminder description', date: today(), isSelected: false, expanded: true }]);
// Array of notes
const notes = ref([{ title: 'New Note', description: 'note description', date: today(), isSelected: false, expanded: true }]);
const showSettings = ref(false);
const isCloudOn = ref(false);
const selectAll = ref(false)
const noteText = ref('');
const searchQuery = ref('');

// Each folder/node has a folder id, folder name, parent folder id, and list of child nodes (if there are any so its optional)
// This type represents the way that we store the folder data
type Folder = {
  id: number;
  name: string;
  parent_id: number;
  children?: Folder[];
};

// This type represents the way QTree stores its folder data
type QTreeFolder = {
  label: string;
  id: number;
  icon: string;
  // Could use this later to change folder icon colors
  iconColor: string;
  children?: QTreeFolder[];
};

// For use in frontend recursive folder display component
export type { Folder };

// Example flat array of folders
const folders: Folder[] = [{ id: 1, name: 'Hotels', parent_id: 0 }, { id: 2, name: 'Check-in', parent_id: 1 }, { id: 3, name: 'Check-out', parent_id: 2 }, { id: 4, name: 'Flights', parent_id: 0 }, { id: 5, name: 'Arrival', parent_id: 4 }, { id: 6, name: 'Departure', parent_id: 5 }];

// example JS nest function for how to convert flat array into n-ary nested tree from https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
const nest = (items: Folder[], id: number):
  Folder[] =>
  // Filter finds all folders where the parent id is equal to the current folder id 
  items.filter(item => item.parent_id === id)
    // For each folder, create/map new item object that includes the original folder properties ...item (id, name, parent_id)
    .map(item => ({
      ...item,
      // Add a children property to the item object and recursively call nest function to find children of the current folder
      children: nest(items, item.id)
    }));

// Function to convert nested folder tree to Q-Tree format
// Q-tree expects each node to have a label and children array (added id for unique identification)
function convertFolderTreetoQTree(folders: Folder[]): 
QTreeFolder[] {
  // For each folder in the array, create a QTree node with label, id, and children properties
  return folders.map(folder => ({
    label: folder.name,
    id: folder.id,
    icon: 'folder',
    iconColor: 'blue',
    // Provide empty array ?? [] if there is no children of the folder (undefined since its optional)
    // Recursively call convertFolderTreetoQTree function to find children of the current folder
    children: convertFolderTreetoQTree(folder.children ?? [])
  }));
}

// Convert folders array to nested n-ary tree (first call will start at root/parent_id 0)
const nestedFolderTree = computed(() => nest(folders, 0));
console.log('nestedFolderTree:', JSON.stringify(nestedFolderTree.value, null, 2));

// Convert nested folder tree to Q-Tree format
// Computed since it relies on nestedFolderTree, so it automatically updates whenever the nested folder tree updates
const qNestedTree = computed(() => convertFolderTreetoQTree(nestedFolderTree.value));
console.log('qNestedTree:', JSON.stringify(qNestedTree.value, null, 2));



// Function to add a reminder to the list on the specified calendar date
function addReminder() {
  reminders.value.push({
    eventType: 'New Reminder',
    description: 'reminder description',
    date: selectedDate.value,
    isSelected: false,
    expanded: true // Have reminder carat expanded open by default when addding new reminder to fill out fields
  });
  //Close other reminders when a new one is added
  reminders.value.forEach((reminder, index) => {
    if (index < reminders.value.length - 1) {
      reminder.expanded = false
    }
  })
}

// Function to add a note to the list
function addNote() {
  notes.value.push({
    title: 'New Note',
    description: 'note description',
    date: selectedDate.value,
    isSelected: false,
    expanded: true // Have note carat expanded open by default when addding new note to fill out fields
  });
  //Close other notes when a new one is added
  notes.value.forEach((note, index) => {
    if (index < notes.value.length - 1) {
      note.expanded = false
    }
  })
}

// Function to save a note
function saveNote() {
  console.log("username: ", noteText)
}

// Function to delete selected individual checkbox reminders
function deleteReminder() {
  // Remove reminders that have checkbox selected from reminders array
  // Creates new filtered array to render that only includes reminders that are not selected
  reminders.value = reminders.value.filter(reminder => !reminder.isSelected);
}

// Function to delete selected individual checkbox notes
function deleteNote() {
  // Remove notes that have checkbox selected from notes array
  // Creates new filtered array to render that only includes notes that are not selected
  notes.value = notes.value.filter(note => !note.isSelected);
}

// Toggles behavior of add button. If on reminder tab, add a reminder to array. If on notes tab, add a note to array.
function addArrayItem() {
  if (tab.value === 'reminders') {
    addReminder();
  } else if (tab.value === 'notes') {
    addNote();
  }
}

// Toggles behavior of delete button. If on reminder tab, delete a reminder from array. If on notes tab, delete a note from array.
function deleteArrayItem() {
  if (tab.value === 'reminders') {
    deleteReminder();
  } else if (tab.value === 'notes') {
    deleteNote();
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

// template and script source code from mini-mode navigation example
// https://qcalendar.netlify.app/developing/qcalendar-month-mini-mode#mini-mode-theme
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