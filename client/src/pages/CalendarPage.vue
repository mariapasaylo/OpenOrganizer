<!--
 * Authors: Rachel Patella, Maria Pasaylo
 * Created: 2025-09-22
 * Updated: 2025-09-25
 *
 * This file is the main home page that includes the calendar view, notes/reminders list, 
 * and a file explorer as a 3 column grid layout.
 *
 * References:
 * https://quasar.dev/vue-components/card/
 * https://quasar.dev/vue-components/tabs/
 * https://vuejs.org/guide/essentials/list to render reminder cards in a list
 * https://qcalendar.netlify.app/developing/qcalendar-month-mini-mode#mini-mode-theme
 * 
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and 
 * license terms outlined in the LICENSE file located in the top-level directory of 
 * this distribution. No part of OpenOrganizer, including this file, may be reproduced, 
 * modified, distributed, or otherwise used except in accordance with the terms 
 * specified in the LICENSE file.
-->

<template>
    <qpage class="calendar-container"> 
      <q-dialog v-model="showSettings">
      <q-card style="width: 500px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Settings</div>
          <div class="settings-container">
           <div class="settings-sidebar">
            <q-tabs v-model="tab" vertical>
                <q-tab style="color: rgb(71, 71, 71)" name="cloud" label="Cloud" icon="cloud" />
                <q-tab style="color: rgb(71, 71, 71)" name="local" label="Local" icon="storage" />
            </q-tabs>
            </div>
             <div v-if="tab === 'cloud'">
            <q-toggle style="size:2px; font-size:18px" v-model="isCloudOn" label="Cloud Sync" />
            </div>
            </div>
        </q-card-section>
        </q-card>
    </q-dialog> 
<!--Left column - File Explorer-->
        <div class="grid-seperator">
            <button @click="$router.push('/')">Index Screen</button>
        </div>
<!--Middle column - List View of Notes/Reminders-->
        <div class="grid-seperator" style="background-color: #efefef">
            <q-tabs v-model="tab" class="calendar-tabs dense">
                <q-tab name="reminders" icon="alarm" label="Reminders"/>
                <q-tab name="notes" icon="note" label="Notes"/>
            </q-tabs>
            <q-btn style="font-size: 15px" flat icon="add" @click = addReminder></q-btn>
            <div class="reminder-note-card-container">
            <div v-if="tab === 'reminders'">

            <q-card class="reminder-note-cards" v-for= "(item, index) in filteredReminders" :key="index">
              <q-expansion-item expand-icon="keyboard_arrow_down">
                <template v-slot:header>
                  <div class="reminder-header-container">
                    <q-checkbox v-model="item.isSelected" class="q-mr-sm"/>
                    <div>{{ item.eventType }}</div>
                  </div>
                </template>
                <q-card-section>
                  <h3>Title: {{ item.eventType }}</h3>
                  <p>Description: {{ item.description}} <br>Index: {{ index }} <br>Date: {{ item.date }}</p>
                </q-card-section>
              </q-expansion-item>
            </q-card>
            </div>
            </div>
             <q-btn style="font-size: 15px" flat icon="delete" @click = deleteReminder></q-btn>
        </div>
<!--Right column - Calendar View-->
        <div class="grid-seperator">
            <div class="subcontent">
                <!--
                // template and script source code from mini-mode navigation example
                // https://qcalendar.netlify.app/developing/qcalendar-month-mini-mode#mini-mode-theme
                -->
            <!--<navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />-->
            <!-- Increased calendar height/width size />-->

                <div style="display: flex; justify-content: center">
                <div
                    style="
                    max-width: 280px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 10px;
                    "
                >
                    <div style="width: 100%; display: flex; justify-content: space-evenly">
                    <div style="width: 50%; display: flex; justify-content: space-between">
                        <span class="q-button" style="cursor: pointer; user-select: none" @click="onPrev"
                        >&lt;</span
                        >
                        {{ formattedMonth }}
                        <span class="q-button" style="cursor: pointer; user-select: none" @click="onNext"
                        >&gt;</span
                        >
                    </div>
                    <div style="width: 30%; display: flex; justify-content: space-between">
                        <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(-1)"
                        >&lt;</span
                        >
                        {{ selectedYear }}
                        <span class="q-button" style="cursor: pointer; user-select: none" @click="addToYear(1)"
                        >&gt;</span
                        >
                    </div>
                    </div>

                    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap">
                    <div style="display: flex; max-width: 280px; width: 100%">
                        <q-calendar-month
                        ref="calendar"
                        v-model="selectedDate"
                        mini-mode
                        no-active-date
                        hoverable
                        focusable
                        :focus-type="['date', 'weekday']"
                        :min-weeks="6"
                        animated
                        @change="onChange"
                        @moved="onMoved"
                        @click-date="onClickDate"
                        @click-day="onClickDay"
                        @click-workweek="onClickWorkweek"
                        @click-head-workweek="onClickHeadWorkweek"
                        @click-head-day="onClickHeadDay"
                        style="height: 300px;"
                        />
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="row"> 
            <q-btn style="margin-right: 6.65em" class = "account-and-settings-button" flat icon="account_circle" @click = "$router.push('/register')"></q-btn>
            <q-btn class = "account-and-settings-button" flat icon="settings" @click = "showSettings = true"></q-btn>
            </div>
        </div>

    </qpage>
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
import { ref, computed} from 'vue';

const tab = ref('');
// Array of reminders
const reminders = ref([{eventType: 'Flight', description: 'United airlines flight at 6 am', date: '2025-09-23', isSelected: false},
{eventType: 'Hotel', description: 'Hotel check-out at 9 am', date: '2025-09-23', isSelected: false}]);
const showSettings = ref(false);
const isCloudOn = ref(false);
const val = ref(false)

// Clicking add icon adds a reminder to the list for the selected date
function addReminder() {
    reminders.value.push({
        eventType: 'New Reminder',
        description: 'reminder description',
        date: selectedDate.value,
        isSelected: false
    });
}

// Function to clear/delete all reminders from the list as a test
function deleteReminder() {
    reminders.value = [];
}

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

const filteredReminders = computed(() => {
  return reminders.value.filter(reminder => reminder.date === selectedDate.value)
});

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