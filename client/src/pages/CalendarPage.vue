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
<!--Left column - File Explorer-->
        <div class="grid-seperator">
            <button @click="$router.push('/')">Index Screen</button>
        </div>
<!--Middle column - List View of Notes/Reminders-->
        <div class="grid-seperator" style="background-color: #efefef">
            <q-tabs v-model="tab" class="calendar-tabs dense">
                <q-tab name="Reminders" icon="alarm" label="Reminders"/>
                <q-tab name="Notes" icon="note" label="Notes"/>
            </q-tabs>
            <q-btn flat icon="add" @click = addReminder></q-btn>
            <div class="reminder-note-card-container">
            <q-card class="reminder-note-cards" v-for= "(item, index) in reminders" :key="index">
                <q-card-section>
                     <h3 style="text-align: center; font-size: 30px;">Title: {{ item.eventType }}</h3>
                      <p>Description: {{ item.description}} <br>Index: {{ index }}</p>
                </q-card-section>
                <q-card-actions>
                    <q-btn flat icon="keyboard_arrow_down"></q-btn>
                </q-card-actions>
            </q-card>
            </div>
             <q-btn flat icon="delete" @click = deleteReminder></q-btn>
        </div>
<!--Right column - Calendar View-->
        <div class="grid-seperator">
            <div class="subcontent">
                <!--
                // template and script source code from mini-mode navigation example
                // https://qcalendar.netlify.app/developing/qcalendar-month-mini-mode#mini-mode-theme
                -->
            <!--<navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />-->

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
                        />
                    </div>
                    </div>
                </div>
                </div>
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
const reminders = ref([{eventType: 'Flight', description: 'United airlines flight at 6 am'},{eventType: 'Hotel', description: 'Hotel check-out at 9 am'}])
// Clicking add icon adds a reminder to the list, currently just a test with preset values
function addReminder() {
    reminders.value.push({eventType: 'New Reminder', description: 'reminder description' });
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