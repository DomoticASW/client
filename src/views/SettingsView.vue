<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card-body">
      <h1 class="card-title text-3xl font-bold mb-2">Settings</h1>

      <form @submit.prevent="handleSave" class="space-y-4 w-full">
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
          <label class="label" v-if="v$.nickname.$error">
            <span class="label-text-alt text-error">
              {{ v$.nickname.$errors[0].$message }}
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
          readonly
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
            <span class="label-text">New password</span>
          </label>
          <input 
          v-model="form.password" 
          type="password" 
          placeholder="••••••••" 
          class="input input-bordered w-full"
          :class="{ 'input-error': v$.password.$error }"
          @input="v$.password.$touch()"
          />
          <label class="label" v-if="v$.password.$error">
            <span class="label-text-alt text-error">
              {{ v$.password.$errors[0].$message }}
            </span>
          </label>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Confirm New password</span>
          </label>
          <input 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="••••••••" 
          class="input input-bordered w-full"
          :class="{ 'input-error': v$.confirmPassword.$error }"
          @input="v$.confirmPassword.$touch()"
          />
          <label class="label" v-if="v$.confirmPassword.$error">
            <span class="label-text-alt text-error">
              {{ v$.confirmPassword.$errors[0].$message }}
            </span>
          </label>
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
    
    return { form, v$, hasChanges };
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
