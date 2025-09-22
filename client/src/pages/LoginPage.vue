<!-- Updated on 9/22/2025 by Rachel Patella - Created page layout & styling -->
<!-- Currently for testing just console logging username and password on click. Replace later with login logic/API -->
<!-- Will remove index screen button later once indexPage is redacted -->
<!-- Password visibility code from: https://quasar.dev/vue-components/input#Example--Input-types -->
<template>
    <qpage class="row"> 
        <div class="login-register-sidebar">
            <h style="text-align: center; font-size: 50px; margin-top: -5px;">Welcome to<br>OpenOrganizer!</h>
            <q-icon style="font-size: 150px; margin-top: 50px;" name="event" />
        </div>
        <div class="login-registration-container">
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
            <q-btn class="login-register-button" style="font-size: 15px" @click= login no-caps label="Login"/>
            <q-btn class="login-register-button" style="font-size: 15px" @click= "$router.push('/')" no-caps label="Index Screen" />
        </div>
    </qpage>
</template>


<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const isPwd = ref(true)

function login() {
    console.log("username: ", username)
    console.log("password: ", password)
}
</script>