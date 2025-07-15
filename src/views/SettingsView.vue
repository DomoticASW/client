<template>
  <div class="min-h-screen flex justify-center bg-base-200">
    <div class="card-body">
      <div class="flex min-h-[4rem]">
        <h1 class="card-title text-3xl font-bold mb-2">Settings</h1>
      </div>

      <form @submit.prevent="handleSave" class="w-full">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nickname</span>
          </label>
          <input 
          v-model="form.nickname" 
          type="text" 
          placeholder="Your nickname" 
          class="input input-bordered w-full"
          :class="{ 'input-error': v$.nickname.$error }"
          @blur="v$.nickname.$touch()"
          />
          <div class="min-h-[1.5rem]">
            <label class="label py-0" v-if="v$.nickname.$error">
              <span class="label-text-alt text-error">
                {{ v$.nickname.$errors[0].$message }}
              </span>
            </label>
          </div>
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
          readonly
          :class="{ 'input-error': v$.email.$error }"
          @blur="v$.email.$touch()"
          />
          <div class="min-h-[1.5rem]">
            <label class="label py-0" v-if="v$.email.$error">
              <span class="label-text-alt text-error">
                {{ v$.email.$errors[0].$message }}
              </span>
            </label>
          </div>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">New password</span>
          </label>
          <div class="relative">
            <input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            class="input input-bordered w-full"
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
          <label class="label">
            <span class="label-text">Confirm new password</span>
          </label>
          <div class="relative">
            <input 
            v-model="form.confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            class="input input-bordered w-full"
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
          </div>
          <div class="min-h-[1.5rem]">
            <label class="label py-0" v-if="v$.confirmPassword.$error">
              <span class="label-text-alt text-error">
                {{ v$.confirmPassword.$errors[0].$message }}
              </span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-center">
          <div class="form-control mt-6">
            <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!hasChanges || v$.$invalid"
            :class="{ 'btn-disabled': !hasChanges || v$.$invalid }"
            >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';

type RegisterForm = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const initialForm = reactive<RegisterForm>({
      nickname: 'Your Nickname',
      email: 'your@email.com',
      password: '',
      confirmPassword: ''
    });
    
    const previousPassword = 'password';
    const form = reactive<RegisterForm>({ ...initialForm });
    const hasChanges = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const password = computed(() => form.password);
    const differentFromPrevious = (value: string) => value !== previousPassword;
    
    watch(form, (newValue) => {
      hasChanges.value = Object.keys(initialForm).some(
      key => newValue[key as keyof RegisterForm] !== initialForm[key as keyof RegisterForm]
      );
    }, { deep: true });
    
    const rules = {
      nickname: { required: helpers.withMessage('Nickname is required', required) },
      email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
      password: { 
        minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6)),
        different: helpers.withMessage('New password must be different from previous password', differentFromPrevious)
    },
      confirmPassword: { sameAsPassword: helpers.withMessage('Passwords must match', sameAs(password)) }
    };
    
    const v$ = useVuelidate(rules, form);

    return { form, v$, hasChanges, showPassword, showConfirmPassword };
  },
  methods: {
    handleSave(): void {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        console.log('Settings saved:', this.form);
      }
    }
  }
});
</script>
