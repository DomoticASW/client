<template>
  <div>
    <h1>Welcome!</h1>
    
    <form @submit.prevent="handleSignUp">
      <div>
        <label>Server address</label>
        <input v-model="serverAddress" type="text" required>
      </div>
      
      <div>
        <label>Nickname</label>
        <input v-model="nickname" type="text" required>
      </div>
      
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required>
      </div>
      
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required>
      </div>
      
      <p>You will need to wait for the administrator to accept your request before log in!</p>
      
      <button type="submit">Sign up</button>
    </form>
      
    <p>Do you have already an account?</p>
    <button @click="goToLogin">Log in</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const serverAddress = ref('');
const nickname = ref('');
const email = ref('');
const password = ref('');

const router = useRouter();

function handleSignUp() {
  console.log('Sign up submitted');
}

function goToLogin() {
  router.push('/login');
}
</script>
