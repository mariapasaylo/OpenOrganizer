<!-- Updated on 9/22/2025 by Rachel Patella - Created page -->
<!-- Will remove index screen button later once indexPage is redacted -->

<template>
    <div>
    <p>Calendar page</p>
    <button @click="$router.push('/')">Index Screen</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const splitterModel = ref()    // initial left panel width
</script>