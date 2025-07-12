<template>
  <div>
    <h1>Welcome back!</h1>
    
    <form @submit.prevent="handleLogin">
      <div>
        <label>Server address</label>
        <input v-model="serverAddress" type="text" required>
      </div>
      
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required>
      </div>
      
      <div>
        <label>Password</label>
        <input v-model="password" type="password" required>
      </div>
      
      <button type="submit">Log in</button>
    </form>
    
    <p>Do you need an account?</p>
    <button @click="goToSignUp">Sign up</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const serverAddress = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()

function handleLogin() {
  console.log('Login submitted');
}

function goToSignUp() {
  router.push('/register');
}
</script>

