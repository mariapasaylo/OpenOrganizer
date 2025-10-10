<!--
 * Authors: Rachel Patella, Maria Pasaylo
 * Created: 2025-09-22
 * Updated: 2025-10-10
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
          v-model:selected="selectedFolderId"
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
          <q-checkbox v-model="selectAll" label="Select All" />
        </div>
        <q-btn style="font-size: 15px" flat icon="delete" @click="deleteArrayItem"></q-btn>
      </div>
      <div class="reminder-note-card-container">
        <div v-if="tab === 'reminders'">
          <!-- Reminder Cards -->
          <q-card class="reminder-note-cards" v-for="(item, index) in filteredReminders" :key="index">
            <q-expansion-item v-model="item.expanded" expand-icon="keyboard_arrow_down">
              <template v-slot:header>
                  <div class="reminder-header-container">
                    <q-checkbox v-model="item.isSelected" class="q-mr-sm" />
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
                <p>Description: {{ item.description }} <br>Date: {{ item.date }}</p>
                 <q-select
                v-model="item.temporaryFolderId"
                :options="folderDropdownOptions"
                label="Save in folder"
                emit-value 
                map-options
                dense
                outlined
                style="background-color: #cacaca; margin-bottom: 10px"
              />
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
                <p>Created on: {{ item.date }}</p>
                <q-select
                v-model="item.temporaryFolderId"
                :options="folderDropdownOptions"
                label="Save in folder"
                emit-value 
                map-options
                dense
                outlined
                style="background-color: #cacaca; margin-bottom: 10px"
              />
                <q-input class="note-box" outlined v-model="noteText" type="textarea"
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
// To display the folder tree list on the frontend - not used right now
import RecursiveFolderTree from 'src/components/RecursiveFolderTree.vue';

// Initialize active tab to reminder by default
const tab = ref('reminders');
// Array of reminders. Default reminder adds to the current day's date
const reminders = ref([{id: 'reminder-1', title: 'New Reminder', temporaryTitle: '', description: 'event type field description', date: today(), isSelected: false, expanded: true, folderId: null, temporaryFolderId: null, isSaved: false, titleMessageError: ''}]);
// Array of notes
const notes = ref([{ id: 'note-1', title: 'New Note', temporaryTitle: '', description: 'note description', date: today(), isSelected: false, expanded: true, folderId: null, temporaryFolderId: null, isSaved: false, titleMessageError: ''}]);
const showSettings = ref(false);
const showAddFolderName = ref(false);
const newFolderName = ref('');
const folderNameErrorMessage = ref('');
const isCloudOn = ref(false);
const selectAll = ref(false)
const noteText = ref('');
const searchQuery = ref('');
// Specific folder currently selected in the file explorer tree, tracked for adding folder in that specific spot
// null is if there is no folder selected on the tree, this by default
const selectedFolderId = ref<number | null>(null);

// This type represents the way that we store the note data
type Note = {
  id: string; // unique item ID ex. "note-1" incremented for each new note
  title: string; 
  description: string; // text stored within the note
  date: string; // date it was created
  isSelected: boolean; // checkbox selection
  expanded: boolean; // open or closed
  folderId: number | null; // null if not saved in any folder yet. The parent folder id the note is saved in 
  temporaryFolderId: number | null; // The folder selected in the dropdown before the note is saved
   // This is needed to retain the folder state before the note is saved again 
  // Ex. if user has a saved note and selects a folder but then cancels, it reverts back to the previous folderId
  temporaryTitle: string; // This is needed to retain the title state before the note is saved again - just like folder
  isSaved: boolean; // if note is saved or not
  titleMessageError?: string; // error message for title validation. Each note has this property so error message only shows up for the specific notes that have an error
};

// This type represents the way that we store the reminder data
type Reminder = {
  id: string; // unique item ID ex. "reminder-1" incremented for each new reminder
  title: string; 
  description: string; // text stored within the reminder. Later this will be split into event type fields.
  date: string; 
  isSelected: boolean; 
  expanded: boolean;
  folderId: number | null; 
  temporaryFolderId: number | null; 
  temporaryTitle: string; 
  isSaved: boolean; 
  titleMessageError?: string; 
};

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
  id: number  | string;
  icon?: string;
  // Could use this later to change folder icon colors
  iconColor?: string;
  children?: QTreeFolder[];
};

// For use in frontend recursive folder display component, not currently being used
export type { Folder };

// Example flat array of folders
 const folders = ref<Folder[]>([{ id: 1, name: 'Hotels', parent_id: 0 }, 
 { id: 2, name: 'Check-in', parent_id: 1 }, 
 { id: 3, name: 'Check-out', parent_id: 2 }, 
 { id: 4, name: 'Flights', parent_id: 0 }, 
 { id: 5, name: 'Arrival', parent_id: 4 },
 { id: 6, name: 'Departure', parent_id: 5 }
]);

