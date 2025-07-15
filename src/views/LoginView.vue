<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-center">
          <h1 class="card-title text-3xl font-bold mb-4">Welcome back!</h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Server address</span>
            </label>
            <input 
              v-model="form.serverAddress" 
              type="text" 
              placeholder="http://localhost:3000" 
              class="input input-bordered w-full"
              :class="{ 'input-error': v$.serverAddress.$error }"
              @blur="v$.serverAddress.$touch()"
            />
            <label class="label" v-if="v$.serverAddress.$error">
              <span class="label-text-alt text-error">
                {{ v$.serverAddress.$errors[0].$message }}
              </span>
            </label>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="your@email.com" 
              class="input input-bordered w-full"
              :class="{ 'input-error': v$.email.$error }"
              @blur="v$.email.$touch()"
            />
            <label class="label" v-if="v$.email.$error">
              <span class="label-text-alt text-error">
                {{ v$.email.$errors[0].$message }}
              </span>
            </label>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <div class="relative">
              <input 
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="input input-bordered w-full"
              :class="{ 'input-error': v$.password.$error }"
              @input="v$.password.$touch()"
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700"
                @click="showPassword = !showPassword"
              >
                <i 
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" 
                  class="fas"
                ></i>              
              </button>
            </div>
            <label class="label" v-if="v$.password.$error">
              <span class="label-text-alt text-error">
                {{ v$.password.$errors[0].$message }}
              </span>
            </label>
          </div>
          
          <div class="flex justify-center">
            <div class="form-control mt-6">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="v$.$invalid"
                :class="{ 'btn-disabled': v$.$invalid }"
              >
                Log in
              </button>
            </div>
          </div>
        </form>
        
        <div class="divider">OR</div>
        
        <div class="text-center">
          <p class="text-sm">Don't have an account?</p>
          <router-link to="/register" class="link link-primary text-sm">
            Sign up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';

type LoginForm = {
  serverAddress: string;
  email: string;
  password: string;
};

export default defineComponent({
  name: 'LoginView',
  setup() {
    const form = reactive<LoginForm>({
      serverAddress: '',
      email: '',
      password: ''
    });

    const showPassword = ref(false);

    const rules = {
      serverAddress: { required: helpers.withMessage('Server address is required', required) },
      email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
      password: { required: helpers.withMessage('Password is required', required), minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6)) }
    };

    const v$ = useVuelidate(rules, form);

    return { form, v$, showPassword };
  },
  methods: {
    handleLogin(): void {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        console.log('Login submitted:', this.form);
      }
    }
  }
});
</script>
