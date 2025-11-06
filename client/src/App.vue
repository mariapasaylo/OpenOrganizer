<!--
 * Authors: Michael Jagiello
 * Created: 2025-04-13
 * Updated: 2025-11-04
 *
 * This file handles the overarching router view and launches the initialization function.
 *
 * This file is a part of OpenOrganizer.
 * This file and all source code within it are governed by the copyright and license terms outlined in the LICENSE file located in the top-level directory of this distribution.
 * No part of OpenOrganizer, including this file, may be reproduced, modified, distributed, or otherwise used except in accordance with the terms specified in the LICENSE file.
-->

<template>
  <router-view />
</template>

<script setup lang="ts">
import { init } from 'src/services/init';
// eslint-disable-next-line
init();
</script>
