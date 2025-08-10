<template>
  <div class="min-h-screen flex items-center justify-center max-w-md mx-auto">
    <div class="card-body">
      <div class="flex justify-center min-h-[4rem] mb-4">
        <h1 class="card-title text-4xl font-bold">Welcome back!</h1>
      </div>

      <form @submit.prevent="handleLogin" class="w-full px-5">
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
</template>

<script setup lang="ts">
import router from '@/router';
import { useVuelidate } from '@vuelidate/core';
import {  reactive, ref } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { type UserInfo } from '@/model/users-management/User';
import { required, email, helpers } from '@vuelidate/validators';
import * as api from '@/api/users-management/requests/users';
import { useLoadingOverlayStore } from '@/stores/loading-overlay';

type LoginForm = {
  email: string;
  password: string;
};

const form = reactive<LoginForm>({
  email: '',
  password: ''
});

const loadingOverlay = useLoadingOverlayStore();
const showPassword = ref(false);

const rules = {
  email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
  password: { required: helpers.withMessage('Password is required', required) }
};

const v$ = useVuelidate(rules, form);

const handleLogin = async (): Promise<void> => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    loadingOverlay.startLoading();
    const token = await api.login(form.email, form.password);
    const user = await api.getUser(token);
    
    const userInfo = useUserInfoStore();
    const userInfoData: UserInfo = {
      email: form.email,
      nickname: user.nickname,
      token: token,
      role: user.role
    };
    userInfo.setUserInfo(userInfoData);
    
  } finally {
    loadingOverlay.stopLoading();
  }
  router.push('/');
}
</script>
