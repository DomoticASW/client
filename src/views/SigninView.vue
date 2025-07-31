<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-center min-h-[4rem] mb-4">
          <h1 class="card-title text-3xl font-bold mb-2">Welcome!</h1>
        </div>
        
        <form @submit.prevent="handleSignin" class="w-full">

          <div class="form-control">
            <span class="label-text">Nickname</span>
            <label class="input validator w-full">
              <i class="fa-regular fa-user opacity-50"></i>
              <input 
                v-model="form.nickname" 
                type="text" 
                placeholder="Your nickname" 
                :class="{ 'input-error': v$.nickname.$error }"
                @blur="v$.nickname.$touch()"
              />
            </label>
            <div class="min-h-[1.5rem]">
              <label class="label py-0" v-if="v$.nickname.$error">
                <span class="label-text-alt text-error">
                  {{ v$.nickname.$errors[0].$message }}
                </span>
              </label>
            </div>
          </div>
        
          <div class="form-control">
            <span class="label-text">Email</span><br>
            <label class="input validator w-full">
              <i class="fa-regular fa-envelope opacity-50"></i>
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="your@email.com" 
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
        
          <div class="form-control">
            <span class="label-text">Confirm password</span>
            <div class="relative">
              <label class="input validator w-full">
                <i class="fa-solid fa-key opacity-50"></i>
                <input 
                  v-model="form.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  placeholder="••••••••" 
                  :class="{ 'input-error': v$.confirmPassword.$error }"
                  @blur="v$.confirmPassword.$touch()"
                />
                <button 
                    type="button" 
                    class="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                  <i 
                    :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" 
                    class="fas"
                  ></i>              
                </button>
              </label>
            </div>
            <div class="min-h-[1.5rem]">
              <label class="label py-0" v-if="v$.confirmPassword.$error">
                <span class="label-text-alt text-error">
                  {{ v$.confirmPassword.$errors[0].$message }}
                </span>
              </label>
            </div>
          </div>

          <p class="text-sm italic text-center">You'll need admin approval after registration</p>
          <div class="flex justify-center">
            <div class="form-control m-6">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="v$.$invalid"
                :class="{ 'btn-disabled': v$.$invalid }"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
        
        <div class="divider">OR</div>
        
        <div class="text-center">
          <p class="text-sm">Already have an account?</p>
          <router-link to="/login" class="link link-primary text-sm">
            Log in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';
import * as api from '@/api/api';

type SigninForm = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default defineComponent({
  name: 'SigninView',
  setup() {
    const form = reactive<SigninForm>({
      nickname: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const password = computed(() => form.password);

    const rules = {
      nickname: { required: helpers.withMessage('Nickname is required', required) },
      email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
      password: { required: helpers.withMessage('Password is required', required), minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6)) },
      confirmPassword: {
        required: helpers.withMessage('Confirm Password is required', required),
        sameAsPassword: helpers.withMessage('Passwords must match', sameAs(password))
      }
    };

    const v$ = useVuelidate(rules, form);

    return { form, v$, showPassword, showConfirmPassword };
  },
  methods: {
    async handleSignin(): Promise<void> {
      this.v$.$touch();
      if (this.v$.$invalid) return;

      await api.request('/api/registrationRequests', {
        method: 'POST',
        body: JSON.stringify({
          nickname: this.form.nickname,
          email: this.form.email,
          password: this.form.password
        })
      });

      this.$router.push('/login');
    }
  }
});
</script>
