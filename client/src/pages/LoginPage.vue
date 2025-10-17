<!--
 * Authors: Rachel Patella, Maria Pasaylo
 * Created: 2025-09-22
 * Updated: 2025-10-17
 *
 * This file is the login form for users to log in to a preexisting account that includes a sidebar with the application name and logo
 *
 * References:
 * https://quasar.dev/vue-components/input#Example--Input-types for password visibility toggle
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
    <qpage class="login-registration-container"> 
        <div class="login-register-sidebar">
            <h style="text-align: center; font-size: 50px; margin-top: -5px;">Welcome to<br>OpenOrganizer!</h>
            <q-icon style="font-size: 150px; margin-top: 50px;" name="event" />
        </div>
        <div class="login-registration-form">
            <h style="text-align: center; font-size: 50px; margin-top: 30px; color: black; font-weight: bold; max-width: 400px;">Login</h>
            <p style="font-size: 17px">Don't have an account yet? Sign up
                <router-link to="/register">here</router-link>
            </p>
            <q-input class="username-password-box" v-model="username" square filled placeholder="Username"></q-input>
            <q-input class="username-password-box" v-model="password" filled :type="isPwd ? 'password' : 'text'" placeholder="Password">
                <template v-slot:append>
                <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"/>
                </template>
            </q-input>
            <q-btn 
              class="login-register-button" 
              style="font-size: 15px" 
              @click="login" 
              :loading="isLoading"
              :disable="isLoading"
              no-caps 
              label="Login"
            />
            <q-btn class="login-register-button" style="font-size: 15px" @click= "$router.push('/')" no-caps label="Index Screen" />
        </div>
    </qpage>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, Notify } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const username = ref('');
const password = ref('');
const isPwd = ref(true);
const isLoading = ref(false);

async function login() {
  if (!username.value || !password.value) {
    $q.notify({
      type: 'negative',
      message: 'Please enter both username and password'
    });
    return;
  }

  isLoading.value = true;
  
  try {
    const result = await window.electronAuthAPI.verifyUserCredentials(username.value, password.value);
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Login successful!'
      });
      // Navigate to main calendar page
      await router.push('/calendar');
    } else {
      $q.notify({
        type: 'negative',
        message: result.message
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    $q.notify({
      type: 'negative',
      message: 'An error occurred during login'
    });
  } finally {
    isLoading.value = false;
  }
}
</script>