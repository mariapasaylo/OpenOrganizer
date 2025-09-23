<!-- Updated on 9/23/2025 by Rachel Patella - Added 3 panel grid column layout (instead of using QSplitter). 
 Added reminder list card example with TEST functionality that add button adds a card to the list and delete buttons deletes all reminders from the list
Will need to later change it to support an object of type Reminder/Note and next need to add functionality to link currently active tab with a note/reminder list type-->
<!-- Will remove index screen button later once indexPage is redacted -->
<!-- References: https://quasar.dev/vue-components/card/
https://quasar.dev/vue-components/tabs/ 
https://vuejs.org/guide/essentials/list to render reminder cards in a list -->
<template>
    <qpage class="calendar-container"> 
        <div class="grid-seperator">
            <button @click="$router.push('/')">Index Screen</button>
        </div>
        <div class="grid-seperator" style="background-color: #efefef">
            <q-tabs v-model="tab" class="calendar-tabs dense">
                <q-tab name="Reminders" icon="alarm" label="Reminders"/>
                <q-tab name="Notes" icon="note" label="Notes"/>
            </q-tabs>
            <q-btn flat icon="add" @click = addReminder></q-btn>
            <div class="reminder-note-card-container">
            <q-card class="reminder-note-cards" v-for= "(item, index) in reminders" :key="index">
                <q-card-section>
                     <h style="text-align: center; font-size: 30px;">Title: {{ item.eventType }}</h>
                      <p>Description: {{ item.description}} <br>Index: {{ index }}</p>
                </q-card-section>
                <q-card-actions>
                    <q-btn flat icon="keyboard_arrow_down"></q-btn>
                </q-card-actions>
            </q-card>
            </div>
             <q-btn flat icon="delete" @click = deleteReminder></q-btn>
        </div>
        <div class="grid-seperator"></div>

    </qpage>
</template>


<script setup lang="ts">
import { ref } from 'vue';
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


</script>