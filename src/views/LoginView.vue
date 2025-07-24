<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-center min-h-[4rem] mb-4">
          <h1 class="card-title text-3xl font-bold">Welcome back!</h1>
        </div>

      <form @submit.prevent="handleLogin" class="w-full">

        <div class="form-control">
          <span class="label-text">Email</span><br>
          <label class="input validator w-full">
            <i class="fa-regular fa-envelope opacity-50"></i>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="your@email.com" 
              name="email"
              :class="{ 'input-error': v$.email.$error }"
              @blur="v$.email.$touch()"
            />
          </label>
            <div class="min-h-[1.5rem]">
            <label class="label py-0" v-if="v$.email.$error">
              <span class="label-text-alt text-error">
                {{ v$.email.$errors[0].$message }}
              </span>
            </label>
          </div>
        </div>
          
        <div class="form-control">
          <span class="label-text">Password</span>
          <div class="relative">
            <label class="input validator w-full">
              <i class="fa-solid fa-key opacity-50"></i>
              <input 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••"
                name="password"
                :class="{ 'input-error': v$.password.$error }"
                @blur="v$.password.$touch()"
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
            </label>
          </div>
          <div class="min-h-[1.5rem]">
            <label class="label py-0" v-if="v$.password.$error">
              <span class="label-text-alt text-error">
                {{ v$.password.$errors[0].$message }}
              </span>
            </label>
          </div>
        </div>
          
          <div class="flex justify-center">
            <div class="form-control mb-6">
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
          <router-link to="/signin" class="link link-primary text-sm">
            Sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { UserRole, useUserInfoStore } from '@/stores/user-info';
import router from '@/router';

type LoginForm = {
  email: string;
  password: string;
};

export default defineComponent({
  name: 'LoginView',
  setup() {
    const form = reactive<LoginForm>({
      email: '',
      password: ''
    });

    const showPassword = ref(false);

    const rules = {
      email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
      password: { required: helpers.withMessage('Password is required', required) }
    };

    const v$ = useVuelidate(rules, form);

    return { form, v$, showPassword };
  },
  methods: {
    async handleLogin(): Promise<void> {
      this.v$.$touch();
      if (this.v$.$invalid) return;

      try {
        const loginResponse = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.form.email,
            password: this.form.password
          })
        });

        if (!loginResponse.ok) {
          throw new Error('Login failed:' + await loginResponse.text());
        }

        const token = await loginResponse.json();

        const userResponse = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `${token.source}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information:' + await userResponse.text());
        }

        const userData = await userResponse.json();
        const userInfo = useUserInfoStore();
        userInfo.setUserInfo({
          email: this.form.email,
          nickname: userData.nickname,
          token: token.source,
          role: UserRole.User
        });
        router.push('/');

      } catch (error) {
        throw new Error('Login failed:' + error);
      }
    }
  }
});
</script>