// Map folders to format for q-select dropdown menu
// Each option has a label (name of the option/folder in the dropdown) and a value (actual folder to save note into)
// Computed so it automatically updates whenever folders array updates (if new folder is added it shows up in the options)
const folderDropdownOptions = computed(() => {
  return folders.value.map(folder => ({
    label: folder.name,
    value: folder.id
  }));
});

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
function convertFolderTreetoQTree(folders: Folder[]): QTreeFolder[] {
  return folders.map(folder => {
    // Find notes saved in the current folder
    const notesInCurrFolder = notes.value.filter(note => note.folderId === folder.id && note.isSaved);

    // For each note, create a QTree node with label and id properties and return it
    const noteTreeNodes = notesInCurrFolder.map((note) => {
      // Log which note is being placed under which folder
      // for debugging: console.log(`Placing note "${note.title}" (id: ${note.id}) under folder "${folder.name}" (id: ${folder.id})`);
      return {
        label: note.title,
        id: `note-${note.id}`, 
        // No icon, color, or children properties for notes
      };
    });

    // Find reminders saved in the current folder
    const remindersInCurrFolder = reminders.value.filter(reminder => reminder.folderId === folder.id && reminder.isSaved);

    // For each reminder, create a QTree node with label and id properties and return it
    const reminderTreeNodes = remindersInCurrFolder.map((reminder) => {
      return {
        label: reminder.title,
        id: `reminder-${reminder.id}`, 
        // No icon, color, or children properties for reminders
      };
    });

    // For each folder, create a QTree node with label, id, and children properties and return it
    return {
      label: folder.name,
      id: folder.id,
      icon: 'folder',
      iconColor: 'blue',
      children: [
        ...noteTreeNodes,
        ...reminderTreeNodes,
        ...convertFolderTreetoQTree(folder.children ?? [])
      ]
    };
  });
}

// Convert folders array to nested n-ary tree (first call will start at root/parent_id 0)
const nestedFolderTree = computed(() => nest(folders.value, 0));
console.log('nestedFolderTree:', JSON.stringify(nestedFolderTree.value, null, 2));

// Convert nested folder tree to Q-Tree format
// Computed since it relies on nestedFolderTree, so it automatically updates whenever the nested folder tree updates
const qNestedTree = computed(() => convertFolderTreetoQTree(nestedFolderTree.value));
console.log('qNestedTree:', JSON.stringify(qNestedTree.value, null, 2));

let newReminderId = reminders.value.length + 1;
// Function to add a reminder to the list on the specified calendar date
function addReminder() {
  reminders.value.push({
    id: `reminder-${newReminderId++}`,
    title: 'New Reminder', // saved title
    temporaryTitle: '', // editable title
    description: 'event type field',
    date: selectedDate.value,
    isSelected: false,
    expanded: true, 
    folderId: null, 
    temporaryFolderId: null,
    isSaved: false,
    titleMessageError: '' // error message for title validation
  });
  //Close other reminders when a new one is added
  reminders.value.forEach((reminder, index) => {
    if (index < reminders.value.length - 1) {
      reminder.expanded = false
    }
  })
}

let newNoteId = notes.value.length + 1;
// Function to add a note to the list
function addNote() {
  // Increment noteID for each new note added so each one has a unique ID
    notes.value.push({
      id: `note-${newNoteId++}`,
      title: 'New Note',
      temporaryTitle: '', // editable title
      description: 'note description',
      date: selectedDate.value,
      isSelected: false,
      expanded: true, // Have note carat expanded open by default when addding new note to fill out fields
      folderId: null, // The folder ID of the folder the note is going to be saved into. Null by default (no folder selected yet),
      temporaryFolderId: null,
      isSaved: false, // Not saved by default until user clicks save button 
      titleMessageError: '' // error message for title validation
  });
  //Close other notes when a new one is added
  notes.value.forEach((note, index) => {
    if (index < notes.value.length - 1) {
      note.expanded = false
    }
  })
}

// Function to add and name a new folder
// For now, assuming folders aren't deleted so new folder id is just length of folders array + 1
function addFolder() {
  // Trim removes whitespace from beginning and end of string so if user enters nothing but spaces it is an empty string still
  // If folder name (with whitespace removed) is empty, show error message and disable add folder button 
    if (!newFolderName.value.trim()) {
    folderNameErrorMessage.value = 'Folder name cannot be empty.';
    return;
  }
  // Otherwise, folder name is good and add folder to tree
  // Sets parentID of new folder to currently selected folder in file explorer tree. If no folder is selected, add new folder to root (parent_id = 0)
  const newFolderParentId = selectedFolderId.value ?? 0;
  const newFolderId = folders.value.length + 1;
  folders.value.push({ 
    // Folder IDs are not incremented like notes because folders can't be deleted yet so no risk of duplicate ids
    id: newFolderId, 
    name: newFolderName.value, 
    parent_id: newFolderParentId
  });
  // After adding new folder, reset new folder name input, error message, and close popup
  newFolderName.value = '';
  folderNameErrorMessage.value = '';
  showAddFolderName.value = false;
}

// Function to save note text when save button is clicked
function saveNote(note: Note){
  // If note title (with whitespace removed) is empty, show error message and disable save button
    if (!note.temporaryTitle.trim()) {
    note.titleMessageError = 'Note title cannot be empty.';
    return;
  }
  note.title = note.temporaryTitle; // Update saved note title to whatever is in editable title field on save
  note.folderId = note.temporaryFolderId; // Update the actual folder ID to one selected on dropdown on save (this is the saved folderID state)
  // Set note to be saved after clicking save button so it can show on tree
  note.isSaved = true;
  // After saving note, reset error message
    note.titleMessageError = '';
}

// Function to save reminder fields when save button is clicked
function saveReminder(reminder: Reminder){
  // If reminder title (with whitespace removed) is empty, show error message and disable save button
  if (!reminder.temporaryTitle.trim()) {
    reminder.titleMessageError = 'Reminder title cannot be empty.';
    return;
  }
  reminder.title = reminder.temporaryTitle;
  reminder.folderId = reminder.temporaryFolderId;
  // Set reminder to be saved after clicking save button so it can show on tree
  reminder.isSaved = true;
  // After saving reminder, reset error message
  reminder.titleMessageError = '';
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