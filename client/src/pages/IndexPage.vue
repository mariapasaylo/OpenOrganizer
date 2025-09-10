<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
    <section class="column items-center q-gutter-xl">
      <div class="test-pieces">
        <button @click="() => handleCommand('not setup', 'in0', 'out0')">Local</button>
        <input id="in0" type="text" />
      </div>
      <section id="out0"></section>
      <div class="test-pieces" >
        <button @click="() => handleCommand('add', 'in1', 'out1')">Server</button>
        <input id="in1" type="text" />
      </div>
      ex: "a=1&b=2"
      <section id="out1"></section>
      <div class="test-pieces">
        <button @click="() => handleCommand('load', 'in2', 'out2')">DB Load</button>
        <input id="in2" type="text" />
      </div>
      ex: "k=foo"
      <section id="out2"></section>
      <div class="test-pieces">
        <button @click="() => handleCommand('store', 'in3', 'out3')">DB Store</button>
        <input id="in3" type="text" />
      </div>
      ex: "k=foo&v=bar"
      <section id="out3"></section>
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

async function handleCommand(mode: string, inId: string, outId: string) {
  console.log("Insert pressed");
  const input: string = (document.getElementById(inId)! as HTMLInputElement).value;
  const output = document.getElementById(outId)!;
  output.textContent = await db.dbCommand(mode, input);
}

</script>
