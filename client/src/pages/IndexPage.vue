<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <section class="test">
      <div class="test-pieces">
        <button size="lg" @click="handleCommand">Local</button>
        <input id="in0" type="text" />
      </div>
      <section id="out0"></section>
      <div class="test-pieces">
        <button size="lg" @click="handleCommandServer">Server</button>
        <input id="in1" type="text" />
      </div>
      <section id="out1"></section>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import * as db from "../utils/db"
import ExampleComponent from 'components/ExampleComponent.vue';
import type { Todo, Meta } from 'components/models';
import { ref } from 'vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1'
  },
  {
    id: 2,
    content: 'ct2'
  },
  {
    id: 3,
    content: 'ct3'
  },
  {
    id: 4,
    content: 'ct4'
  },
  {
    id: 5,
    content: 'ct5'
  }
]);

const meta = ref<Meta>({
  totalCount: 1200
});

// the way i retrieved text works, but might not be the optimal vue way to do it

async function handleCommand() {
  console.log("Insert pressed");
  const input: string = (document.getElementById("in0")! as HTMLInputElement).value;
  const output = document.getElementById("out0")!;
  output.textContent = await db.dbCommand(input);
}

async function handleCommandServer() {
  console.log("Insert pressed");
  const input: string = (document.getElementById("in1")! as HTMLInputElement).value;
  const output = document.getElementById("out1")!;
  output.textContent = await db.dbCommandServer(input);
}

</script>
